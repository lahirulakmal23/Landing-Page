import QRCode from "qrcode";
import Ticket from "../Model/ticket.model.js";

const nicRegex = /^(?:\d{12}|\d{9}[VvXx])$/;
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").toLowerCase());
const clean = (s) => String(s || "").trim();

export const checkoutAndGenerateQR = async (req, res) => {
  try {
    let { nic, fullName, email, phone, type, count, payment } = req.body || {};

    // normalize
    nic = clean(nic).toUpperCase();
    fullName = clean(fullName);
    email = clean(email).toLowerCase();
    phone = clean(phone);
    type = clean(type).toLowerCase();

    // required presence
    if (!nic || !fullName || !email || !phone || !type || !payment) {
      return res.status(400).json({ message: "nic, fullName, email, phone, type and payment are required" });
    }

    // formats
    if (!nicRegex.test(nic)) return res.status(422).json({ message: "Invalid NIC format (12 digits or 9 digits + V/X)" });
    if (!isEmail(email)) return res.status(422).json({ message: "Invalid email address" });
    if (!["individual", "family"].includes(type)) {
      return res.status(422).json({ message: "type must be 'individual' or 'family'" });
    }

    // count rule
    if (type === "individual") {
      count = 1;
    } else {
      const parsed = Number.parseInt(count ?? "0", 10);
      if (!Number.isFinite(parsed) || parsed < 2) {
        return res.status(422).json({ message: "For family type, count is required and must be ≥ 2" });
      }
      count = parsed;
    }

    // payment validation (NEVER accept cvv)
    if (!payment.status || !["paid", "failed", "pending"].includes(payment.status)) {
      return res.status(422).json({ message: "payment.status must be 'paid' | 'failed' | 'pending'" });
    }
    if (payment.cvv || (payment.card && payment.card.cvv)) {
      return res.status(400).json({ message: "Do not send CVV to the server. Use payment tokens only." });
    }
    if (payment.status !== "paid") {
      return res.status(402).json({ message: "Payment not completed. QR will generate only after status='paid'." });
    }

    // Build QR payload
    const pid = clean(payment.paymentId);
    const payload =
      `CF|v=1|nic=${encodeURIComponent(nic)}|t=${type === "individual" ? "I" : "F"}|c=${count}` +
      (pid ? `|pid=${encodeURIComponent(pid)}` : "");

    // Generate QR (PNG data URL) BEFORE saving, so we can store it
    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
    });

    // prepare payment object (no sensitive data)
    const paymentDoc = {
      provider: clean(payment.provider) || "unknown",
      paymentId: pid || undefined,
      status: "paid",
      amount: payment.amount,
      currency: clean(payment.currency) || "LKR",
      card: payment.card
        ? {
            brand: clean(payment.card.brand),
            last4: clean(payment.card.last4),
            expMonth: payment.card.expMonth ?? undefined,
            expYear: payment.card.expYear ?? undefined,
          }
        : undefined,
    };

    let doc;

    if (type === "individual") {
      // Upsert: overwrite existing individual ticket for same NIC
      doc = await Ticket.findOneAndUpdate(
        { nic, type: "individual" },
        {
          nic,
          fullName,
          email,
          phone,
          type: "individual",
          count: 1,
          payload,
          qrDataUrl,          // <-- store QR
          payment: paymentDoc,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      // Family: create new ticket
      doc = await Ticket.create({
        nic,
        fullName,
        email,
        phone,
        type: "family",
        count,
        payload,
        qrDataUrl,            // <-- store QR
        payment: paymentDoc,
      });
    }

    return res.status(201).json({
      message: "Registration & payment successful. QR generated.",
      ticket: {
        id: doc._id,
        nic: doc.nic,
        fullName: doc.fullName,
        email: doc.email,
        phone: doc.phone,
        type: doc.type,
        count: doc.count,
        payload: doc.payload,
        qrDataUrl: doc.qrDataUrl,   // returned too
        createdAt: doc.createdAt,
      },
      qr: { dataUrl: doc.qrDataUrl },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Duplicate ticket" });
    }
    console.error("CHECKOUT ERROR >", err);
    return res.status(500).json({ message: "Server error" });
  }
};
