import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import { servicesByType } from '../config/services';

function getAvailableSlots(dateStr) {
  const allSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  ];
  if (!dateStr) return allSlots;
  // Deterministic pseudo-random availability per date
  const seed = new Date(dateStr).getDate() + new Date(dateStr).getMonth() * 3;
  return allSlots.filter((_, i) => (i * 7 + seed) % 5 !== 0 && (i + seed) % 4 !== 0);
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function maxDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 28);
  return d.toISOString().split('T')[0];
}

const EMPTY_FORM = { name: '', phone: '', service: '', date: todayStr(), time: '' };

export default function BookingModal({ open, onClose }) {
  const { config, theme } = useSiteConfig();
  const services = servicesByType[config.type] || servicesByType.barber;
  const isHair = config.type === 'hairdresser';

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const slots = getAvailableSlots(form.date);

  // Reset time if it's no longer available after date change
  useEffect(() => {
    if (form.time && !slots.includes(form.time)) {
      setForm((f) => ({ ...f, time: '' }));
    }
  }, [form.date]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    if (!form.service) e.service = 'Please select a service.';
    if (!form.date) e.date = 'Please choose a date.';
    if (!form.time) e.time = 'Please choose a time slot.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const handleClose = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    onClose();
  }, [onClose]);

  const inputStyle = {
    backgroundColor: theme.bgSection,
    color: theme.text,
    borderColor: theme.border,
    fontFamily: theme.fontBody,
    outline: 'none',
  };

  const labelStyle = { color: theme.textSub, fontFamily: theme.fontBody };
  const errorStyle = { color: '#EF4444', fontFamily: theme.fontBody };

  const selectedSvc = services.find((s) => s.id === form.service);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl"
            style={{ backgroundColor: theme.bgCard }}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <SuccessState theme={theme} form={form} svc={selectedSvc} onClose={handleClose} isHair={isHair} />
            ) : (
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <h2
                      className="font-heading font-bold text-2xl"
                      style={{ color: theme.text, letterSpacing: isHair ? '0.01em' : '0.05em' }}
                    >
                      Book Appointment
                    </h2>
                    <p className="text-sm mt-1" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                      {config.name} · {config.location}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-2xl leading-none mt-0.5 transition-opacity hover:opacity-60"
                    style={{ color: theme.textSub }}
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Name */}
                  <Field label="Full Name" error={errors.name} style={labelStyle} errorStyle={errorStyle}>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={set('name')}
                      className="w-full px-4 py-3 rounded-lg border text-sm"
                      style={{ ...inputStyle, borderColor: errors.name ? '#EF4444' : theme.border }}
                    />
                  </Field>

                  {/* Phone */}
                  <Field label="Phone Number" error={errors.phone} style={labelStyle} errorStyle={errorStyle}>
                    <input
                      type="tel"
                      placeholder="e.g. 07700 900000"
                      value={form.phone}
                      onChange={set('phone')}
                      className="w-full px-4 py-3 rounded-lg border text-sm"
                      style={{ ...inputStyle, borderColor: errors.phone ? '#EF4444' : theme.border }}
                    />
                  </Field>

                  {/* Service */}
                  <Field label="Service" error={errors.service} style={labelStyle} errorStyle={errorStyle}>
                    <select
                      value={form.service}
                      onChange={set('service')}
                      className="w-full px-4 py-3 rounded-lg border text-sm appearance-none cursor-pointer"
                      style={{ ...inputStyle, borderColor: errors.service ? '#EF4444' : theme.border }}
                    >
                      <option value="">Select a service…</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.priceLabel} ({s.duration})
                        </option>
                      ))}
                    </select>
                  </Field>

                  {/* Date + Time row */}
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Date" error={errors.date} style={labelStyle} errorStyle={errorStyle}>
                      <input
                        type="date"
                        value={form.date}
                        min={todayStr()}
                        max={maxDateStr()}
                        onChange={set('date')}
                        className="w-full px-4 py-3 rounded-lg border text-sm cursor-pointer"
                        style={{ ...inputStyle, borderColor: errors.date ? '#EF4444' : theme.border }}
                      />
                    </Field>

                    <Field label={`Time (${slots.length} available)`} error={errors.time} style={labelStyle} errorStyle={errorStyle}>
                      <select
                        value={form.time}
                        onChange={set('time')}
                        className="w-full px-4 py-3 rounded-lg border text-sm appearance-none cursor-pointer"
                        style={{ ...inputStyle, borderColor: errors.time ? '#EF4444' : theme.border }}
                      >
                        <option value="">Choose time…</option>
                        {slots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* Summary */}
                  {selectedSvc && form.date && form.time && (
                    <motion.div
                      className="p-4 rounded-lg text-sm"
                      style={{ backgroundColor: `${theme.accent}15`, border: `1px solid ${theme.accent}30` }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="font-semibold mb-1" style={{ color: theme.text, fontFamily: theme.fontBody }}>
                        Booking Summary
                      </p>
                      <p style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                        {selectedSvc.name} · {selectedSvc.priceLabel} · {selectedSvc.duration}
                      </p>
                      <p style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                        {new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {form.time}
                      </p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 text-sm font-bold uppercase tracking-widest rounded-lg mt-1 transition-all duration-200 hover:opacity-90 active:scale-98"
                    style={{
                      backgroundColor: theme.accent,
                      color: isHair ? '#fff' : '#0F0F0F',
                      fontFamily: theme.fontBody,
                      boxShadow: `0 4px 20px ${theme.accent}44`,
                    }}
                  >
                    Confirm Booking
                  </button>

                  <p className="text-xs text-center" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                    We&apos;ll call you on the number provided to confirm.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, error, children, style, errorStyle }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={style}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs" style={errorStyle}>{error}</p>}
    </div>
  );
}

function SuccessState({ theme, form, svc, onClose, isHair }) {
  return (
    <motion.div
      className="p-8 flex flex-col items-center text-center gap-5"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${theme.accent}22` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 14, delay: 0.1 }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={theme.accent} />
        </svg>
      </motion.div>
      <h2
        className="font-heading font-bold text-2xl"
        style={{ color: theme.text, letterSpacing: isHair ? '0.01em' : '0.05em' }}
      >
        Booking Received!
      </h2>
      <p style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
        Thanks <strong style={{ color: theme.text }}>{form.name}</strong>. We&apos;ll call you on{' '}
        <strong style={{ color: theme.text }}>{form.phone}</strong> to confirm your appointment.
      </p>
      {svc && (
        <div
          className="w-full p-4 rounded-lg text-sm text-left"
          style={{ backgroundColor: `${theme.accent}12`, border: `1px solid ${theme.accent}25` }}
        >
          <p className="font-semibold mb-1" style={{ color: theme.text, fontFamily: theme.fontBody }}>
            {svc.name} · {svc.priceLabel}
          </p>
          <p style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
            {new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at {form.time}
          </p>
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-2 px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-opacity hover:opacity-80"
        style={{
          backgroundColor: theme.accent,
          color: isHair ? '#fff' : '#0F0F0F',
          fontFamily: theme.fontBody,
        }}
      >
        Done
      </button>
    </motion.div>
  );
}
