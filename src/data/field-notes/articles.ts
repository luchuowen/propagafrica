// Session 8 integration note. The home page teaser, the Field Notes index and
// the per-article prev/next links all need the same list in the same order.
// Each was reading it separately — the teaser with hard-coded rows, because
// this directory had not landed when the home page was built. The glob and the
// ordering now live here, once.
import { ARTICLE_ORDER } from './order';

export interface FieldNoteFrontmatter {
  slug: string;
  title: string;
  standfirst: string;
  category: string;
  readingMinutes: number;
  figure?: string;
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

/** The first n articles in that order. Articles carry no publication date, so
 *  file order is the only ordering signal the copy deck provides. */
export function firstFieldNotes(count: number): FieldNoteFrontmatter[] {
  return FIELD_NOTES.slice(0, count);
}
