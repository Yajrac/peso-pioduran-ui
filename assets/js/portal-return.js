(() => {
  const script = document.currentScript;
  const destination = new URL('../../index.html', script.src);
  if (window.location.pathname === destination.pathname) return;
  const link = document.createElement('a');
  link.className = 'portal-return';
  link.href = destination.href;
  link.setAttribute('aria-label', 'Back to portal selection');
  link.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5-7 7 7 7M2 12h12a7 7 0 0 1 7 7"/></svg><span>Back to Portals</span>';
  document.body.append(link);
})();
