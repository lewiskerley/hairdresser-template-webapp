import { useMemo } from 'react';
import { decodeParams, mergeWithDefaults, DEFAULTS } from '../utils/params';

export function useQueryParams() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get('d');

    if (compressed) {
      const decoded = decodeParams(compressed);
      return { config: mergeWithDefaults(decoded), isAdmin: false };
    }

    // Plain params — used in dev/testing
    const plain = {
      name:     params.get('name'),
      type:     params.get('type'),
      location: params.get('location'),
      phone:    params.get('phone'),
      color:    params.get('color'),
    };
    const isAdmin = params.get('admin') === '1';

    return { config: mergeWithDefaults(plain), isAdmin };
  }, []);
}

export { DEFAULTS };
