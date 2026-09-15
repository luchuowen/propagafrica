// Quotation request form — field contract shared by the client form (QuoteForm.astro) and
// mirrored server-side in functions/src/schema.ts (the two copies must be kept in sync by hand;
// functions/** is a separate deployable package with its own toolchain — see
// .factory/decisions/session-6.md).
//
// Field list, order, types, options and copy are per blueprint.md Section 13. Per-field inline
// validation microcopy (requiredMessage / invalidMessage below) is not specified there and is
// this session's own addition.

export type QuotationFieldName =
  'name' | 'farmOrCompany' | 'email' | 'phone' | 'country' | 'enquiringAbout' | 'message';

export type QuotationFieldType = 'text' | 'email' | 'tel' | 'select' | 'multi-select' | 'textarea';

export interface QuotationFieldDef {
  name: QuotationFieldName;
  label: string;
  type: QuotationFieldType;
  autocomplete: string;
  required: boolean;
  maxLength: number;
  placeholder?: string;
  options?: readonly string[];
  requiredMessage?: string;
  invalidMessage?: string;
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

// Every option can be selected at once — the cap exists to bound the payload, not to stop
// someone enquiring about the whole range.
export const MULTI_SELECT_MAX_ITEMS = ENQUIRY_OPTIONS.length;

export const QUOTATION_FIELDS: readonly QuotationFieldDef[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    autocomplete: 'name',
    required: true,
    maxLength: 120,
    requiredMessage: 'Enter your name.',
  },
  {
    name: 'farmOrCompany',
    label: 'Company/farm name',
    type: 'text',
    autocomplete: 'organization',
    required: true,
    maxLength: 160,
    requiredMessage: 'Enter your company or farm name.',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    required: true,
    maxLength: 254,
    requiredMessage: 'Enter your email address.',
    invalidMessage: 'Enter a valid email address.',
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    autocomplete: 'tel',
    required: false,
    maxLength: 40,
  },
  {
    name: 'country',
    label: 'Country',
    type: 'select',
    autocomplete: 'country-name',
    required: true,
    maxLength: 40,
    options: COUNTRY_OPTIONS,
    requiredMessage: 'Select a country.',
  },
  {
    name: 'enquiringAbout',
    label: 'Enquiring about',
    type: 'multi-select',
    autocomplete: 'off',
    required: true,
    maxLength: 40,
    options: ENQUIRY_OPTIONS,
    requiredMessage: 'Select at least one option.',
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    autocomplete: 'off',
    required: false,
    maxLength: 2000,
    placeholder: 'What you are growing, roughly how much, and where you are based.',
  },
] as const;

// Honeypot: a field real visitors never see or fill. Any non-empty value on submit is treated
// as a bot. Named to not look like a trap to a scraping bot.
export const HONEYPOT_FIELD = 'companyWebsite';
export const TIMESTAMP_FIELD = 'renderedAt';

// Carries a calculator tool's own JSON context (crop group, product codes, quantities) through
// to the sales team alongside the human-readable Message summary the same prefill builds —
// blueprint.md Section 13's "hidden field carries a JSON prefill". Never rendered or required;
// only present when the form was opened from a calculator's "Send to a quotation" link.
export const CALCULATOR_CONTEXT_FIELD = 'calculatorContext';
export const CALCULATOR_CONTEXT_MAX_LENGTH = 4000;
