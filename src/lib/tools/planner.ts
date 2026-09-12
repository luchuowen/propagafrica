// Pure consumables-planning logic for ConsumablesPlanner.astro. No DOM, no I/O.

export interface TrayOption {
  label: string;
  cells: number;
  mlPerCell: number;
}

export const TRAY_OPTIONS: readonly TrayOption[] = [
  { label: '104 cell', cells: 104, mlPerCell: 26 },
  { label: '128 cell', cells: 128, mlPerCell: 20 },
  { label: '200 cell', cells: 200, mlPerCell: 12 },
  { label: '288 cell', cells: 288, mlPerCell: 8 },
];

export const DEFAULT_GRAFTS_PER_CYCLE = 120_000;
export const DEFAULT_CYCLES_PER_YEAR = 4;
export const DEFAULT_TRAY_CELLS = 128;
export const DEFAULT_TRAY: TrayOption =
  TRAY_OPTIONS.find((t) => t.cells === DEFAULT_TRAY_CELLS) ?? TRAY_OPTIONS[0]!;

// Assumptions behind each derived quantity, printed permanently beneath the tool.
export const HANDLING_WASTAGE = 0.03;
export const FILL_OVERRUN = 0.15;
export const THERMAL_SLEEVES_PER_TRAY = 1;
export const UNITS_PER_BATCH_CARD = 1000;
export const UNITS_PER_LOGBOOK = 25_000;
export const SANITISER_L_PER_1000_UNITS = 0.083;

export interface PlannerInputs {
  graftsPerCycle: number;
  cyclesPerYear: number;
  cells: number;
  mlPerCell: number;
}

export interface PlannerRow {
  label: string;
  value: number;
  working: string;
}

// Row order as returned by plannerRows() below — shared so the UI wiring and
// the SSR template never have to redeclare (and risk drifting from) it.
export const ROW_SLUGS = [
  'total',
  'sleeves',
  'trays',
  'media',
  'thermal',
  'cards',
  'logbooks',
  'sanitiser',
] as const;
export type RowSlug = (typeof ROW_SLUGS)[number];
export const LITRES_ROW_SLUGS: ReadonlySet<RowSlug> = new Set(['media', 'sanitiser']);

export interface PlannerResult {
  total: number;
  sleeves: number;
  trays: number;
  mediaLitres: number;
  thermal: number;
  batchCards: number;
  logbooks: number;
  sanitiserL: number;
}

export function planConsumables(inputs: PlannerInputs): PlannerResult {
  const total = inputs.graftsPerCycle * inputs.cyclesPerYear;
  const sleeves = total * (1 + HANDLING_WASTAGE);
  const trays = Math.ceil(total / inputs.cells);
  const mediaLitres = ((total * inputs.mlPerCell) / 1000) * (1 + FILL_OVERRUN);
  const thermal = trays * THERMAL_SLEEVES_PER_TRAY;
  const batchCards = Math.ceil(total / UNITS_PER_BATCH_CARD);
  const logbooks = Math.ceil(total / UNITS_PER_LOGBOOK);
  const sanitiserL = (total / 1000) * SANITISER_L_PER_1000_UNITS;

  return { total, sleeves, trays, mediaLitres, thermal, batchCards, logbooks, sanitiserL };
}

const NUMBER_FORMAT = new Intl.NumberFormat('en-GB');
const DECIMAL_FORMAT = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCount(n: number): string {
  return NUMBER_FORMAT.format(Math.round(n));
}

export function formatLitres(n: number): string {
  return DECIMAL_FORMAT.format(n);
}

export function plannerRows(inputs: PlannerInputs, result: PlannerResult): PlannerRow[] {
  const trayLabel =
    TRAY_OPTIONS.find((t) => t.cells === inputs.cells)?.label ?? `${inputs.cells} cell`;

  return [
    {
      label: 'Total grafts',
      value: result.total,
      working: `${formatCount(inputs.graftsPerCycle)} grafts/cycle × ${formatCount(inputs.cyclesPerYear)} cycles/year`,
    },
    {
      label: 'Sleeves',
      value: result.sleeves,
      working: `${formatCount(result.total)} × ${(1 + HANDLING_WASTAGE).toFixed(2)} (${HANDLING_WASTAGE * 100}% handling wastage)`,
    },
    {
      label: 'Trays',
      value: result.trays,
      working: `${formatCount(result.total)} ÷ ${inputs.cells} cells (${trayLabel}), rounded up`,
    },
    {
      label: 'Media',
      value: result.mediaLitres,
      working: `(${formatCount(result.total)} × ${inputs.mlPerCell} ml ÷ 1000) × ${(1 + FILL_OVERRUN).toFixed(2)} (${FILL_OVERRUN * 100}% fill over-run)`,
    },
    {
      label: 'Thermal sleeves',
      value: result.thermal,
      working: `${THERMAL_SLEEVES_PER_TRAY} per tray × ${formatCount(result.trays)} trays`,
    },
    {
      label: 'Batch cards',
      value: result.batchCards,
      working: `${formatCount(result.total)} ÷ ${formatCount(UNITS_PER_BATCH_CARD)}, rounded up`,
    },
    {
      label: 'Logbooks',
      value: result.logbooks,
      working: `${formatCount(result.total)} ÷ ${formatCount(UNITS_PER_LOGBOOK)}, rounded up`,
    },
    {
      label: 'Sanitiser',
      value: result.sanitiserL,
      working: `(${formatCount(result.total)} ÷ 1000) × ${SANITISER_L_PER_1000_UNITS} L (10 L of 1 000 ppm per 1 000 units, from PRO-SAN 12)`,
    },
  ];
}

// The assumptions behind every derived quantity, printed permanently
// beneath the tool (never hidden behind a disclosure).
export function assumptionLines(): string[] {
  return [
    `Sleeves include ${(HANDLING_WASTAGE * 100).toFixed(0)}% handling wastage.`,
    `Trays are the total grafts divided by the tray's cell count, rounded up.`,
    `Media allows a ${(FILL_OVERRUN * 100).toFixed(0)}% fill over-run on top of cell volume.`,
    `Thermal sleeves are supplied at ${THERMAL_SLEEVES_PER_TRAY} per tray.`,
    `Batch cards are issued one per ${formatCount(UNITS_PER_BATCH_CARD)} units, rounded up.`,
    `Logbooks are issued one per ${formatCount(UNITS_PER_LOGBOOK)} units, rounded up.`,
    `Sanitiser is costed at ${SANITISER_L_PER_1000_UNITS} L per 1 000 units — 10 L of 1 000 ppm from PRO-SAN 12.`,
  ];
}

/**
 * Query-string contract for "Send this to a quotation" → /contact.
 * Param names are load-bearing for session 6 (prefill) and session 8 (mount) —
 * see .factory/decisions/session-4.md before changing any of them.
 */
export const QUOTATION_QUERY_PARAMS = {
  graftsPerCycle: 'pt_grafts',
  cyclesPerYear: 'pt_cycles',
  cells: 'pt_tray',
  total: 'pt_total',
  sleeves: 'pt_sleeves',
  trays: 'pt_trays',
  mediaLitres: 'pt_media',
  thermal: 'pt_thermal',
  batchCards: 'pt_cards',
  logbooks: 'pt_logbooks',
  sanitiserL: 'pt_sanitiser',
} as const;

export function buildQuotationQuery(inputs: PlannerInputs, result: PlannerResult): string {
  const params = new URLSearchParams({
    [QUOTATION_QUERY_PARAMS.graftsPerCycle]: String(Math.round(inputs.graftsPerCycle)),
    [QUOTATION_QUERY_PARAMS.cyclesPerYear]: String(Math.round(inputs.cyclesPerYear)),
    [QUOTATION_QUERY_PARAMS.cells]: String(inputs.cells),
    [QUOTATION_QUERY_PARAMS.total]: String(Math.round(result.total)),
    [QUOTATION_QUERY_PARAMS.sleeves]: String(Math.round(result.sleeves)),
    [QUOTATION_QUERY_PARAMS.trays]: String(result.trays),
    [QUOTATION_QUERY_PARAMS.mediaLitres]: result.mediaLitres.toFixed(1),
    [QUOTATION_QUERY_PARAMS.thermal]: String(result.thermal),
    [QUOTATION_QUERY_PARAMS.batchCards]: String(result.batchCards),
    [QUOTATION_QUERY_PARAMS.logbooks]: String(result.logbooks),
    [QUOTATION_QUERY_PARAMS.sanitiserL]: result.sanitiserL.toFixed(1),
  });
  return `/contact?${params.toString()}`;
}
