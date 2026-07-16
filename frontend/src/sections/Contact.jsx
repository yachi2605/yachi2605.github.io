import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { IDENTITY } from "../data/content";
import { toast } from "sonner";
import Magnetic from "../components/Magnetic";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EASE = [0.16, 1, 0.3, 1];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("all fields required");
      return;
    }
    setBusy(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSent(true);
      toast.success("message.transmitted");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error("transmission failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="contact" className="relative py-32 md:py-40 border-t border-white/5" data-testid="contact">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span className="text-[#5B73FF]">06 /</span> contact — open channel
            </div>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="col-span-12 md:col-span-9 font-serif-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight font-light leading-[0.98]"
          >
            Let&apos;s build{" "}
            <span className="italic text-white/50">something</span>{" "}
            that ships.
          </motion.h2>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-16">
          {/* Left: form */}
          <form onSubmit={submit} className="col-span-12 md:col-span-7 space-y-8" data-testid="contact-form">
            <Field
              label="name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              testId="contact-name"
            />
            <Field
              label="email"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              testId="contact-email"
            />
            <Field
              label="message"
              value={form.message}
              onChange={(v) => setForm({ ...form, message: v })}
              multi
              testId="contact-message"
            />
            <Magnetic strength={0.35}>
              <button
                type="submit"
                disabled={busy || sent}
                data-testid="contact-submit"
                className="inline-flex items-center gap-3 bg-[#5B73FF] disabled:bg-white/10 disabled:text-white/40 text-white font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-white hover:text-[#0d0f1e] transition-colors duration-300"
              >
                {sent ? "message.transmitted ✓" : busy ? "transmitting..." : "transmit →"}
              </button>
            </Magnetic>
          </form>

          {/* Right: direct links */}
          <div className="col-span-12 md:col-span-5">
            <div className="border border-white/10 bg-[#14172a]/40 p-6 md:p-8 font-mono text-[12px] space-y-4">
              <div className="text-white/40 text-[10px] uppercase tracking-[0.25em] mb-2">
                direct_channels.log
              </div>
              <Row k="email">
                <a
                  href={`mailto:${IDENTITY.email}`}
                  data-testid="contact-email-link"
                  className="text-white hover:text-[#5B73FF] transition-colors duration-300 link-underline"
                >
                  {IDENTITY.email}
                </a>
              </Row>
              <Row k="linkedin">
                <a
                  href={IDENTITY.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="contact-linkedin-link"
                  className="text-white hover:text-[#5B73FF] transition-colors duration-300 link-underline"
                >
                  /in/yachi-darji ↗
                </a>
              </Row>
              <Row k="github">
                <a
                  href={IDENTITY.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="contact-github-link"
                  className="text-white hover:text-[#5B73FF] transition-colors duration-300 link-underline"
                >
                  /yachi2605 ↗
                </a>
              </Row>
              <Row k="location">Chicago · IL · CST</Row>
              <Row k="status">
                <span className="text-[#4ADE80]">actively_interviewing</span>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", multi = false, testId }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">
        {label}
      </label>
      {multi ? (
        <textarea
          data-testid={testId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full bg-transparent border-b border-white/15 focus:border-[#5B73FF] outline-none py-3 text-white text-lg font-serif-display transition-colors duration-300"
        />
      ) : (
        <input
          data-testid={testId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-b border-white/15 focus:border-[#5B73FF] outline-none py-3 text-white text-lg font-serif-display transition-colors duration-300"
        />
      )}
    </div>
  );
}

function Row({ k, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1 border-b border-white/[0.04] last:border-b-0">
      <span className="text-white/40 uppercase text-[10px] tracking-widest">{k}</span>
      <span>{children}</span>
    </div>
  );
}
