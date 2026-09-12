// Pure sleeve-selection logic for SleeveSelector.astro. No DOM, no I/O.

export const CROPS = [
  { key: 'rose', label: 'Rose' },
  { key: 'vegetable', label: 'Tomato, pepper, aubergine' },
  { key: 'cucurbit', label: 'Cucumber, melon, watermelon' },
  { key: 'tree', label: 'Fruit tree' },
] as const;

export type CropKey = (typeof CROPS)[number]['key'];

export const STEM_MIN = 1.4;
export const STEM_MAX = 12;
export const STEM_STEP = 0.1;

// The gap between bore and stem within which the fit is called on target.
const TOLERANCE_MM = 0.6;

interface RoseBand {
  min: number;
  max: number;
  sku: string;
  bore: number;
  wall: number;
  length: number;
  pack: number;
}

const ROSE_BANDS: readonly RoseBand[] = [
  { min: 3.0, max: 3.9, sku: 'PRO-ROSE 35', bore: 3.5, wall: 0.5, length: 20, pack: 50_000 },
  { min: 4.0, max: 4.9, sku: 'PRO-ROSE 45', bore: 4.5, wall: 0.5, length: 20, pack: 50_000 },
  { min: 5.0, max: 5.9, sku: 'PRO-ROSE 55', bore: 5.5, wall: 0.6, length: 22, pack: 50_000 },
  { min: 6.0, max: 6.9, sku: 'PRO-ROSE 65', bore: 6.5, wall: 0.6, length: 22, pack: 50_000 },
  { min: 7.0, max: 7.9, sku: 'PRO-ROSE 75', bore: 7.5, wall: 0.7, length: 25, pack: 50_000 },
  { min: 8.0, max: Infinity, sku: 'PRO-ROSE 85', bore: 8.5, wall: 0.7, length: 25, pack: 50_000 },
];

interface SingleSkuSleeve {
  sku: string;
  boreMin: number;
  boreMax: number;
  wall: number;
  length: number;
  pack: number;
}

const VEGETABLE: SingleSkuSleeve = {
  sku: 'PRO-VEG',
  boreMin: 1.5,
  boreMax: 2.5,
  wall: 0.4,
  length: 15,
  pack: 100_000,
};

const CUCURBIT: SingleSkuSleeve = {
  sku: 'PRO-CUC',
  boreMin: 2.5,
  boreMax: 4.0,
  wall: 0.45,
  length: 18,
  pack: 100_000,
};

const TREE: SingleSkuSleeve = {
  sku: 'PRO-TREE',
  boreMin: 4.0,
  boreMax: 12,
  wall: 0.7,
  length: 30,
  pack: 50_000,
};

export interface SleeveResult {
  crop: CropKey;
  stemDiameter: number;
  sku: string;
  /** Representative bore used for the gap calculation and the to-scale drawing. */
  bore: number;
  boreMin: number;
  boreMax: number;
  /** "3.5" for a banded rose sku, "1.5–2.5" for a single-sku bore range. */
  boreLabel: string;
  wall: number;
  length: number;
  pack: number;
  /** bore − stem, rounded to one decimal place. Not meaningful for "tree". */
  gap: number;
  fitNote: string;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function formatMm(n: number): string {
  return Math.abs(n).toFixed(1);
}

function fitNoteFor(bore: number, stemDiameter: number): { gap: number; fitNote: string } {
  const gap = round1(bore - stemDiameter);
  if (gap < -TOLERANCE_MM) {
    return {
      gap,
      fitNote: `This stem is over the sleeve bore by ${formatMm(gap)} mm. The sleeve will grip hard and risks pressing on the layer that has to grow. Measure a wider sample before ordering.`,
    };
  }
  if (gap > TOLERANCE_MM) {
    return {
      gap,
      fitNote: `Bore sits ${formatMm(gap)} mm over the stem. The join will move under mist. Drop one size.`,
    };
  }
  return {
    gap,
    fitNote: `Bore within ${formatMm(gap)} mm of the stem — the sleeve grips without pressing. This is the target fit.`,
  };
}

const FIRST_ROSE_BAND = ROSE_BANDS[0]!;
const LAST_ROSE_BAND = ROSE_BANDS[ROSE_BANDS.length - 1]!;

function findRoseBand(stemDiameter: number): RoseBand {
  if (stemDiameter < FIRST_ROSE_BAND.min) return FIRST_ROSE_BAND;
  const band = ROSE_BANDS.find((b) => stemDiameter >= b.min && stemDiameter <= b.max);
  return band ?? LAST_ROSE_BAND;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function selectSleeve(crop: CropKey, stemDiameterInput: number): SleeveResult {
  const stemDiameter = clamp(round1(stemDiameterInput), STEM_MIN, STEM_MAX);

  if (crop === 'rose') {
    const band = findRoseBand(stemDiameter);
    const { gap, fitNote } = fitNoteFor(band.bore, stemDiameter);
    return {
      crop,
      stemDiameter,
      sku: band.sku,
      bore: band.bore,
      boreMin: band.bore,
      boreMax: band.bore,
      boreLabel: band.bore.toFixed(1),
      wall: band.wall,
      length: band.length,
      pack: band.pack,
      gap,
      fitNote,
    };
  }

  const single = crop === 'vegetable' ? VEGETABLE : crop === 'cucurbit' ? CUCURBIT : TREE;
  const bore = clamp(stemDiameter, single.boreMin, single.boreMax);

  if (crop === 'tree') {
    return {
      crop,
      stemDiameter,
      sku: single.sku,
      bore,
      boreMin: single.boreMin,
      boreMax: single.boreMax,
      boreLabel: `${single.boreMin.toFixed(1)}–${single.boreMax.toFixed(1)}`,
      wall: single.wall,
      length: single.length,
      pack: single.pack,
      gap: round1(bore - stemDiameter),
      fitNote:
        'PRO-TREE is supplied to the scion and rootstock geometry rather than to a single measurement. Send us both diameters and the graft type.',
    };
  }

  const { gap, fitNote } = fitNoteFor(bore, stemDiameter);
  return {
    crop,
    stemDiameter,
    sku: single.sku,
    bore,
    boreMin: single.boreMin,
    boreMax: single.boreMax,
    boreLabel: `${single.boreMin.toFixed(1)}–${single.boreMax.toFixed(1)}`,
    wall: single.wall,
    length: single.length,
    pack: single.pack,
    gap,
    fitNote,
  };
}

/** Radii (px) for the to-scale stem/bore SVG, sharing one mm→px scale. */
export function scaledRadii(
  stemDiameter: number,
  bore: number,
  maxDiameterMm: number,
  maxRadiusPx: number,
): { stemRadiusPx: number; boreRadiusPx: number } {
  const scale = maxRadiusPx / (maxDiameterMm / 2);
  return {
    stemRadiusPx: (stemDiameter / 2) * scale,
    boreRadiusPx: (bore / 2) * scale,
  };
}
