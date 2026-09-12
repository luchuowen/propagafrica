// Mirrors src/lib/quotation/schema.ts. Kept as a separate copy on purpose: functions/ is a
// standalone deployable package (its own node_modules, its own tsconfig) and does not reach
// outside its own rootDir at build time. See .factory/decisions/session-6.md.
//
// Field list per docs/content/copy-reference.md, "/contact · SHEET 14 OF 14".
export type QuotationFieldName =
  | 'name'
  | 'farmOrCompany'
  | 'email'
  | 'phone'
  | 'country'
  | 'crop'
  | 'stage'
  | 'annualVolume'
  | 'deliveryPoint'
  | 'notes';

export type QuotationFieldType = 'text' | 'email' | 'tel' | 'select' | 'multi-select' | 'textarea';

export interface QuotationFieldDef {
  name: QuotationFieldName;
  type: QuotationFieldType;
  required: boolean;
  maxLength: number;
  options?: readonly string[];
}

export const COUNTRY_OPTIONS = ['Kenya', 'Ethiopia', 'Other'] as const;

export const CROP_OPTIONS = [
  'Rose',
  'Other cut flower',
  'Tomato, pepper, aubergine',
  'Cucurbits',
  'Fruit tree',
  'Mixed nursery',
] as const;

export const STAGE_OPTIONS = [
  'Prepare',
  'Graft',
  'Root',
  'Protect',
  'Record',
  'Whole programme',
] as const;

export const MULTI_SELECT_MAX_ITEMS = 6;

export const QUOTATION_FIELDS: readonly QuotationFieldDef[] = [
  { name: 'name', type: 'text', required: true, maxLength: 120 },
  { name: 'farmOrCompany', type: 'text', required: true, maxLength: 160 },
  { name: 'email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', type: 'tel', required: false, maxLength: 40 },
  { name: 'country', type: 'select', required: true, maxLength: 40, options: COUNTRY_OPTIONS },
  { name: 'crop', type: 'select', required: true, maxLength: 40, options: CROP_OPTIONS },
  {
    name: 'stage',
    type: 'multi-select',
    required: true,
    maxLength: 40,
    options: STAGE_OPTIONS,
  },
  { name: 'annualVolume', type: 'text', required: false, maxLength: 40 },
  { name: 'deliveryPoint', type: 'text', required: false, maxLength: 120 },
  { name: 'notes', type: 'textarea', required: false, maxLength: 2000 },
];

export const HONEYPOT_FIELD = 'companyWebsite';
export const TIMESTAMP_FIELD = 'renderedAt';

// Anti-automation policy (fixed, not deployment configuration — no env var for these).
export const MIN_ELAPSED_MS = 2000;
export const RATE_LIMIT_MAX_PER_WINDOW = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
