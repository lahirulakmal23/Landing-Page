import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";


export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nic:"",
    password: "",
    confirm: "",
    newsletter: true,
    avatar: null,
  });
  const [open, setOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef(null);

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
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

  const submit = (e) => {
    e.preventDefault();
    // FRONTEND-ONLY: just open the modal
    setOpen(true);
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
          {/* LEFT: Hero + image collage */}
          <section className="relative rounded-3xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur-xl min-h-[520px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A3C]/80 via-[#0F054C]/60 to-transparent" />

            {/* Image collage */}
            
            {/* Copy on top */}
            <div className="relative z-10 p-8 md:p-10 text-white flex h-full flex-col">
              <div className="max-w-sm">
                <h1 className="text-3xl md:text-4xl font-semibold leading-tight">Create your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#FDE68A] to-[#9B7607]">Customer Account</span>
                </h1>
                <p className="mt-3 text-white/80">Join CrowdFlow to enjoy smooth check‑ins, guided parking, and real‑time updates during events.</p>
              </div>

              <div className="mt-auto grid grid-cols-3 gap-3 text-sm">
                <StatCard label="Events served" value="250+" />
                <StatCard label="Avg. wait time" value="-38%" />
                <StatCard label="Happy users" value="20k+" />
              </div>
            </div>
          </section>

          {/* RIGHT: Form card */}
          <section className="bg-white rounded-3xl shadow-2xl ring-1 ring-gray-100 overflow-hidden">
            {/* top bar */}
            <div className="h-2 bg-gradient-to-r from-[#FDE68A] via-[#9B7607] to-[#0F054C]" />

            <form onSubmit={submit} className="p-6 sm:p-8 md:p-10 space-y-6">
              <div className="flex items-start gap-4">
                {/* Avatar uploader */}
               

                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Registration</h2>
                  <p className="text-sm text-gray-600">Frontend demo · no validations · no network requests</p>
                </div>
              </div>

              {/* Inputs grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name">
                  <input className="input" placeholder="e.g., Dinusha Lakmal" value={form.fullName} onChange={set("fullName")} />
                </Field>
                <Field label="Email">
                  <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
                </Field>
                <Field label="Phone">
                  <input className="input" type="tel" placeholder="+94 7X XXX XXXX" value={form.phone} onChange={set("phone")} />
                </Field>
                <Field label="NIC Number">
                  <input className="input" type="text" placeholder="e.g., 200045678901" value={form.nic} onChange={set("nic")}/>
                </Field>  
                <Field label="Password">
                  <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} />
                </Field>
                <Field label="Confirm password">
                  <input className="input" type="password" placeholder="••••••••" value={form.confirm} onChange={set("confirm")} />
                </Field>
              </div>
              {/* Call to action */}
              <Link to ='/payment'>
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#9B7607] px-6 py-3 text-white font-semibold shadow-lg hover:bg-[#8a6710] active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9B7607]"
              >
                Create account
              </button>
              </Link>

              {/* Social row (non-functional) */}
            
            </form>
          </section>
        </div>
      </main>

      {/* Success Modal */}
      {open && (
        <Modal onClose={() => setOpen(false)}>
          <div className="space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 grid place-items-center">
              <span className="text-2xl">✓</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-900">Welcome to CrowdFlow</h4>
            <p className="text-gray-600">This was a frontend‑only demo. No data was sent.</p>
            <button onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-[#9B7607] px-4 py-2 text-white hover:bg-[#8a6710]">Go to dashboard</button>
          </div>
        </Modal>
      )}

      {/* scoped styles */}
      <style>{`
        .input { @apply w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#9B7607]/60; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-800">{label}</span>
      <div className="mt-1">{children}</div>
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

function SocialBtn({ label }) {
  return (
    <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 active:scale-[.99]">{label}</button>
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
