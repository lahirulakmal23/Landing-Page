// src/controllers/scan.controller.js
import mongoose from "mongoose";
import Ticket from "../Model/ticket.model.js";

/** Try to parse your custom payload like: CF|v=1|nic=...|cn=... */
function parseCustomCF(text) {
  if (!text || typeof text !== "string") return null;
  if (!text.startsWith("CF|")) return null;
  const parts = Object.fromEntries(
    text.split("|").slice(1).map(kv => {
      const [k, v] = kv.split("=");
      return [k, decodeURIComponent(v ?? "")];
    })
  );
  return {
    nic: parts.nic || "",
    counterName: parts.cn || "",
    raw: parts,
  };
}

/** Accepts either reservationId (24-hex), or raw qrText */
export const scanAndCheckIn = async (req, res) => {
  try {
    const { reservationId, qrText, checkedInBy } = req.body || {};
    let ticket = null;

    // 1) If ObjectId provided directly
    if (reservationId && /^[a-f0-9]{24}$/i.test(reservationId)) {
      ticket = await Ticket.findById(reservationId);
    }

    // 2) If not found yet, and qrText is provided
    if (!ticket && qrText) {
      // (a) reservation:<24hex> or raw <24hex>
      const m = String(qrText).match(/reservation:([a-f0-9]{24})/i) || String(qrText).match(/^[a-f0-9]{24}$/i);
      if (m) {
        ticket = await Ticket.findById(m[1] || m[0]);
      }

      // (b) custom CF payload → find by NIC
      if (!ticket) {
        const cf = parseCustomCF(qrText);
        if (cf?.nic) {
          ticket = await Ticket.findOne({ nic: cf.nic }).sort({ createdAt: -1 });
        }
      }
    }

    if (!ticket) {
      return res.status(404).json({ ok: false, message: "Ticket not found for this QR." });
    }

    // 3) If already checked in, return idempotent success
    if (ticket.checkedIn) {
      return res.json({
        ok: true,
        alreadyCheckedIn: true,
        ticket: {
          id: String(ticket._id),
          fullName: ticket.fullName,
          nic: ticket.nic,
          type: ticket.type,
          count: ticket.type === "family" ? ticket.count : 1,
          phone: ticket.phone,
          paymentStatus: ticket?.payment?.status,
          amount: ticket?.payment?.amount,
          counter: ticket.assignedCounterName || null,
          checkedInAt: ticket.checkedInAt,
        },
      });
    }

    // 4) Mark check-in (once)
    ticket.checkedIn = true;
    ticket.checkedInAt = new Date();
    if (checkedInBy) ticket.checkedInBy = String(checkedInBy);
    await ticket.save();

    return res.json({
      ok: true,
      alreadyCheckedIn: false,
      ticket: {
        id: String(ticket._id),
        fullName: ticket.fullName,
        nic: ticket.nic,
        type: ticket.type,
        count: ticket.type === "family" ? ticket.count : 1,
        phone: ticket.phone,
        paymentStatus: ticket?.payment?.status,
        amount: ticket?.payment?.amount,
        counter: ticket.assignedCounterName || null,
        checkedInAt: ticket.checkedInAt,
      },
    });
  } catch (err) {
    console.error("scan error:", err);
    return res.status(500).json({ ok: false, message: err?.message || "Scan failed" });
  }
};
