import { useSiteConfig } from '../context/SiteConfigContext';
import AnimatedSection from './ui/AnimatedSection';

const PhoneIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={color} />
  </svg>
);

const ClockIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={color} />
  </svg>
);

const LocationIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={color} />
  </svg>
);

const hoursBarber = 'Mon–Fri 9:00–18:30 · Sat 9:00–17:00 · Sun Closed';
const hoursHair   = 'Tue–Fri 9:30–18:00 · Sat 9:00–17:00 · Sun–Mon Closed';

export default function Contact({ onBookNow }) {
  const { config, theme } = useSiteConfig();
  const isHair = config.type === 'hairdresser';
  const hours = isHair ? hoursHair : hoursBarber;

  const cards = [
    {
      icon: <PhoneIcon color={theme.accent} />,
      label: 'Phone',
      value: config.phone,
      sub: 'Call to book or for enquiries',
    },
    {
      icon: <LocationIcon color={theme.accent} />,
      label: 'Location',
      value: config.location,
      sub: 'Ask us for the exact address',
    },
    {
      icon: <ClockIcon color={theme.accent} />,
      label: 'Opening Hours',
      value: null,
      sub: hours,
    },
  ];

  return (
    <section id="contact" className="py-24 px-5 sm:px-8" style={{ backgroundColor: theme.bgSection }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: theme.accent, fontFamily: theme.fontBody }}
          >
            Get In Touch
          </p>
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: theme.text,
              letterSpacing: isHair ? '0.02em' : '0.06em',
            }}
          >
            Contact Us
          </h2>
          <div className="mt-4 mx-auto w-12 h-0.5" style={{ backgroundColor: theme.accent }} />
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, i) => (
            <AnimatedSection
              key={card.label}
              delay={i * 0.1}
              className="p-8 rounded-xl border flex flex-col gap-4"
              style={{ backgroundColor: theme.bgCard, borderColor: theme.border }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${theme.accent}18` }}
              >
                {card.icon}
              </div>
              <div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                  {card.label}
                </p>
                {card.value && (
                  <p className="font-heading font-semibold text-xl" style={{ color: theme.text }}>
                    {card.value}
                  </p>
                )}
                <p className="text-sm mt-1 leading-relaxed" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                  {card.sub}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center" delay={0.3}>
          <p className="mb-6 text-base" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
            Ready to book? Secure your slot online in under a minute.
          </p>
          <button
            onClick={onBookNow}
            className="px-12 py-4 text-sm font-bold uppercase tracking-widest rounded transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: theme.accent,
              color: isHair ? '#fff' : '#0F0F0F',
              fontFamily: theme.fontBody,
              boxShadow: `0 4px 24px ${theme.accent}44`,
            }}
          >
            Book an Appointment
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
}
