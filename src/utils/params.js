const SHORT_KEYS = { n: 'name', t: 'type', l: 'location', p: 'phone', c: 'color', a: 'address' };
const LONG_KEYS = { name: 'n', type: 't', location: 'l', phone: 'p', color: 'c', address: 'a' };

export const DEFAULTS = {
  name: 'The Fade Factory',
  type: 'barber',
  location: 'London',
  phone: '020 7946 0958',
  color: 'gold',
  address: '',   // optional — full street address for the maps embed
};

function expandKeys(obj) {
  const result = {};
  Object.entries(obj).forEach(([k, v]) => {
    const longKey = SHORT_KEYS[k] || k;
    if (v != null && v !== '') result[longKey] = v;
  });
  return result;
}

export function encodeParams(config) {
  const short = {};
  Object.entries(config).forEach(([k, v]) => {
    if (v != null && v !== '') short[LONG_KEYS[k] || k] = v;
  });
  return btoa(JSON.stringify(short));
}

export function decodeParams(encoded) {
  try {
    const parsed = JSON.parse(atob(encoded));
    return expandKeys(parsed);
  } catch {
    return {};
  }
}

export function mergeWithDefaults(partial) {
  return { ...DEFAULTS, ...Object.fromEntries(Object.entries(partial).filter(([, v]) => v)) };
}

export function generateLink(config, baseUrl = window.location.origin) {
  return `${baseUrl}/?d=${encodeParams(config)}`;
}
