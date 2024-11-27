import type { Pinia, Store } from 'pinia';
import { getActivePinia } from 'pinia';

export * from './account';
export * from './cursor';
export * from './temp-path';
export * from './timer';
export * from './backlog';
export * from './layout';
export * from './data';

interface ExtendedPinia extends Pinia {
  _s: Map<string, Store>;
}
export const $resetPinia = () => {
  const pinia = getActivePinia() as ExtendedPinia;

  if (!pinia) {
    throw new Error('There is no stores');
  }

  pinia._s.forEach((store, name) => {
    store.$reset();
  });

  window.localStorage.clear();
  window.sessionStorage.clear();
};
