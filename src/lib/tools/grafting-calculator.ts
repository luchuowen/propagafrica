// Pure calculation logic for /tools/grafting-calculator/ — blueprint.md
// Section 10 and the Build Workbook's Calculator Logic section. Kept apart
// from the page so the ratios can be unit tested without a browser.
export const CROP_GROUPS = [
  'Roses and ornamentals',
  'Tomato, pepper and eggplant',
  'Cucumber, melon and watermelon',
  'Fruit trees',
] as const;
export type CropGroup = (typeof CROP_GROUPS)[number];

export const CLIP_TYPES = ['U-Clip', 'Omega Clip', 'Round Clip', 'Tomato Clip', 'V-Clip'] as const;
export type ClipType = (typeof CLIP_TYPES)[number];

// PRO-ROSE 35-85 — blueprint.md Section 3. `as const` (not `RoseSize[]`) so
// `ROSE_SIZES[0]` below stays a known-present tuple element rather than
// `RoseSize | undefined` under the project's `noUncheckedIndexedAccess`.
export const ROSE_SIZES = [
  { diameter: '3.5', label: '3.5mm (PRO-ROSE 35)', code: 'PRO-ROSE 35' },
  { diameter: '4.5', label: '4.5mm (PRO-ROSE 45)', code: 'PRO-ROSE 45' },
  { diameter: '5.5', label: '5.5mm (PRO-ROSE 55)', code: 'PRO-ROSE 55' },
  { diameter: '6.5', label: '6.5mm (PRO-ROSE 65)', code: 'PRO-ROSE 65' },
  { diameter: '7.5', label: '7.5mm (PRO-ROSE 75)', code: 'PRO-ROSE 75' },
  { diameter: '8.5', label: '8.5mm (PRO-ROSE 85)', code: 'PRO-ROSE 85' },
] as const;

// Default clip pre-selected per crop group; the select always offers all
// five types so the user can override it.
export const DEFAULT_CLIP_BY_CROP: Record<CropGroup, ClipType> = {
  'Roses and ornamentals': 'Omega Clip',
  'Tomato, pepper and eggplant': 'Tomato Clip',
  'Cucumber, melon and watermelon': 'U-Clip',
  'Fruit trees': 'V-Clip',
};

export function productCodeFor(cropGroup: CropGroup, roseDiameter: string): string {
  if (cropGroup === 'Roses and ornamentals') {
    return ROSE_SIZES.find((size) => size.diameter === roseDiameter)?.code ?? ROSE_SIZES[0].code;
  }
  if (cropGroup === 'Tomato, pepper and eggplant') return 'PRO-VEG';
  if (cropGroup === 'Cucumber, melon and watermelon') return 'PRO-CUC';
  return 'PRO-TREE';
}

export interface GraftingPlan {
  productCode: string;
  clipType: ClipType;
  tubesNeeded: number;
  clipsNeeded: number;
}

export function computeGraftingPlan(
  cropGroup: CropGroup,
  roseDiameter: string,
  grafts: number,
  clipType: ClipType,
  bufferPercent: number,
): GraftingPlan {
  const withBuffer = Math.ceil(grafts * (1 + bufferPercent / 100));
  return {
    productCode: productCodeFor(cropGroup, roseDiameter),
    clipType,
    tubesNeeded: withBuffer,
    clipsNeeded: withBuffer,
  };
}
