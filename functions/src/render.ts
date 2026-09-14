// Minimal, self-contained HTML responses for the no-JavaScript form submission path (a real
// browser navigation to this function's URL). Deliberately not a full site page — this file is
// outside src/**, so the project's no-hardcoded-tokens gate does not apply to the literal colour
// values below, which are copied from src/styles/tokens.css for a consistent look without this
// package depending on the Astro build.
const PAPER = '#ffffff';
const INK = '#0e1211';
const INK_SOFT = '#68716e';
const GREEN = '#0a5c3c';
const RULE = '#dce2df';

function page(title: string, heading: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title} · PropagAfrica Technologies</title>
<style>
  body { margin: 0; background: ${PAPER}; color: ${INK}; font-family: -apple-system, system-ui, sans-serif; line-height: 1.6; }
  main { max-width: 640px; margin: 0 auto; padding: 48px 20px; }
  h1 { font-size: 28px; }
  a { color: ${GREEN}; }
  p.soft { color: ${INK_SOFT}; }
  .box { border: 1px solid ${RULE}; padding: 24px; margin-top: 24px; }
</style>
</head>
<body>
<main>
  <h1>${heading}</h1>
  <div class="box">${body}</div>
</main>
</body>
</html>`;
}

// Success copy per blueprint.md Section 13, verbatim.
export function renderSuccessPage(): string {
  return page(
    'Enquiry received',
    'Thank you.',
    '<p>Your enquiry has reached our team. Emily or a member of the technical team will come ' +
      'back to you shortly.</p>' +
      '<p class="soft"><a href="/contact">Back to contact</a></p>',
  );
}

export function renderErrorPage(message: string): string {
  return page(
    'That did not send',
    'That did not send.',
    `<p>${message}</p><p class="soft"><a href="/contact">Back to contact</a></p>`,
  );
}
