// The Field Notes hub, each article page's related-links, and the frontmatter
// shape all read from here, once, so the five articles can't drift between them.
import { ARTICLE_ORDER } from './order';

export interface FieldNoteFrontmatter {
  slug: string;
  title: string;
  dek: string;
  cover: string;
}

const modules = import.meta.glob<{ frontmatter: FieldNoteFrontmatter }>('./*.md', {
  eager: true,
});

const bySlug = new Map(Object.values(modules).map((m) => [m.frontmatter.slug, m.frontmatter]));

/** Every Field Note, in the order ARTICLE_ORDER fixes. */
export const FIELD_NOTES: FieldNoteFrontmatter[] = ARTICLE_ORDER.map((slug) => {
  const frontmatter = bySlug.get(slug);
  if (!frontmatter) throw new Error(`Field note not found for slug: ${slug}`);
  return frontmatter;
});
