import { describe, it, expect } from 'vitest';
import { SPEC_TABLES, specTable, specTablesForStage } from '../../src/data/products/tables';
import { GRAFTING_SLEEVES, GRAFTING_CLIPS } from '../../src/data/products/graft';
import { VERMICULITE_GRADES } from '../../src/data/products/prepare';

// The single-source-of-truth guarantee. /specifications and the stage pages
// under /supplies both render from SPEC_TABLES, so a table cannot say one
// thing in one place and something else in the other. These tests fail if a
// second copy of a table is ever introduced.

describe('SPEC_TABLES', () => {
  it('has a unique id per table', () => {
    const ids = SPEC_TABLES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('holds the same array instance the stage data exports', () => {
    // Identity, not deep equality: a copy would pass a deep comparison and
    // still be able to drift.
    expect(specTable('sleeves').rows).toBe(GRAFTING_SLEEVES);
    expect(specTable('clips').rows).toBe(GRAFTING_CLIPS);
    expect(specTable('vermiculite').rows).toBe(VERMICULITE_GRADES);
  });

  it('declares every column key that its rows actually carry', () => {
    for (const table of SPEC_TABLES) {
      const declared = new Set(table.columns.map((c) => c.key));
      for (const row of table.rows) {
        for (const key of Object.keys(row)) {
          expect(declared, `${table.id} is missing a column for "${key}"`).toContain(key);
        }
      }
    }
  });

  it('has no empty cell in any published table', () => {
    for (const table of SPEC_TABLES) {
      for (const row of table.rows) {
        for (const column of table.columns) {
          expect(
            String(row[column.key] ?? '').trim().length,
            `${table.id}.${column.key}`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });

  it('assigns every table to one of the five stages', () => {
    const stages = ['prepare', 'graft', 'root', 'protect', 'record'] as const;
    const covered = stages.flatMap((stage) => specTablesForStage(stage));
    expect(covered).toHaveLength(SPEC_TABLES.length);
  });

  it('throws on an unknown table id rather than rendering an empty table', () => {
    expect(() => specTable('does-not-exist')).toThrow(/Unknown specification table/);
  });
});
