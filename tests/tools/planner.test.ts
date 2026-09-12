import { describe, it, expect } from 'vitest';
import {
  TRAY_OPTIONS,
  DEFAULT_GRAFTS_PER_CYCLE,
  DEFAULT_CYCLES_PER_YEAR,
  DEFAULT_TRAY_CELLS,
  planConsumables,
  plannerRows,
  formatCount,
  formatLitres,
  buildQuotationQuery,
  assumptionLines,
  QUOTATION_QUERY_PARAMS,
} from '../../src/lib/tools/planner';

describe('TRAY_OPTIONS', () => {
  it('lists the four tray options with the specified cell counts and ml/cell', () => {
    expect(TRAY_OPTIONS).toEqual([
      { label: '104 cell', cells: 104, mlPerCell: 26 },
      { label: '128 cell', cells: 128, mlPerCell: 20 },
      { label: '200 cell', cells: 200, mlPerCell: 12 },
      { label: '288 cell', cells: 288, mlPerCell: 8 },
    ]);
  });

  it('defaults to 128 cell, 120 000 grafts, 4 cycles', () => {
    expect(DEFAULT_TRAY_CELLS).toBe(128);
    expect(DEFAULT_GRAFTS_PER_CYCLE).toBe(120_000);
    expect(DEFAULT_CYCLES_PER_YEAR).toBe(4);
  });
});

describe('planConsumables', () => {
  it('computes every quantity from the default inputs', () => {
    const result = planConsumables({
      graftsPerCycle: 120_000,
      cyclesPerYear: 4,
      cells: 128,
      mlPerCell: 20,
    });
    expect(result).toEqual({
      total: 480_000,
      sleeves: 494_400,
      trays: 3_750,
      mediaLitres: 11_040,
      thermal: 3_750,
      batchCards: 480,
      logbooks: 20,
      sanitiserL: 39.84,
    });
  });

  it('rounds trays, batch cards and logbooks up when the division is not exact', () => {
    const result = planConsumables({
      graftsPerCycle: 100,
      cyclesPerYear: 3,
      cells: 104,
      mlPerCell: 26,
    });
    expect(result.total).toBe(300);
    expect(result.trays).toBe(3); // 300 / 104 = 2.88…
    expect(result.batchCards).toBe(1); // 300 / 1000 = 0.3…
    expect(result.logbooks).toBe(1); // 300 / 25 000 = 0.012…
    expect(result.sleeves).toBeCloseTo(309, 6);
    expect(result.mediaLitres).toBeCloseTo(8.97, 6);
    expect(result.sanitiserL).toBeCloseTo(0.0249, 6);
  });

  it('does not round up an exact division', () => {
    expect(
      planConsumables({ graftsPerCycle: 1000, cyclesPerYear: 1, cells: 200, mlPerCell: 12 })
        .batchCards,
    ).toBe(1);
    expect(
      planConsumables({ graftsPerCycle: 25_000, cyclesPerYear: 1, cells: 200, mlPerCell: 12 })
        .logbooks,
    ).toBe(1);
  });

  it('rounds up by one unit just past an exact division', () => {
    expect(
      planConsumables({ graftsPerCycle: 1001, cyclesPerYear: 1, cells: 200, mlPerCell: 12 })
        .batchCards,
    ).toBe(2);
    expect(
      planConsumables({ graftsPerCycle: 25_001, cyclesPerYear: 1, cells: 200, mlPerCell: 12 })
        .logbooks,
    ).toBe(2);
  });
});

describe('formatCount / formatLitres — en-GB, tabular figures', () => {
  it('formats large counts with thousands separators', () => {
    expect(formatCount(480_000)).toBe('480,000');
    expect(formatCount(20)).toBe('20');
  });

  it('formats litres to one decimal place', () => {
    expect(formatLitres(11_040)).toBe('11,040.0');
    expect(formatLitres(39.84)).toBe('39.8');
  });
});

describe('plannerRows', () => {
  const inputs = { graftsPerCycle: 120_000, cyclesPerYear: 4, cells: 128, mlPerCell: 20 };
  const result = planConsumables(inputs);
  const rows = plannerRows(inputs, result);

  it('has one row per output quantity, each with a label, value and working', () => {
    expect(rows.map((r) => r.label)).toEqual([
      'Total grafts',
      'Sleeves',
      'Trays',
      'Media',
      'Thermal sleeves',
      'Batch cards',
      'Logbooks',
      'Sanitiser',
    ]);
    for (const row of rows) {
      expect(typeof row.working).toBe('string');
      expect(row.working.length).toBeGreaterThan(0);
    }
  });

  it('names the tray option in the trays row working', () => {
    const traysRow = rows.find((r) => r.label === 'Trays')!;
    expect(traysRow.working).toContain('128 cell');
  });

  it('falls back to a plain cell count when the tray is not one of the four presets', () => {
    const customInputs = { ...inputs, cells: 999 };
    const customRows = plannerRows(customInputs, planConsumables(customInputs));
    const traysRow = customRows.find((r) => r.label === 'Trays')!;
    expect(traysRow.working).toContain('999 cell');
  });
});

describe('assumptionLines', () => {
  it('prints one line per assumption, with every figure/unit named', () => {
    const lines = assumptionLines();
    expect(lines).toHaveLength(7);
    expect(lines[0]).toBe('Sleeves include 3% handling wastage.');
    expect(lines[2]).toBe('Media allows a 15% fill over-run on top of cell volume.');
    expect(lines[4]).toBe('Batch cards are issued one per 1,000 units, rounded up.');
    expect(lines[5]).toBe('Logbooks are issued one per 25,000 units, rounded up.');
    expect(lines[6]).toBe(
      'Sanitiser is costed at 0.083 L per 1 000 units — 10 L of 1 000 ppm from PRO-SAN 12.',
    );
  });
});

describe('buildQuotationQuery', () => {
  const inputs = { graftsPerCycle: 120_000, cyclesPerYear: 4, cells: 128, mlPerCell: 20 };
  const result = planConsumables(inputs);
  const query = buildQuotationQuery(inputs, result);

  it('targets /contact', () => {
    expect(query.startsWith('/contact?')).toBe(true);
  });

  it('encodes every documented query parameter with the computed values', () => {
    const params = new URLSearchParams(query.split('?')[1]);
    expect(params.get(QUOTATION_QUERY_PARAMS.graftsPerCycle)).toBe('120000');
    expect(params.get(QUOTATION_QUERY_PARAMS.cyclesPerYear)).toBe('4');
    expect(params.get(QUOTATION_QUERY_PARAMS.cells)).toBe('128');
    expect(params.get(QUOTATION_QUERY_PARAMS.total)).toBe('480000');
    expect(params.get(QUOTATION_QUERY_PARAMS.sleeves)).toBe('494400');
    expect(params.get(QUOTATION_QUERY_PARAMS.trays)).toBe('3750');
    expect(params.get(QUOTATION_QUERY_PARAMS.mediaLitres)).toBe('11040.0');
    expect(params.get(QUOTATION_QUERY_PARAMS.thermal)).toBe('3750');
    expect(params.get(QUOTATION_QUERY_PARAMS.batchCards)).toBe('480');
    expect(params.get(QUOTATION_QUERY_PARAMS.logbooks)).toBe('20');
    expect(params.get(QUOTATION_QUERY_PARAMS.sanitiserL)).toBe('39.8');
  });
});
