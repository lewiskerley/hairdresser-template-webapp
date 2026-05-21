const accentMap = {
  gold:  { accent: '#C9963D', accentMuted: '#A37828' },
  white: { accent: '#E8E8E8', accentMuted: '#B0B0B0' },
  rose:  { accent: '#C8837A', accentMuted: '#A6605A' },
  blue:  { accent: '#4A7BD4', accentMuted: '#3460B0' },
  green: { accent: '#5B9E72', accentMuted: '#3E7A55' },
};

const barberBase = {
  bg:        '#0F0F0F',
  bgCard:    '#1A1A1A',
  bgSection: '#141414',
  text:      '#F5F5F5',
  textSub:   '#9CA3AF',
  border:    '#2A2A2A',
  fontHeading: "'Rajdhani', 'Oswald', sans-serif",
  fontBody:    "'Inter', sans-serif",
  heroImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80',
  heroOverlay: 'rgba(0,0,0,0.65)',
  aboutImage: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900&q=80',
  tagline: (loc) => `Premium Barbershop · ${loc}`,
  heroSub: (loc) => `Precision cuts, clean fades, and expert grooming in the heart of ${loc}.`,
  aboutTitle: 'Craftsmanship. Confidence. Character.',
  aboutBody: (name, loc) =>
    `Welcome to ${name} — ${loc}'s home of precision barbering. With a decade of experience across scissor-work, skin fades, and traditional shaves, our barbers bring old-school craft to a modern chair. Every client walks out looking sharp and feeling their best. That's our promise.`,
  ctaLabel: 'Book Your Cut',
  badge: 'Walk-ins welcome · Mon–Sat',
};

const hairdresserBase = {
  bg:        '#FAF7F4',
  bgCard:    '#FFFFFF',
  bgSection: '#F3EDE7',
  text:      '#2C2416',
  textSub:   '#7D6B5A',
  border:    '#E8DDD6',
  fontHeading: "'Playfair Display', Georgia, serif",
  fontBody:    "'Lato', 'Inter', sans-serif",
  heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
  heroOverlay: 'rgba(20,14,10,0.52)',
  aboutImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&q=80',
  tagline: (loc) => `Award-Winning Hair Salon · ${loc}`,
  heroSub: (loc) => `Colour, cut, and transformation. Beautifully crafted in ${loc}.`,
  aboutTitle: 'Where Expertise Meets Elegance.',
  aboutBody: (name, loc) =>
    `Welcome to ${name} — ${loc}'s premier destination for luxury hair care. Our passionate team of stylists specialise in colour artistry, precision cutting, and transformative treatments. We take the time to understand your vision and deliver results that inspire confidence every single day.`,
  ctaLabel: 'Book a Consultation',
  badge: 'By appointment · Tue–Sat',
};

export function buildTheme(type, color) {
  const base = type === 'hairdresser' ? hairdresserBase : barberBase;
  const colors = accentMap[color] || accentMap.gold;
  return { ...base, ...colors };
}
