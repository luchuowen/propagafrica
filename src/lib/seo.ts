// JSON-LD builders. Every property here is a fact from the copy decks.
//
// Four properties are deliberately absent: when the company was founded, how
// many people it employs, any rating, and any publication date. None is stated
// anywhere in the client material, and an invented one is worse than a missing
// one. The no-founding-date gate fails the build if one is ever added.

const SITE_NAME = 'PropagAfrica Technologies';
const TELEPHONE = '+254722861682';
const EMAIL = 'info@propagafrica.com';

export function organizationJsonLd(site: URL | string): string {
  const url = String(site);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url,
    logo: new URL('/icon-512.png', url).href,
    telephone: TELEPHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    areaServed: [
      { '@type': 'Country', name: 'Kenya' },
      { '@type': 'Country', name: 'Ethiopia' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: TELEPHONE,
      email: EMAIL,
      areaServed: ['KE', 'ET'],
      availableLanguage: 'en',
    },
  });
}

export function articleJsonLd(options: {
  site: URL | string;
  path: string;
  headline: string;
  description: string;
}): string {
  const url = new URL(options.path, String(options.site)).href;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: String(options.site),
    },
  });
}
