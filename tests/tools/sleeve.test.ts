import { describe, it, expect } from 'vitest';
import {
  CROPS,
  STEM_MIN,
  STEM_MAX,
  STEM_STEP,
  selectSleeve,
  scaledRadii,
} from '../../src/lib/tools/sleeve';

describe('CROPS', () => {
  it('lists the four crop buttons in the specified order and wording', () => {
    expect(CROPS.map((c) => c.label)).toEqual([
      'Rose',
      'Tomato, pepper, aubergine',
      'Cucumber, melon, watermelon',
      'Fruit tree',
    ]);
  });
});

describe('stem range constants', () => {
  it('match the specified range input', () => {
    expect(STEM_MIN).toBe(1.4);
    expect(STEM_MAX).toBe(12);
    expect(STEM_STEP).toBe(0.1);
  });
});

describe('selectSleeve — rose bands', () => {
  const cases: [number, string, number][] = [
    [3.0, 'PRO-ROSE 35', 3.5],
    [3.9, 'PRO-ROSE 35', 3.5],
    [4.0, 'PRO-ROSE 45', 4.5],
    [4.9, 'PRO-ROSE 45', 4.5],
    [5.0, 'PRO-ROSE 55', 5.5],
    [5.9, 'PRO-ROSE 55', 5.5],
    [6.0, 'PRO-ROSE 65', 6.5],
    [6.9, 'PRO-ROSE 65', 6.5],
    [7.0, 'PRO-ROSE 75', 7.5],
    [7.9, 'PRO-ROSE 75', 7.5],
    [8.0, 'PRO-ROSE 85', 8.5],
    [12.0, 'PRO-ROSE 85', 8.5],
  ];

  it.each(cases)('stem %s mm → %s (bore %s)', (stem, sku, bore) => {
    const result = selectSleeve('rose', stem);
    expect(result.sku).toBe(sku);
    expect(result.bore).toBe(bore);
  });

  it('carries the full spec for each band', () => {
    expect(selectSleeve('rose', 5.5)).toMatchObject({
      sku: 'PRO-ROSE 55',
      bore: 5.5,
      wall: 0.6,
      length: 22,
      pack: 50_000,
      boreLabel: '5.5',
    });
  });

  it('clamps stems below the first band to PRO-ROSE 35', () => {
    expect(selectSleeve('rose', 1.4).sku).toBe('PRO-ROSE 35');
    expect(selectSleeve('rose', 2.9).sku).toBe('PRO-ROSE 35');
  });
});

describe('selectSleeve — vegetable, cucurbit, tree single-SKU ranges', () => {
  it('vegetable is PRO-VEG with the specified spec', () => {
    const result = selectSleeve('vegetable', 2.0);
    expect(result).toMatchObject({
      sku: 'PRO-VEG',
      boreMin: 1.5,
      boreMax: 2.5,
      wall: 0.4,
      length: 15,
      pack: 100_000,
      boreLabel: '1.5–2.5',
    });
  });

  it('cucurbit is PRO-CUC with the specified spec', () => {
    const result = selectSleeve('cucurbit', 3.0);
    expect(result).toMatchObject({
      sku: 'PRO-CUC',
      boreMin: 2.5,
      boreMax: 4.0,
      wall: 0.45,
      length: 18,
      pack: 100_000,
      boreLabel: '2.5–4.0',
    });
  });

  it('tree is PRO-TREE with the specified spec', () => {
    const result = selectSleeve('tree', 6.0);
    expect(result).toMatchObject({
      sku: 'PRO-TREE',
      boreMin: 4.0,
      boreMax: 12,
      wall: 0.7,
      length: 30,
      pack: 50_000,
      boreLabel: '4.0–12.0',
    });
  });

  it('clamps the representative bore to the SKU range when the stem sits outside it', () => {
    expect(selectSleeve('vegetable', 1.4).bore).toBe(1.5);
    expect(selectSleeve('vegetable', 12).bore).toBe(2.5);
    expect(selectSleeve('cucurbit', 1.4).bore).toBe(2.5);
    expect(selectSleeve('cucurbit', 12).bore).toBe(4.0);
  });

  it('uses the stem itself as the bore when it falls inside the range', () => {
    expect(selectSleeve('vegetable', 2.0).bore).toBe(2.0);
    expect(selectSleeve('cucurbit', 3.0).bore).toBe(3.0);
  });
});

describe('fit note — the three gap branches', () => {
  it('reports the target fit when the gap is within ±0.6 mm, including the boundary itself', () => {
    const atLowerBoundary = selectSleeve('cucurbit', 1.9); // bore 2.5, gap = +0.6
    expect(atLowerBoundary.gap).toBe(0.6);
    expect(atLowerBoundary.fitNote).toBe(
      'Bore within 0.6 mm of the stem — the sleeve grips without pressing. This is the target fit.',
    );

    const atUpperBoundary = selectSleeve('vegetable', 3.1); // bore 2.5, gap = -0.6
    expect(atUpperBoundary.gap).toBe(-0.6);
    expect(atUpperBoundary.fitNote).toBe(
      'Bore within 0.6 mm of the stem — the sleeve grips without pressing. This is the target fit.',
    );

    const exact = selectSleeve('vegetable', 2.0); // bore 2.0, gap = 0
    expect(exact.fitNote).toBe(
      'Bore within 0.0 mm of the stem — the sleeve grips without pressing. This is the target fit.',
    );
  });

  it('reports the "drop one size" note when the bore sits more than 0.6 mm over the stem', () => {
    const result = selectSleeve('cucurbit', 1.8); // bore 2.5 (clamped), gap = +0.7
    expect(result.gap).toBe(0.7);
    expect(result.fitNote).toBe(
      'Bore sits 0.7 mm over the stem. The join will move under mist. Drop one size.',
    );
  });

  it('reports the "measure a wider sample" note when the stem is more than 0.6 mm over the bore', () => {
    const result = selectSleeve('vegetable', 3.2); // bore 2.5 (clamped), gap = -0.7
    expect(result.gap).toBe(-0.7);
    expect(result.fitNote).toBe(
      'This stem is over the sleeve bore by 0.7 mm. The sleeve will grip hard and risks pressing on the layer that has to grow. Measure a wider sample before ordering.',
    );
  });

  it('reaches the "over sleeve bore" branch for a rose stem at the top of the open-ended 8.0+ band', () => {
    const result = selectSleeve('rose', 12);
    expect(result.sku).toBe('PRO-ROSE 85');
    expect(result.gap).toBe(-3.5);
    expect(result.fitNote).toMatch(/^This stem is over the sleeve bore by 3.5 mm\./);
  });
});

describe('fit note — fruit tree override', () => {
  it('always shows the scion/rootstock note regardless of the computed gap', () => {
    expect(selectSleeve('tree', 4.0).fitNote).toBe(
      'PRO-TREE is supplied to the scion and rootstock geometry rather than to a single measurement. Send us both diameters and the graft type.',
    );
    expect(selectSleeve('tree', 1.4).fitNote).toBe(
      'PRO-TREE is supplied to the scion and rootstock geometry rather than to a single measurement. Send us both diameters and the graft type.',
    );
    expect(selectSleeve('tree', 12).fitNote).toBe(
      'PRO-TREE is supplied to the scion and rootstock geometry rather than to a single measurement. Send us both diameters and the graft type.',
    );
  });
});

describe('scaledRadii', () => {
  it('scales stem and bore diameters to the same px scale', () => {
    expect(scaledRadii(5, 7, 12, 60)).toEqual({ stemRadiusPx: 25, boreRadiusPx: 35 });
  });

  it('scales to zero for a zero diameter', () => {
    expect(scaledRadii(0, 8.5, 12, 60)).toEqual({ stemRadiusPx: 0, boreRadiusPx: 42.5 });
  });
});
