// src/pages/register/RegisterPayment.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = "http://localhost:3001/api/checkout";
const nicRegex = /^(?:\d{12}|\d{9}[VvXx])$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^0\d{9}$/;

export default function RegisterPayment() {
  const nav = useNavigate();
  const { state: personal } = useLocation();

  // If the user refreshes and we lose step-1 data, send them back
  useEffect(() => {
    if (!personal) nav("/register");
  }, [personal, nav]);

  const [payment, setPayment] = useState({
    provider: "stripe",
    status: "paid",
    amount: "",
    currency: "LKR",
    card: { brand: "", last4: "", expMonth: "", expYear: "" },
  });

  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null);

  const setP = (k) => (e) => setPayment((p) => ({ ...p, [k]: e.target.value }));
  const setCard = (k) => (e) =>
    setPayment((p) => ({ ...p, card: { ...p.card, [k]: e.target.value } }));

  const isFamily = personal?.type === "family";

  // Validate step1 + step2 before submit
  const errors = useMemo(() => {
    const e = {};
    if (!personal?.fullName?.trim()) e.fullName = "Required";
    if (!emailRegex.test(String(personal?.email || "").toLowerCase())) e.email = "Invalid email";
    if (!phoneRegex.test(String(personal?.phone || ""))) e.phone = "Use 07XXXXXXXX";
    if (!nicRegex.test(String(personal?.nic || "").toUpperCase())) e.nic = "NIC invalid";
    if (!["individual", "family"].includes(personal?.type)) e.type = "Pick category";
    if (isFamily) {
      const c = parseInt(personal?.count, 10);
      if (!Number.isFinite(c) || c < 2) e.count = "Family count must be ≥ 2";
    }
    if (!["paid", "failed", "pending"].includes(payment.status)) e.paymentStatus = "Invalid status";
    if (payment.status !== "paid") e.mustPaid = "Must be 'paid' to generate QR";
    return e;
  }, [personal, isFamily, payment]);

  const back = () => nav("/register");

  const submit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    setServerError("");
    setResult(null);

    const payload = {
      nic: personal.nic.trim(),
      fullName: personal.fullName.trim(),
      email: personal.email.trim(),
      phone: personal.phone.trim(),
      type: personal.type,
      ...(isFamily ? { count: parseInt(personal.count, 10) } : {}),
      payment: {
        provider: payment.provider || "stripe",
        status: payment.status,
        amount: payment.amount ? Number(payment.amount) : undefined,
        currency: payment.currency || "LKR",
        card: {
          brand: payment.card.brand || undefined,
          last4: payment.card.last4 || undefined,
          expMonth: payment.card.expMonth ? Number(payment.card.expMonth) : undefined,
          expYear: payment.card.expYear ? Number(payment.card.expYear) : undefined,
        },
      },
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.message || `Error ${res.status}`);
      } else {
        setResult(data); // { ticket, qr: { dataUrl }, ... }
        setOpen(true);
      }
    } catch (err) {
      setServerError(err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0A0A3C] to-[#0F054C] px-4">
      {/* Card */}
      <form
        onSubmit={submit}
        noValidate
        className="bg-white/95 text-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl px-8 py-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Payment details</h2>
            <p className="text-sm text-gray-600">
              Step 2 of 2 — Status must be <span className="font-semibold">paid</span> to generate your QR.
            </p>

            {/* Small summary for confidence */}
            {personal && (
              <div className="mt-3 text-xs text-gray-500">
                <span className="mr-4">Name: <span className="text-gray-700">{personal.fullName}</span></span>
                <span className="mr-4">NIC: <span className="text-gray-700">{personal.nic}</span></span>
                <span>Type: <span className="text-gray-700">{personal.type}{isFamily ? ` (${personal.count})` : ""}</span></span>
              </div>
            )}
          </div>
          <StepBadge step={2} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Payment Provider">
            <input className="input" value={payment.provider} onChange={setP("provider")} placeholder="stripe" />
          </Field>

          <Field label="Payment Status" error={errors.mustPaid || errors.paymentStatus}>
            <select className="input" value={payment.status} onChange={setP("status")}>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
              <option value="pending">pending</option>
            </select>
          </Field>

          <Field label="Amount (LKR)">
            <input className="input" type="number" value={payment.amount} onChange={setP("amount")} placeholder="2500" />
          </Field>

          <div />{/* spacer to balance rows */}

          <Field label="Card Brand">
            <input className="input" value={payment.card.brand} onChange={setCard("brand")} placeholder="visa" />
          </Field>

          <Field label="Card Last 4">
            <input className="input" value={payment.card.last4} onChange={setCard("last4")} placeholder="4242" />
          </Field>

          <Field label="Exp. Month">
            <input className="input" type="number" min={1} max={12} value={payment.card.expMonth} onChange={setCard("expMonth")} placeholder="12" />
          </Field>

          <Field label="Exp. Year">
            <input className="input" type="number" min={2024} value={payment.card.expYear} onChange={setCard("expYear")} placeholder="2028" />
          </Field>
        </div>

        {/* Server error */}
        {serverError && <div className="text-red-600 text-sm mt-3">{serverError}</div>}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="rounded-xl bg-gray-200 px-8 py-3 text-gray-800 font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={submitting || Object.keys(errors).length > 0}
            className="rounded-xl bg-[#0000D1] px-8 py-3 text-white font-semibold shadow-lg hover:bg-[#000075] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0000D1]"
          >
            {submitting ? "Submitting..." : "Create account & Generate QR"}
          </button>
        </div>
      </form>

      {/* Success modal with QR */}
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
              <div className="mt-2">
                <img
                  alt="QR Code"
                  src={result.qr?.dataUrl || result.ticket?.qrDataUrl}
                  style={{ width: 256, height: 256, imageRendering: "pixelated", border: "1px solid #ddd" }}
                />
              </div>
              <a
                className="mt-2 inline-block rounded-xl bg-[#0000D1] px-4 py-2 text-white hover:bg-[#000075]"
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

      {/* Input style (same as Personal) */}
      <style>{`
        .input {
          @apply w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B7607]/70;
        }
      `}</style>
    </div>
  );
}

/* ---------- small UI helpers ---------- */
function Field({ label, children, error }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </label>
  );
}

function StepBadge({ step }) {
  return (
    <div className="rounded-full bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1">
      Step {step} of 2
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
