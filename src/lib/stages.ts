// The five propagation stages, in order, as shown on the home page rail.
// Figures are placeholders pending confirmation from operations — they are
// held here, in one place, so a correction is a single edit.
export interface Stage {
  /** Stage label in the supplies IA, e.g. PREPARE. */
  code: string;
  href: string;
  title: string;
  body: string;
  /** Key figure with its unit. Shown in mono under the stage. */
  spec: string;
  /** Elapsed days from the first cut. Drives the dimension rail. */
  day: number;
  photo?: { src: string; alt: string };
}

export const STAGES: readonly Stage[] = [
  {
    code: 'PREPARE',
    href: '/supplies/prepare',
    title: 'Select and prepare stock',
    body: 'Rootstock graded by stem diameter; trays washed and media moistened before the first cut.',
    spec: 'STEM DIA. 4–6 mm',
    day: 0,
  },
  {
    code: 'GRAFT',
    href: '/supplies/graft',
    title: 'Graft and clip the union',
    body: 'Cut faces matched and held square by a sleeve sized to the stem.',
    spec: 'SLEEVE 12–18 mm',
    day: 1,
  },
  {
    code: 'ROOT',
    href: '/supplies/root',
    title: 'Root under controlled humidity',
    body: 'The healing chamber holds moisture around the union while the callus forms.',
    spec: '90–95 % RH · 21–27 °C',
    day: 21,
  },
  {
    code: 'PROTECT',
    href: '/supplies/protect',
    title: 'Harden off under shade',
    body: 'Shade and hygiene routines carry the plant from the chamber to the open bench.',
    spec: 'SHADE 50 % · 7–10 DAYS',
    day: 31,
  },
  {
    code: 'RECORD',
    href: '/supplies/record',
    title: 'Record the batch',
    body: 'Take rate, sleeve size and media lot written against the tray number.',
    spec: '1 RECORD SHEET PER TRAY',
    day: 38,
  },
];

/** Stage number as it is printed: 01, 02, … */
export function stageNumber(index: number): string {
  return String(index + 1).padStart(2, '0');
}

/** The span the dimension rail measures, e.g. "DAY 0 TO DAY 38". */
export function railSpan(stages: readonly Stage[] = STAGES): string {
  const first = stages[0];
  const last = stages[stages.length - 1];
  if (!first || !last) return '—';
  return `DAY ${first.day} TO DAY ${last.day}`;
}
