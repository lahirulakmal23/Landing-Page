import React, { useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom"; // not needed now; we call the API directly

const API = "http://localhost:3001/api/checkout";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    type: "individual",   // "individual" | "family"
    count: "",            // only used when family
    // optional fields you already had:
    password: "",
    confirm: "",
    newsletter: true,
    avatar: null,
    // payment (no CVV — your backend rejects it)
    payment: {
      provider: "stripe",
      paymentId: "",
      status: "paid",     // must be "paid" to generate QR
      amount: "",
      currency: "LKR",
      card: {
        brand: "",
        last4: "",
        expMonth: "",
        expYear: "",
      },
    },
  });

  const [open, setOpen] = useState(false);      // reuse your modal to show success
  const [dragActive, setDragActive] = useState(false);
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState(null);   // server response here
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef(null);

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const setPayment = (k) => (e) =>
    setForm((f) => ({ ...f, payment: { ...f.payment, [k]: e.target.value } }));

  const setCard = (k) => (e) =>
    setForm((f) => ({
      ...f,
      payment: { ...f.payment, card: { ...f.payment.card, [k]: e.target.value } },
    }));

  const onPick = (file) => {
    if (!file) return;
    setForm((f) => ({ ...f, avatar: file }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    onPick(file);
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const avatarURL = useMemo(
    () => (form.avatar ? URL.createObjectURL(form.avatar) : null),
    [form.avatar]
  );

  const isFamily = form.type === "family";
  const nicRegex = /^(?:\d{12}|\d{9}[VvXx])$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRegex = /^0\d{9}$/; // e.g. 07XXXXXXXX

  const errors = useMemo(() => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!emailRegex.test(form.email.trim().toLowerCase())) e.email = "Invalid email";
    if (!phoneRegex.test(form.phone.trim())) e.phone = "Use format 07XXXXXXXX";
    if (!nicRegex.test(form.nic.trim().toUpperCase())) e.nic = "12 digits or 9 digits + V/X";
    if (!["individual", "family"].includes(form.type)) e.type = "Pick a category";
    if (isFamily) {
      const c = parseInt(form.count, 10);
      if (!Number.isFinite(c) || c < 2) e.count = "Family count must be ≥ 2";
    }
    if (form.payment.status !== "paid") e.paymentStatus = "Must be 'paid' to generate QR";
    return e;
  }, [form, isFamily]);

  const isValid = Object.keys(errors).length === 0;

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    setResult(null);
    if (!isValid) return;

    // Build payload to match your backend model/controller
    const payload = {
      nic: form.nic.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      type: form.type,
      ...(isFamily ? { count: parseInt(form.count, 10) } : {}), // backend forces 1 for individual
      payment: {
        provider: form.payment.provider || "stripe",
        paymentId: form.payment.paymentId || undefined,
        status: form.payment.status, // must be "paid"
        amount: form.payment.amount ? Number(form.payment.amount) : undefined,
        currency: form.payment.currency || "LKR",
        card: {
          brand: form.payment.card.brand || undefined,
          last4: form.payment.card.last4 || undefined,
          expMonth: form.payment.card.expMonth
            ? Number(form.payment.card.expMonth)
            : undefined,
          expYear: form.payment.card.expYear
            ? Number(form.payment.card.expYear)
            : undefined,
        },
      },
    };

    try {
      setSubmitting(true);
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.message || `Error ${res.status}`);
      } else {
        setResult(data);   // contains ticket + qr.dataUrl (and qrDataUrl if stored)
        setOpen(true);     // open your existing modal to show success
      }
    } catch (err) {
      setServerError(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A3C] to-[#0F054C] text-gray-900 relative overflow-hidden">
      {/* soft gold orbs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#9B7607]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#9B7607]/20 blur-3xl" />

      <header className="mx-auto max-w-7xl px-4 pt-8 md:pt-12">
        <div className="flex items-center justify-between text-white">
          <div className="text-2xl md:text-3xl font-bold tracking-wide">CrowdFlow</div>
          <nav className="hidden md:flex gap-6 text-white/80 text-sm">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#" className="hover:text-white">Events</a>
            <a href="#" className="hover:text-white">Support</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* LEFT */}
          <section className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-xl min-h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A3C]/80 via-[#0F054C]/60 to-transparent" />
            <div className="relative z-10 p-8 md:p-10 text-white flex h-full flex-col">
              <div className="max-w-sm">
                <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Create your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#FDE68A] to-[#9B7607]">Customer Account</span>
                </h1>
                <p className="mt-3 text-white/80">Join CrowdFlow to enjoy smooth check-ins, guided parking, and real-time updates during events.</p>
              </div>
              <div className="mt-auto grid grid-cols-3 gap-3 text-sm">
                <StatCard label="Events served" value="250+" />
                <StatCard label="Avg. wait time" value="-38%" />
                <StatCard label="Happy users" value="20k+" />
              </div>
            </div>
          </section>

          {/* RIGHT: Form */}
          <section className="bg-white rounded-3xl shadow-2xl ring-1 ring-gray-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#FDE68A] via-[#9B7607] to-[#0F054C]" />
            <form onSubmit={submit} className="p-6 sm:p-8 md:p-10 space-y-6" noValidate>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Registration</h2>
                  <p className="text-sm text-gray-600">Submit to generate your QR (status must be “paid”).</p>
                </div>
              </div>

              {/* Inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" error={errors.fullName}>
                  <input className="input" placeholder="e.g., Dinusha Lakmal" value={form.fullName} onChange={set("fullName")} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input className="input" type="tel" placeholder="07XXXXXXXX" value={form.phone} onChange={set("phone")} />
                </Field>
                <Field label="NIC Number" error={errors.nic}>
                  <input className="input" type="text" placeholder="200012345678 or 200012345V" value={form.nic} onChange={set("nic")} />
                </Field>

                {/* Category */}
                <Field label="Category">
                  <select className="input" value={form.type} onChange={set("type")}>
                    <option value="individual">Individual (count = 1)</option>
                    <option value="family">Family</option>
                  </select>
                </Field>

                {/* Count only for family */}
                {isFamily && (
                  <Field label="Count (≥ 2)" error={errors.count}>
                    <input className="input" type="number" min={2} placeholder="2" value={form.count} onChange={set("count")} />
                  </Field>
                )}

                {/* Optional password fields you already had (kept; not sent to API) */}
                <Field label="Password">
                  <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
                </Field>
                <Field label="Confirm password">
                  <input className="input" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} />
                </Field>
              </div>

              {/* Payment (minimal fields; no CVV) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Payment Provider">
                  <input className="input" value={form.payment.provider} onChange={setPayment("provider")} placeholder="stripe" />
                </Field>
                <Field label="Payment ID">
                  <input className="input" value={form.payment.paymentId} onChange={setPayment("paymentId")} placeholder="pi_XXXX" />
                </Field>
                <Field label="Payment Status" error={errors.paymentStatus}>
                  <select className="input" value={form.payment.status} onChange={setPayment("status")}>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                    <option value="pending">pending</option>
                  </select>
                </Field>
                <Field label="Amount (LKR)">
                  <input className="input" type="number" value={form.payment.amount} onChange={setPayment("amount")} placeholder="2500" />
                </Field>

                <Field label="Card Brand">
                  <input className="input" value={form.payment.card.brand} onChange={setCard("brand")} placeholder="visa" />
                </Field>
                <Field label="Card Last 4">
                  <input className="input" value={form.payment.card.last4} onChange={setCard("last4")} placeholder="4242" />
                </Field>
                <Field label="Exp. Month">
                  <input className="input" type="number" min={1} max={12} value={form.payment.card.expMonth} onChange={setCard("expMonth")} placeholder="12" />
                </Field>
                <Field label="Exp. Year">
                  <input className="input" type="number" min={2024} value={form.payment.card.expYear} onChange={setCard("expYear")} placeholder="2028" />
                </Field>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="text-red-600 text-sm -mt-2">{serverError}</div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !isValid}
                className="w-full rounded-2xl bg-[#9B7607] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#8a6710] active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B7607]"
              >
                {submitting ? "Submitting..." : "Create account & Generate QR"}
              </button>
            </form>
          </section>
        </div>
      </main>

      {/* Success Modal — show QR */}
      {open && (
        <Modal onClose={() => setOpen(false)}>
          {result?.ticket ? (
            <div className="space-y-3 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 grid place-items-center">
                <span className="text-2xl">✓</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900">Registered Successfully</h4>
              <p className="text-gray-600">
                {result.ticket.fullName} — {result.ticket.type}
                {result.ticket.type === "family" ? ` (${result.ticket.count})` : ""}
              </p>

              {/* Show QR returned by backend */}
              <div className="mt-2">
                <img
                  alt="QR Code"
                  src={result.qr?.dataUrl || result.ticket?.qrDataUrl}
                  style={{ width: 256, height: 256, imageRendering: "pixelated", border: "1px solid #ddd" }}
                />
              </div>

              {/* Download */}
              <a
                className="mt-2 inline-block rounded-xl bg-[#9B7607] px-4 py-2 text-white hover:bg-[#8a6710]"
                href={result.qr?.dataUrl || result.ticket?.qrDataUrl}
                download={`ticket_${result.ticket.type}_${result.ticket.nic}.png`}
              >
                Download QR
              </a>
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <h4 className="text-xl font-semibold text-gray-900">Something went wrong</h4>
              <p className="text-gray-600">{serverError || "Please try again."}</p>
            </div>
          )}
        </Modal>
      )}

      {/* scoped styles (your original utility) */}
      <style>{`
        .input { @apply w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B7607]/60; }
      `}</style>
    </div>
  );
}

function Field({ label, children, error }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </label>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white">
      <p className="text-xs text-white/70">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-gray-400 hover:text-gray-700">✕</button>
        {children}
      </div>
    </div>
  );
}
