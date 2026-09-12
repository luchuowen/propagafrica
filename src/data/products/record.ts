// Stage 05 · Record — labels, batch cards and record books.
// Every field is copied verbatim from docs/content/copy-supplies.md; do not round or rephrase.

export interface TraceabilityItem {
  [key: string]: string;
  sku: string;
  format: string;
  size: string;
  material: string;
  pack: string;
}

export const TRACEABILITY_AND_QC: TraceabilityItem[] = [
  {
    sku: 'PRO-LABEL LOOP',
    format: 'Loop label',
    size: '200 × 8 mm',
    material: 'LDPE, UV stable',
    pack: '1 000',
  },
  {
    sku: 'PRO-LABEL T',
    format: 'Write-on tag',
    size: '120 × 20 mm',
    material: 'Rigid polypropylene',
    pack: '1 000',
  },
  {
    sku: 'PRO-TRACE',
    format: 'Thermal label roll',
    size: '50 × 25 mm',
    material: 'Top-coated synthetic',
    pack: '1 000 · 5 000',
  },
  {
    sku: 'PRO-TRACE CARD',
    format: 'Batch card',
    size: 'A6',
    material: '200 gsm, moisture resistant',
    pack: '500 · 1 000',
  },
  {
    sku: 'PRO-QC',
    format: 'QC logbook',
    size: 'A5, 100 pages, duplicate',
    material: 'Carbonless, numbered',
    pack: '50 · 100 books',
  },
  {
    sku: 'PRO-MARK',
    format: 'Permanent marker',
    size: '1.0 mm bullet',
    material: 'Pigment ink, UV resistant',
    pack: '12',
  },
];
