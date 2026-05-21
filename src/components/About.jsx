import { motion } from 'framer-motion';
import { useSiteConfig } from '../context/SiteConfigContext';
import AnimatedSection from './ui/AnimatedSection';

export default function About() {
  const { config, theme } = useSiteConfig();
  const isHair = config.type === 'hairdresser';

  return (
    <section id="about" className="py-24 px-5 sm:px-8" style={{ backgroundColor: theme.bgSection }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <AnimatedSection className="relative" delay={0}>
            <div className="relative overflow-hidden rounded-lg aspect-[4/5]">
              <img
                src={theme.aboutImage}
                alt="About us"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://picsum.photos/seed/about/900/1100';
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: isHair
                    ? 'linear-gradient(135deg, rgba(200,131,122,0.15) 0%, transparent 60%)'
                    : 'linear-gradient(135deg, rgba(201,150,61,0.12) 0%, transparent 60%)',
                }}
              />
            </div>
            {/* Floating stat card */}
            <motion.div
              className="absolute -bottom-6 -right-4 md:-right-8 p-5 rounded-lg shadow-2xl"
              style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <p
                className="text-3xl font-bold"
                style={{ color: theme.accent, fontFamily: theme.fontHeading }}
              >
                10+
              </p>
              <p className="text-xs tracking-wider uppercase mt-0.5" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                Years experience
              </p>
            </motion.div>

            {/* Accent border */}
            <div
              className="absolute -top-3 -left-3 w-20 h-20 rounded-tl-lg border-t-2 border-l-2"
              style={{ borderColor: theme.accent }}
            />
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection className="flex flex-col gap-6" delay={0.15}>
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: theme.accent, fontFamily: theme.fontBody }}
            >
              Our Story
            </p>
            <h2
              className="font-heading font-bold leading-tight"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                color: theme.text,
                letterSpacing: isHair ? '0.01em' : '0.04em',
              }}
            >
              {theme.aboutTitle}
            </h2>
            <div className="w-10 h-0.5" style={{ backgroundColor: theme.accent }} />
            <p
              className="text-base leading-relaxed"
              style={{ color: theme.textSub, fontFamily: theme.fontBody, fontWeight: 300 }}
            >
              {theme.aboutBody(config.name, config.location)}
            </p>

            <div className="grid grid-cols-2 gap-5 mt-2">
              {[
                { label: 'Happy Clients', value: '2,000+' },
                { label: 'Five-Star Reviews', value: '500+' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: theme.border, backgroundColor: theme.bgCard }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: theme.accent, fontFamily: theme.fontHeading }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs tracking-wider uppercase mt-0.5" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
