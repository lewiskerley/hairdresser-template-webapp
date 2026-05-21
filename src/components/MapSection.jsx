import { useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import AnimatedSection from './ui/AnimatedSection';

export default function MapSection() {
  const { config, theme } = useSiteConfig();
  const [mapError, setMapError] = useState(false);
  const encodedLocation = encodeURIComponent(`${config.name}, ${config.location}`);
  const mapSrc = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="py-24 px-5 sm:px-8" style={{ backgroundColor: theme.bg }}>
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: theme.accent, fontFamily: theme.fontBody }}
          >
            Find Us
          </p>
          <h2
            className="font-heading font-bold"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: theme.text,
              letterSpacing: config.type === 'hairdresser' ? '0.02em' : '0.06em',
            }}
          >
            We&apos;re in {config.location}
          </h2>
          <div className="mt-4 mx-auto w-12 h-0.5" style={{ backgroundColor: theme.accent }} />
        </AnimatedSection>

        <AnimatedSection
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: theme.border }}
          delay={0.1}
        >
          {mapError ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-4"
              style={{ backgroundColor: theme.bgCard }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${theme.accent}22` }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill={theme.accent}
                  />
                </svg>
              </div>
              <p className="font-heading font-semibold text-lg" style={{ color: theme.text }}>
                {config.name}
              </p>
              <p style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
                {config.location}
              </p>
              <a
                href={`https://maps.google.com/maps?q=${encodedLocation}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest rounded transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: theme.accent,
                  color: config.type === 'hairdresser' ? '#fff' : '#0F0F0F',
                  fontFamily: theme.fontBody,
                }}
              >
                Open in Google Maps
              </a>
            </div>
          ) : (
            <div className="relative" style={{ height: 420 }}>
              <iframe
                title={`Map of ${config.name}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0, filter: config.type === 'barber' ? 'invert(0.9) hue-rotate(180deg)' : 'none' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={() => setMapError(true)}
              />
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}
