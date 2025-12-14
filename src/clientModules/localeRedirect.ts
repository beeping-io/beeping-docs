const PREFERRED_LOCALE_KEY = 'beeping.preferredLocale';

function getStoredLocale(): string | null {
  try {
    return window.localStorage.getItem(PREFERRED_LOCALE_KEY);
  } catch (error) {
    console.warn('Unable to read preferred locale from localStorage:', error);
    return null;
  }
}

function setStoredLocale(locale: string) {
  try {
    window.localStorage.setItem(PREFERRED_LOCALE_KEY, locale);
  } catch (error) {
    console.warn('Unable to persist preferred locale to localStorage:', error);
  }
}

function getBrowserLocale(): string {
  const locale =
    (Array.isArray(navigator.languages) && navigator.languages[0]) ||
    navigator.language ||
    '';
  return locale.toLowerCase();
}

function redirectToEs(pathname: string) {
  const target = pathname.startsWith('/docs')
    ? `/es${pathname}${window.location.search}${window.location.hash}`
    : `/es/${window.location.search}${window.location.hash}`;
  window.location.replace(target);
}

function handleLocaleRedirect() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

  const pathname = window.location.pathname;

  // Respect existing user choice.
  if (getStoredLocale()) return;

  if (pathname.startsWith('/es')) {
    setStoredLocale('es');
    return;
  }

  const browserLocale = getBrowserLocale();

  if (browserLocale.startsWith('es')) {
    setStoredLocale('es');
    redirectToEs(pathname);
    return;
  }

  // Default to English when no Spanish preference is detected.
  setStoredLocale('en');
}

function syncLocalePreference() {
  if (typeof window === 'undefined') return;
  const pathname = window.location.pathname;
  if (pathname.startsWith('/es')) {
    setStoredLocale('es');
  } else {
    setStoredLocale('en');
  }
}

(function init() {
  handleLocaleRedirect();
  // If no redirect happened and user navigated directly, ensure preference aligns with current locale.
  syncLocalePreference();
})();
