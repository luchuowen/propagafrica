// Calculator -> quotation handoff. blueprint.md Section 13 specifies the
// /contact/ page carries "a hidden field with a JSON prefill when arriving
// from a calculator (crop group, product codes, quantities)" — that read is
// built in a later prompt against the rebuilt contact form. This module only
// produces the link a calculator's "Request a Quotation" button follows: the
// payload travels as a single JSON-encoded query-string parameter, so the
// eventual reader on /contact/ has one documented shape to parse per source.
export const PREFILL_PARAM = 'prefill';

export interface GraftingHandoff {
  source: 'grafting-calculator';
  cropGroup: string;
  productCode: string;
  clipType: string;
  tubesNeeded: number;
  clipsNeeded: number;
}

export interface ConsumablesHandoff {
  source: 'consumables-planner';
  items: {
    trays: number;
    pots: number;
    labels: number;
    domes: number;
    ties: number;
  };
}

export function buildQuotationHref(payload: GraftingHandoff | ConsumablesHandoff): string {
  return `/contact/?${PREFILL_PARAM}=${encodeURIComponent(JSON.stringify(payload))}`;
}
