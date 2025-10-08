import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const nicRegex = /^(?:\d{12}|\d{9}[VvXx])$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^0\d{9}$/;

export default function RegisterPersonal() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic: "",
    type: "individual",
    count: "",
    password: "",
    confirm: "",
  });

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const isFamily = form.type === "family";

  const errors = useMemo(() => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "*";
    if (!form.email.trim()) e.email = "*";
    else if (!emailRegex.test(form.email.trim().toLowerCase())) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "*";
    else if (!phoneRegex.test(form.phone.trim())) e.phone = "Phone must be 10 digits (07XXXXXXXX)";
    if (!form.nic.trim()) e.nic = "*";
    else if (!nicRegex.test(form.nic.trim().toUpperCase())) e.nic = "NIC must be 12 digits or 9 + V/X";
    if (isFamily) {
      const c = parseInt(form.count, 10);
      if (!Number.isFinite(c) || c < 2) ;
    }
    if (!form.password) e.password = "*";
    if (!form.confirm) e.confirm = "*";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  }, [form, isFamily]);

  const next = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length) return;
    nav("/register/payment", { state: form });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0A0A3C] to-[#0F054C] px-4">
      <form
        onSubmit={next}
        noValidate
        className="bg-white/95 text-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl px-8 py-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Personal details</h2>
            <p className="text-sm text-gray-600">Step 1 of 2 — Fill in your personal information.</p>
          </div>
          <StepBadge step={1} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Full name" error={errors.fullName}>
            <input className="input" value={form.fullName} onChange={set("fullName")} placeholder="Dinusha Lakmal" />
          </Field>
          <Field label="Email" error={errors.email}>
            <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input
              className="input"
              type="tel"
              value={form.phone}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, ""); // digits only
                if (v.length <= 10) setForm((f) => ({ ...f, phone: v }));
              }}
              placeholder="07XXXXXXXX"
            />
          </Field>
          <Field label="NIC Number" error={errors.nic}>
            <input className="input" value={form.nic} onChange={set("nic")} placeholder="200012345678 or 200012345V" />
          </Field>
          <Field label="Category">
            <select className="input" value={form.type} onChange={set("type")}>
              <option value="individual">Individual</option>
              <option value="family">Family</option>
            </select>
          </Field>
          {isFamily && (
            <Field label="Count " error={errors.count}>
              <input className="input" type="number" min={2} value={form.count} onChange={set("count")} placeholder="2" />
            </Field>
          )}
          <Field label="Password" error={errors.password}>
            <input className="input" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
          </Field>
          <Field label="Confirm password" error={errors.confirm}>
            <input className="input" type="password" value={form.confirm} onChange={set("confirm")} placeholder="••••••••" />
          </Field>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-gray-500">Step 1 of 2</span>
          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className="rounded-xl bg-[#0000D1] px-8 py-3 text-white font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </form>
      <style>{`
        .input { @apply w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B7607]/70; }
      `}</style>
    </div>
  );
}

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
