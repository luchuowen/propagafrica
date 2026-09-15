import { describe, it, expect } from 'vitest';
import { productCodeFor, computeGraftingPlan } from '../../src/lib/tools/grafting-calculator';
import { computeConsumablesPlan } from '../../src/lib/tools/consumables-planner';

describe('grafting calculator', () => {
  it('maps each crop group to its product code', () => {
    expect(productCodeFor('Roses and ornamentals', '5.5')).toBe('PRO-ROSE 55');
    expect(productCodeFor('Tomato, pepper and eggplant', '5.5')).toBe('PRO-VEG');
    expect(productCodeFor('Cucumber, melon and watermelon', '5.5')).toBe('PRO-CUC');
    expect(productCodeFor('Fruit trees', '5.5')).toBe('PRO-TREE');
  });

  it('rounds tubes and clips up together, applying the wastage buffer', () => {
    const plan = computeGraftingPlan('Fruit trees', '5.5', 1000, 'V-Clip', 10);
    expect(plan.tubesNeeded).toBe(1100);
    expect(plan.clipsNeeded).toBe(1100);
    expect(plan.productCode).toBe('PRO-TREE');
    expect(plan.clipType).toBe('V-Clip');
  });

  it('ceils a fractional result rather than rounding it', () => {
    // 101 * 1.10 = 111.1
    const plan = computeGraftingPlan('Fruit trees', '5.5', 101, 'V-Clip', 10);
    expect(plan.tubesNeeded).toBe(112);
  });

  it('supports a zero wastage buffer', () => {
    const plan = computeGraftingPlan('Fruit trees', '5.5', 500, 'V-Clip', 0);
    expect(plan.tubesNeeded).toBe(500);
  });
});

describe('consumables planner', () => {
  it('applies the buffer once and shares it across trays, pots and labels', () => {
    const plan = computeConsumablesPlan(1000, 104, true, true, true, 10);
    expect(plan.plantsWithBuffer).toBe(1100);
    expect(plan.traysNeeded).toBe(11); // ceil(1100 / 104)
    expect(plan.potsNeeded).toBe(1100);
    expect(plan.domesNeeded).toBe(11);
    expect(plan.tiesNeeded).toBe(220); // ceil(1100 * 0.2)
    expect(plan.labelsNeeded).toBe(1111); // trays + pots
  });

  it('zeroes pots, domes and ties when their stage is not selected', () => {
    const plan = computeConsumablesPlan(1000, 104, false, false, false, 10);
    expect(plan.potsNeeded).toBe(0);
    expect(plan.domesNeeded).toBe(0);
    expect(plan.tiesNeeded).toBe(0);
    expect(plan.labelsNeeded).toBe(plan.traysNeeded);
  });
});
