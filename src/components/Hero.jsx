import { motion } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';

export default function Hero({ onBookNow }) {
  const { config, theme } = useSiteConfig();
  const isHair = config.type === 'hairdresser';

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('${theme.heroImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: theme.heroOverlay }}
      />

      {/* Accent line decoration */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block"
        style={{ width: 2, height: 120, backgroundColor: theme.accent, opacity: 0.6 }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.p
          className="text-xs font-medium tracking-[0.3em] uppercase mb-6"
          style={{ color: theme.accent, fontFamily: theme.fontBody }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {theme.tagline(config.location)}
        </motion.p>

        {/* Headline */}
        <motion.h1
          className="font-heading font-bold leading-none mb-6 text-white"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            letterSpacing: isHair ? '0.02em' : '0.06em',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {config.name}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-white/80"
          style={{ fontFamily: theme.fontBody, fontWeight: isHair ? 300 : 400 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {theme.heroSub(config.location)}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <button
            onClick={onBookNow}
            className="px-10 py-4 text-sm font-bold uppercase tracking-widest rounded transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: theme.accent,
              color: isHair ? '#fff' : '#0F0F0F',
              fontFamily: theme.fontBody,
              boxShadow: `0 4px 24px ${theme.accent}55`,
            }}
          >
            {theme.ctaLabel}
          </button>
          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="px-10 py-4 text-sm font-semibold uppercase tracking-widest rounded border transition-all duration-200 hover:bg-white/10 active:scale-95"
            style={{
              color: '#fff',
              borderColor: 'rgba(255,255,255,0.5)',
              fontFamily: theme.fontBody,
            }}
          >
            View Services
          </a>
        </motion.div>

        {/* Small badge */}
        <motion.p
          className="mt-8 text-xs tracking-widest uppercase text-white/50"
          style={{ fontFamily: theme.fontBody }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          {theme.badge}
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-xs tracking-widest uppercase text-white/40" style={{ fontFamily: theme.fontBody }}>
          Scroll
        </span>
        <motion.div
          className="w-px h-8"
          style={{ backgroundColor: theme.accent, opacity: 0.5 }}
          animate={{ scaleY: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
