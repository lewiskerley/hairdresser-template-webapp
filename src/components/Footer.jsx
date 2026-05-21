import { useSiteConfig } from '../context/SiteConfigContext';

export default function Footer() {
  const { config, theme } = useSiteConfig();
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-10 px-5 sm:px-8 border-t"
      style={{ backgroundColor: theme.bg, borderColor: theme.border }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="font-heading font-bold tracking-widest uppercase"
          style={{ color: theme.accent, letterSpacing: '0.12em' }}
        >
          {config.name}
        </p>
        <p className="text-xs text-center" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
          &copy; {year} {config.name}. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: theme.textSub, fontFamily: theme.fontBody }}>
          {config.location}
        </p>
      </div>
    </footer>
  );
}
