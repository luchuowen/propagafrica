// Quotation request form — field contract shared by the client form (QuoteForm.astro) and
// mirrored server-side in functions/src/schema.ts (the two copies must be kept in sync by hand;
// functions/** is a separate deployable package with its own toolchain — see
// .factory/decisions/session-6.md).
//
// Field list, order, types, options and copy are per docs/content/copy-reference.md, section
// "/contact · SHEET 14 OF 14". Per-field inline validation microcopy (requiredMessage /
// invalidMessage below) is not specified there and is this session's own addition.

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
    label: 'Farm or company',
    type: 'text',
    autocomplete: 'organization',
    required: true,
    maxLength: 160,
    requiredMessage: 'Enter your farm or company name.',
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
    name: 'crop',
    label: 'Crop',
    type: 'select',
    autocomplete: 'off',
    required: true,
    maxLength: 40,
    options: CROP_OPTIONS,
    requiredMessage: 'Select a crop.',
  },
  {
    name: 'stage',
    label: 'Stage',
    type: 'multi-select',
    autocomplete: 'off',
    required: true,
    maxLength: 40,
    options: STAGE_OPTIONS,
    requiredMessage: 'Select at least one stage.',
  },
  {
    name: 'annualVolume',
    label: 'Annual volume, units',
    type: 'text',
    autocomplete: 'off',
    required: false,
    maxLength: 40,
    placeholder: '480 000',
  },
  {
    name: 'deliveryPoint',
    label: 'Delivery point',
    type: 'text',
    autocomplete: 'off',
    required: false,
    maxLength: 120,
    placeholder: 'Naivasha',
  },
  {
    name: 'notes',
    label: 'Specification, pack preference, call-off schedule',
    type: 'textarea',
    autocomplete: 'off',
    required: false,
    maxLength: 2000,
    placeholder:
      'Rootstock and scion diameters, tray type, current substrate, when the next cycle starts.',
  },
] as const;

// Multi-select fields (currently just "stage") are submitted as several same-named form fields
// and stored as a string array.
export const MULTI_SELECT_MAX_ITEMS = 6;

// Honeypot: a field real visitors never see or fill. Any non-empty value on submit is treated
// as a bot. Named to not look like a trap to a scraping bot.
export const HONEYPOT_FIELD = 'companyWebsite';

// Hidden timestamp, filled client-side (see QuoteForm.astro's enhancement script) with the time
// the form finished rendering. A submission faster than MIN_ELAPSED_MS after that is rejected as
// automated. Left empty for a no-JavaScript submission — see functions/src/validate.ts for why
// the server treats an absent timestamp as "cannot check elapsed time" rather than "reject".
export const TIMESTAMP_FIELD = 'renderedAt';

// Query-string prefill contract. Session 4's own contract doc
// (.factory/decisions/session-4.md) does not exist in this repository, so this reads defensively:
// same-named params as the form fields (QUOTATION_FIELDS' own names), trimmed and length-capped,
// anything else ignored. Multi-select ("stage") is read as a repeated ?stage=Graft&stage=Root or
// a single comma-separated ?stage=Graft,Root. Implemented client-side in QuoteForm.astro's
// enhancement script, since this site builds to static HTML with no per-request server to read a
// query string at — see .factory/decisions/session-6.md.
