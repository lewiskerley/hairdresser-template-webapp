import { createContext, useContext, useEffect } from 'react';
import { buildTheme } from '../config/themes';

const SiteConfigContext = createContext(null);

export function SiteConfigProvider({ config, children }) {
  const theme = buildTheme(config.type, config.color);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--color-accent',      theme.accent);
    r.style.setProperty('--color-accent-muted', theme.accentMuted);
    r.style.setProperty('--color-bg',           theme.bg);
    r.style.setProperty('--color-bg-card',      theme.bgCard);
    r.style.setProperty('--color-bg-section',   theme.bgSection);
    r.style.setProperty('--color-text',         theme.text);
    r.style.setProperty('--color-text-sub',     theme.textSub);
    r.style.setProperty('--color-border',       theme.border);
    r.style.setProperty('--font-heading',       theme.fontHeading);
    r.style.setProperty('--font-body',          theme.fontBody);
    document.body.style.backgroundColor = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  return (
    <SiteConfigContext.Provider value={{ config, theme }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}
