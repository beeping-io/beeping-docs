const BASE_TITLES: Record<'en' | 'es', string> = {
  en: 'Beeping Documentation',
  es: 'Documentación de Beeping',
};

const KNOWN_BASES = new Set(Object.values(BASE_TITLES));
const DELIMITER = ' | ';
const SEPARATOR_REGEX = /[|—:-]/;
let lastNormalized: string | null = null;

function detectLocale(pathname: string): 'en' | 'es' {
  return pathname.startsWith('/es') ? 'es' : 'en';
}

function isHome(pathname: string): boolean {
  return pathname === '/' || pathname === '/es/' || pathname === '/es';
}

function normalizeTitle(pathname: string) {
  if (typeof document === 'undefined') return;
  if (isHome(pathname)) return;

  const locale = detectLocale(pathname);
  const baseTitle = BASE_TITLES[locale];
  const current = document.title || '';

  const fragments = current
    .split(SEPARATOR_REGEX)
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !KNOWN_BASES.has(part));

  const pageTitle = fragments.join(DELIMITER).trim();
  const desired = pageTitle ? `${baseTitle}${DELIMITER}${pageTitle}` : baseTitle;

  if (desired === current || desired === lastNormalized) {
    return;
  }

  lastNormalized = desired;
  document.title = desired;
}

function patchHistory(method: 'pushState' | 'replaceState') {
  const original = history[method];
  history[method] = function (...args) {
    const result = original.apply(this, args as Parameters<typeof original>);
    setTimeout(() => normalizeTitle(window.location.pathname), 0);
    return result;
  } as typeof history[method];
}

function observeTitle() {
  if (typeof MutationObserver === 'undefined') return;
  const titleEl = document.querySelector('title');
  if (!titleEl) return;
  const observer = new MutationObserver(() => normalizeTitle(window.location.pathname));
  observer.observe(titleEl, {childList: true});
}

(function init() {
  if (typeof window === 'undefined') return;

  normalizeTitle(window.location.pathname);
  ['pushState', 'replaceState'].forEach((method) => patchHistory(method as 'pushState' | 'replaceState'));
  window.addEventListener('popstate', () => setTimeout(() => normalizeTitle(window.location.pathname), 0));
  document.addEventListener('DOMContentLoaded', () => normalizeTitle(window.location.pathname));
  observeTitle();
})();
