// Stage 01 · Prepare — growing media, trays and containers.
// Every field is copied verbatim from docs/content/copy-supplies.md; do not round or rephrase.

export interface VermiculiteGrade {
  [key: string]: string;
  sku: string;
  grade: string;
  particleFraction: string;
  ph: string;
  bulkDensity: string;
  pack: string;
}

export const VERMICULITE_GRADES: VermiculiteGrade[] = [
  {
    sku: 'PRO-VERM F',
    grade: 'Fine vermiculite',
    particleFraction: '0.5–1.0 mm',
    ph: '7.0–8.0',
    bulkDensity: '100–130 kg/m³',
    pack: '20 kg · 50 L',
  },
  {
    sku: 'PRO-VERM M',
    grade: 'Medium vermiculite',
    particleFraction: '1.0–2.0 mm',
    ph: '7.0–8.0',
    bulkDensity: '90–120 kg/m³',
    pack: '20 kg',
  },
  {
    sku: 'PRO-VERM C',
    grade: 'Coarse vermiculite',
    particleFraction: '2.0–4.0 mm',
    ph: '7.0–8.5',
    bulkDensity: '70–100 kg/m³',
    pack: '20 kg',
  },
];

export interface PeatFormulation {
  [key: string]: string;
  sku: string;
  formulation: string;
  particleFraction: string;
  ph: string;
  conductivity: string;
  airFilledPorosity: string;
  pack: string;
}

export const PEAT_FORMULATIONS: PeatFormulation[] = [
  {
    sku: 'PRO-PEAT SEED',
    formulation: 'Seed and plug',
    particleFraction: '0–7 mm',
    ph: '5.5–6.0',
    conductivity: '0.6–0.8 mS/cm',
    airFilledPorosity: '8–12 %',
    pack: '250 L',
  },
  {
    sku: 'PRO-PEAT PROP',
    formulation: 'Cuttings and young plants',
    particleFraction: '0–10 mm',
    ph: '5.3–5.8',
    conductivity: '0.4–0.6 mS/cm',
    airFilledPorosity: '15–20 %',
    pack: '250 L',
  },
  {
    sku: 'PRO-PEAT GRAFT',
    formulation: 'Grafting and rootstock',
    particleFraction: '0–20 mm',
    ph: '5.5–6.2',
    conductivity: '0.5–0.7 mS/cm',
    airFilledPorosity: '20–25 %',
    pack: '250 L',
  },
];

export interface TrayContainer {
  [key: string]: string;
  sku: string;
  cells: string;
  cellVolume: string;
  sheetSize: string;
  material: string;
  pack: string;
}

export const TRAYS_AND_CONTAINERS: TrayContainer[] = [
  {
    sku: 'PRO-TRAY 104',
    cells: '104',
    cellVolume: '26 ml',
    sheetSize: '540 × 280 mm',
    material: 'UV-stabilised polystyrene',
    pack: '100',
  },
  {
    sku: 'PRO-TRAY 128',
    cells: '128',
    cellVolume: '20 ml',
    sheetSize: '540 × 280 mm',
    material: 'UV-stabilised polystyrene',
    pack: '100',
  },
  {
    sku: 'PRO-TRAY 200',
    cells: '200',
    cellVolume: '12 ml',
    sheetSize: '540 × 280 mm',
    material: 'UV-stabilised polystyrene',
    pack: '100',
  },
  {
    sku: 'PRO-TRAY 288',
    cells: '288',
    cellVolume: '8 ml',
    sheetSize: '540 × 280 mm',
    material: 'UV-stabilised polystyrene',
    pack: '100',
  },
];
