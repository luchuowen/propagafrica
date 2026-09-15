// Mirrors src/lib/quotation/schema.ts. Kept as a separate copy on purpose: functions/ is a
// standalone deployable package (its own node_modules, its own tsconfig) and does not reach
// outside its own rootDir at build time. See .factory/decisions/session-6.md.
//
// Field list per blueprint.md Section 13.
export type QuotationFieldName =
  'name' | 'farmOrCompany' | 'email' | 'phone' | 'country' | 'enquiringAbout' | 'message';

export type QuotationFieldType = 'text' | 'email' | 'tel' | 'select' | 'multi-select' | 'textarea';

export interface QuotationFieldDef {
  name: QuotationFieldName;
  type: QuotationFieldType;
  required: boolean;
  maxLength: number;
  options?: readonly string[];
}

export const COUNTRY_OPTIONS = ['Kenya', 'Ethiopia', 'Other'] as const;

// The seven product families — blueprint.md Section 13, same order as the /products/ hub.
export const ENQUIRY_OPTIONS = [
  'Grafting Tubes',
  'Grafting Clips',
  'Nursery Consumables',
  'Propagation Systems',
  'Sanitation Products',
  'Propagation Monitoring',
  'Technical Services',
] as const;

export const MULTI_SELECT_MAX_ITEMS = ENQUIRY_OPTIONS.length;

export const QUOTATION_FIELDS: readonly QuotationFieldDef[] = [
  { name: 'name', type: 'text', required: true, maxLength: 120 },
  { name: 'farmOrCompany', type: 'text', required: true, maxLength: 160 },
  { name: 'email', type: 'email', required: true, maxLength: 254 },
  { name: 'phone', type: 'tel', required: false, maxLength: 40 },
  { name: 'country', type: 'select', required: true, maxLength: 40, options: COUNTRY_OPTIONS },
  {
    name: 'enquiringAbout',
    type: 'multi-select',
    required: true,
    maxLength: 40,
    options: ENQUIRY_OPTIONS,
  },
  { name: 'message', type: 'textarea', required: false, maxLength: 2000 },
];

export const HONEYPOT_FIELD = 'companyWebsite';
export const TIMESTAMP_FIELD = 'renderedAt';

// See the matching comment in src/lib/quotation/schema.ts — carries a calculator tool's raw JSON
// context through to the notification email, alongside the human-readable Message it also fills.
export const CALCULATOR_CONTEXT_FIELD = 'calculatorContext';
export const CALCULATOR_CONTEXT_MAX_LENGTH = 4000;

// Anti-automation policy (fixed, not deployment configuration — no env var for these).
export const MIN_ELAPSED_MS = 2000;
export const RATE_LIMIT_MAX_PER_WINDOW = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
