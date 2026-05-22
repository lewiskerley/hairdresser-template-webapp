import { useState } from 'react';
import { encodeParams, generateLink, DEFAULTS } from '../utils/params';

const FIELDS = [
  { key: 'name',     label: 'Business Name',   type: 'text',   placeholder: 'e.g. The Fade Factory' },
  { key: 'type',     label: 'Business Type',   type: 'select', options: ['barber', 'hairdresser'] },
  { key: 'location', label: 'Town / City',     type: 'text',   placeholder: 'e.g. Manchester' },
  { key: 'phone',    label: 'Phone Number',    type: 'text',   placeholder: 'e.g. 07700 123456' },
  { key: 'address',  label: 'Full Address (for map)', type: 'text', placeholder: 'e.g. 12 High Street, Manchester, M1 1AB' },
  { key: 'color',    label: 'Accent Color',    type: 'select', options: ['gold', 'rose', 'blue', 'green', 'white'] },
];

export default function AdminPage() {
  const [form, setForm] = useState({ ...DEFAULTS });
  const [copied, setCopied] = useState(false);

  const link = generateLink(form, window.location.origin);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111', color: '#f5f5f5', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: '#C9963D', letterSpacing: '0.08em', fontFamily: 'Rajdhani, sans-serif', textTransform: 'uppercase' }}>
          Link Generator
        </h1>
        <p style={{ color: '#9CA3AF', marginBottom: 36, fontSize: 14 }}>
          Fill in the client details below to generate an encoded demo link.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FIELDS.map((f) => (
            <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF' }}>
                {f.label}
              </label>
              {f.type === 'select' ? (
                <select
                  value={form[f.key]}
                  onChange={set(f.key)}
                  style={{ backgroundColor: '#1A1A1A', color: '#f5f5f5', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
                >
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  value={form[f.key]}
                  onChange={set(f.key)}
                  placeholder={f.placeholder}
                  style={{ backgroundColor: '#1A1A1A', color: '#f5f5f5', border: '1px solid #333', borderRadius: 8, padding: '10px 14px', fontSize: 14 }}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36, padding: 20, backgroundColor: '#1A1A1A', borderRadius: 10, border: '1px solid #2A2A2A' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Generated Link
          </p>
          <p style={{ fontSize: 12, wordBreak: 'break-all', color: '#C9963D', marginBottom: 16, lineHeight: 1.6 }}>
            {link}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={copy}
              style={{
                backgroundColor: '#C9963D', color: '#0F0F0F', border: 'none', borderRadius: 8,
                padding: '10px 20px', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'transparent', color: '#C9963D', border: '1px solid #C9963D',
                borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: 13,
                letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block',
              }}
            >
              Preview →
            </a>
          </div>
        </div>

        <p style={{ marginTop: 20, fontSize: 12, color: '#555' }}>
          Access this page at <code style={{ color: '#777' }}>/?admin=1</code> — it is not linked from the main site.
        </p>
      </div>
    </div>
  );
}
