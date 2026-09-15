import { describe, it, expect } from 'vitest';
import { STAGES, railSpan, stageNumber } from '../../src/lib/stages';

describe('propagation stages', () => {
  it('runs the five supplies stages in order', () => {
    expect(STAGES.map((stage) => stage.code)).toEqual([
      'PREPARE',
      'GRAFT',
      'ROOT',
      'PROTECT',
      'RECORD',
    ]);
  });

  it('links each stage to its supplies page', () => {
    expect(STAGES.map((stage) => stage.href)).toEqual([
      '/supplies/prepare',
      '/supplies/graft',
      '/supplies/root',
      '/supplies/protect',
      '/supplies/record',
    ]);
  });

  it('keeps elapsed days ascending so the rail reads left to right', () => {
    const days = STAGES.map((stage) => stage.day);
    expect(days).toEqual([...days].sort((a, b) => a - b));
  });

  it('gives every stage a figure with its unit', () => {
    for (const stage of STAGES) {
      expect(stage.spec).toMatch(/\d/);
    }
  });

  it('prints stage numbers and the rail span', () => {
    expect(stageNumber(0)).toBe('01');
    expect(stageNumber(4)).toBe('05');
    expect(railSpan()).toBe('DAY 0 TO DAY 38');
    expect(railSpan([])).toBe('—');
  });
});
