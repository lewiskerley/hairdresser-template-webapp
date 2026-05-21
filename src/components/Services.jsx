import { motion } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import { servicesByType } from '../config/services';
import AnimatedSection from './ui/AnimatedSection';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Services({ onBookNow }) {
  const { config, theme } = useSiteConfig();
  const services = servicesByType[config.type] || servicesByType.barber;
  const isHair = config.type === 'hairdresser';

  return (
    <section id="services" className="py-24 px-5 sm:px-8" style={{ backgroundColor: theme.bgSection }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: theme.accent, fontFamily: theme.fontBody }}
          >
            What We Offer
          </p>
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: theme.text,
              letterSpacing: isHair ? '0.02em' : '0.06em',
            }}
          >
            Services &amp; Pricing
          </h2>
          <div className="mt-4 mx-auto w-12 h-0.5" style={{ backgroundColor: theme.accent }} />
        </AnimatedSection>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {services.map((svc) => (
            <motion.div
              key={svc.id}
              variants={cardVariants}
              className="group p-7 rounded-lg flex flex-col gap-3 border transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: theme.bgCard,
                borderColor: theme.border,
              }}
              whileHover={{ boxShadow: `0 8px 32px ${theme.accent}22` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3
                  className="font-heading font-semibold text-lg leading-tight"
                  style={{ color: theme.text, letterSpacing: isHair ? '0.01em' : '0.05em' }}
                >
                  {svc.name}
                </h3>
                <span
                  className="text-lg font-bold whitespace-nowrap mt-0.5"
                  style={{ color: theme.accent, fontFamily: theme.fontBody }}
                >
                  {svc.priceLabel}
                </span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                {svc.description}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs tracking-widest uppercase" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                  {svc.duration}
                </span>
                <button
                  onClick={onBookNow}
                  className="text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                  style={{ color: theme.accent, fontFamily: theme.fontBody }}
                  onMouseEnter={(e) => (e.target.style.color = theme.accentMuted)}
                  onMouseLeave={(e) => (e.target.style.color = theme.accent)}
                >
                  Book →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
