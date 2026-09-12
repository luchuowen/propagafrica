// Runs `callback` once `el` first scrolls into view — the vanilla-TS
// equivalent of a framework island's `client:visible` directive.
export function onVisible(el: Element, callback: () => void): void {
  if (typeof IntersectionObserver === 'undefined') {
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.disconnect();
        callback();
      }
    }
  });
  observer.observe(el);
}
