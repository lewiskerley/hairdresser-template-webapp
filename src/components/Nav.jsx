import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';

const links = [
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav({ onBookNow }) {
  const { config, theme } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLink = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const barStyle = {
    backgroundColor: scrolled ? `${theme.bg}f5` : 'rgba(0,0,0,0.25)',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? `1px solid ${theme.border}` : '1px solid transparent',
    transition: 'all 0.3s ease',
  };

  const linkColor = scrolled ? theme.textSub : 'rgba(255,255,255,0.85)';
  const linkHoverColor = scrolled ? theme.accent : '#ffffff';
  const iconColor = scrolled ? theme.text : '#ffffff';

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={barStyle}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => handleLink(e, '#top')}
          className="font-heading font-bold text-xl tracking-widest uppercase"
          style={{ color: scrolled ? theme.accent : '#ffffff', letterSpacing: '0.12em' }}
        >
          {config.name}
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleLink(e, l.href)}
              className="text-sm font-medium tracking-wider uppercase transition-colors duration-200"
              style={{ color: linkColor, fontFamily: theme.fontBody }}
              onMouseEnter={(e) => (e.target.style.color = linkHoverColor)}
              onMouseLeave={(e) => (e.target.style.color = linkColor)}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onBookNow}
            className="px-5 py-2 text-sm font-semibold uppercase tracking-widest rounded transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: theme.accent,
              color: config.type === 'hairdresser' ? '#fff' : '#0F0F0F',
              fontFamily: theme.fontBody,
            }}
          >
            Book Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              backgroundColor: iconColor,
              transform: open ? 'rotate(45deg) translate(4px, 4px)' : 'none',
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{ backgroundColor: iconColor, opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              backgroundColor: theme.text,
              transform: open ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden px-5 pb-6 pt-2 flex flex-col gap-4"
            style={{ backgroundColor: theme.bg, borderTop: `1px solid ${theme.border}` }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleLink(e, l.href)}
                className="text-base font-medium tracking-wider uppercase py-1"
                style={{ color: theme.textSub, fontFamily: theme.fontBody }}
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onBookNow(); }}
              className="mt-2 py-3 text-sm font-bold uppercase tracking-widest rounded"
              style={{
                backgroundColor: theme.accent,
                color: config.type === 'hairdresser' ? '#fff' : '#0F0F0F',
              }}
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
