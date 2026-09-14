// Pure calculation logic for /tools/consumables-planner/ — blueprint.md
// Section 10 and the Build Workbook's Calculator Logic section. Kept apart
// from the page so the ratios can be unit tested without a browser.
export const CELL_COUNTS = [50, 72, 104, 128, 200] as const;
export type CellCount = (typeof CELL_COUNTS)[number];

export interface ConsumablesPlan {
  plantsWithBuffer: number;
  traysNeeded: number;
  potsNeeded: number;
  domesNeeded: number;
  tiesNeeded: number;
  labelsNeeded: number;
}

export function computeConsumablesPlan(
  cuttings: number,
  cellsPerTray: number,
  pottingOn: boolean,
  domes: boolean,
  staked: boolean,
  bufferPercent: number,
): ConsumablesPlan {
  const plantsWithBuffer = Math.ceil(cuttings * (1 + bufferPercent / 100));
  const traysNeeded = Math.ceil(plantsWithBuffer / cellsPerTray);
  const potsNeeded = pottingOn ? plantsWithBuffer : 0;
  const domesNeeded = domes ? traysNeeded : 0;
  const tiesNeeded = staked ? Math.ceil(plantsWithBuffer * 0.2) : 0;
  const labelsNeeded = traysNeeded + potsNeeded;
  return { plantsWithBuffer, traysNeeded, potsNeeded, domesNeeded, tiesNeeded, labelsNeeded };
}
