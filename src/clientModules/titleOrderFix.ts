const SITE_TITLES = ['Beeping Documentation', 'Documentación de Beeping'];
const DELIMITER = ' | ';

function swapTitleOrder() {
  if (typeof document === 'undefined') return;
  const current = document.title || '';

  for (const siteTitle of SITE_TITLES) {
    const suffix = `${DELIMITER}${siteTitle}`;
    if (current.endsWith(suffix)) {
      const pagePart = current.slice(0, -suffix.length);
      // If already in desired order, skip.
      if (pagePart === siteTitle || current.startsWith(`${siteTitle}${DELIMITER}`)) {
        return;
      }
      const newTitle = `${siteTitle}${DELIMITER}${pagePart}`.trim();
      document.title = newTitle;
      return;
    }
  }
}

function patchHistory(method: 'pushState' | 'replaceState') {
  const original = history[method];
  history[method] = function (...args) {
    const result = original.apply(this, args as Parameters<typeof original>);
    // Defer to allow route change to update title first.
    setTimeout(swapTitleOrder, 0);
    return result;
  } as typeof history[method];
}

(function init() {
  if (typeof window === 'undefined') return;
  swapTitleOrder();
  ['pushState', 'replaceState'].forEach((method) => patchHistory(method as 'pushState' | 'replaceState'));
  window.addEventListener('popstate', () => setTimeout(swapTitleOrder, 0));
  document.addEventListener('DOMContentLoaded', swapTitleOrder);
})();
