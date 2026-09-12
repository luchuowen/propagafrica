// Specification tables for /specifications, transcribed from
// docs/content/copy-supplies.md (the approved copy deck for /supplies/*).
// Duplicated here rather than imported from a shared product module because
// no such module exists yet in this codebase.
//
// TODO: if a canonical product data module is introduced later (for example
// to back the sleeve selector or consumables planner named in blueprint.md
// §9), reconcile these tables with it as a single source of truth.

export interface SpecTable {
  caption: string;
  columns: readonly string[];
  rows: readonly (readonly string[])[];
}

export interface SpecSection {
  id: string;
  heading: string;
  stageLabel: string;
  stageHref: string;
  tables: readonly SpecTable[];
  note?: string;
}

export const SPEC_SECTIONS: readonly SpecSection[] = [
  {
    id: 'media',
    heading: 'Growing media',
    stageLabel: 'Prepare',
    stageHref: '/supplies/prepare',
    tables: [
      {
        caption: 'Propagation media — vermiculite',
        columns: ['SKU', 'Grade', 'Particle fraction', 'pH', 'Bulk density', 'Pack'],
        rows: [
          [
            'PRO-VERM F',
            'Fine vermiculite',
            '0.5–1.0 mm',
            '7.0–8.0',
            '100–130 kg/m³',
            '20 kg · 50 L',
          ],
          ['PRO-VERM M', 'Medium vermiculite', '1.0–2.0 mm', '7.0–8.0', '90–120 kg/m³', '20 kg'],
          ['PRO-VERM C', 'Coarse vermiculite', '2.0–4.0 mm', '7.0–8.5', '70–100 kg/m³', '20 kg'],
        ],
      },
      {
        caption: 'Propagation media — peat formulations',
        columns: [
          'SKU',
          'Formulation',
          'Particle fraction',
          'pH',
          'Conductivity (1:5)',
          'Air-filled porosity',
          'Pack',
        ],
        rows: [
          [
            'PRO-PEAT SEED',
            'Seed and plug',
            '0–7 mm',
            '5.5–6.0',
            '0.6–0.8 mS/cm',
            '8–12 %',
            '250 L',
          ],
          [
            'PRO-PEAT PROP',
            'Cuttings and young plants',
            '0–10 mm',
            '5.3–5.8',
            '0.4–0.6 mS/cm',
            '15–20 %',
            '250 L',
          ],
          [
            'PRO-PEAT GRAFT',
            'Grafting and rootstock',
            '0–20 mm',
            '5.5–6.2',
            '0.5–0.7 mS/cm',
            '20–25 %',
            '250 L',
          ],
        ],
      },
    ],
    note: 'Vermiculite is exfoliated, supplied at 8 % moisture or below, cation exchange capacity 80–150 meq/100 g. Peat is a sphagnum-based professional substrate; wetting agent and starter nutrition to the stated formulation. Conductivity measured on a 1:5 volume extract. A certificate of analysis is issued per batch.',
  },
  {
    id: 'trays',
    heading: 'Trays and containers',
    stageLabel: 'Prepare',
    stageHref: '/supplies/prepare',
    tables: [
      {
        caption: 'Trays and containers',
        columns: ['SKU', 'Cells', 'Cell volume', 'Sheet size', 'Material', 'Pack'],
        rows: [
          ['PRO-TRAY 104', '104', '26 ml', '540 × 280 mm', 'UV-stabilised polystyrene', '100'],
          ['PRO-TRAY 128', '128', '20 ml', '540 × 280 mm', 'UV-stabilised polystyrene', '100'],
          ['PRO-TRAY 200', '200', '12 ml', '540 × 280 mm', 'UV-stabilised polystyrene', '100'],
          ['PRO-TRAY 288', '288', '8 ml', '540 × 280 mm', 'UV-stabilised polystyrene', '100'],
        ],
      },
    ],
  },
  {
    id: 'sleeves',
    heading: 'Silicone grafting sleeves',
    stageLabel: 'Graft',
    stageHref: '/supplies/graft',
    tables: [
      {
        caption: 'Silicone grafting sleeves',
        columns: ['SKU', 'Bore', 'Wall', 'Length', 'Crop', 'Pack'],
        rows: [
          ['PRO-ROSE 35', '3.5 mm', '0.50 mm', '20 mm', 'Rose and ornamental', '50 000'],
          ['PRO-ROSE 45', '4.5 mm', '0.50 mm', '20 mm', 'Rose and ornamental', '50 000'],
          ['PRO-ROSE 55', '5.5 mm', '0.60 mm', '22 mm', 'Rose and ornamental', '50 000'],
          ['PRO-ROSE 65', '6.5 mm', '0.60 mm', '22 mm', 'Rose and ornamental', '50 000'],
          ['PRO-ROSE 75', '7.5 mm', '0.70 mm', '25 mm', 'Rose and ornamental', '50 000'],
          ['PRO-ROSE 85', '8.5 mm', '0.70 mm', '25 mm', 'Rose and ornamental', '50 000'],
          ['PRO-VEG', '1.5–2.5 mm', '0.40 mm', '15 mm', 'Tomato, pepper, aubergine', '100 000'],
          ['PRO-CUC', '2.5–4.0 mm', '0.45 mm', '18 mm', 'Cucumber, melon, watermelon', '100 000'],
          ['PRO-TREE', '4.0–12 mm', '0.70 mm', '30 mm', 'Fruit tree', '50 000'],
        ],
      },
    ],
    note: 'Platinum-cured silicone, transparent, Shore A 40 ± 5, light transmission 88 % or better so a join can be inspected without removing the sleeve. Service range −40 °C to +200 °C, UV stable. Dimensional tolerance ± 0.15 mm on bore, held to batch. Single use.',
  },
  {
    id: 'clips',
    heading: 'Grafting clips',
    stageLabel: 'Graft',
    stageHref: '/supplies/graft',
    tables: [
      {
        caption: 'Grafting clips',
        columns: ['SKU', 'Profile', 'Jaw', 'Material', 'Reusable', 'Pack'],
        rows: [
          ['PRO-CLIP U', 'U', '1.5 · 2.0 · 2.5 · 3.0 mm', 'Silicone', 'No', '1 000 · 5 000'],
          ['PRO-CLIP O', 'Omega', '1.5 · 2.0 · 2.5 · 3.0 mm', 'Elastomer', 'No', '1 000 · 5 000'],
          ['PRO-CLIP R', 'Round', '2.0 · 2.5 · 3.0 mm', 'Thermoplastic', 'Yes', '1 000 · 5 000'],
          ['PRO-CLIP T', 'Tomato', '1.5 · 2.0 · 2.5 mm', 'Silicone', 'No', '1 000 · 5 000'],
          ['PRO-CLIP V', 'V', '2.0 · 2.5 · 3.0 mm', 'Thermoplastic', 'Yes', '1 000 · 5 000'],
        ],
      },
    ],
  },
  {
    id: 'monitoring',
    heading: 'Propagation monitoring',
    stageLabel: 'Root',
    stageHref: '/supplies/root',
    tables: [
      {
        caption: 'Propagation monitoring',
        columns: ['Measurement', 'Why it is measured', 'Logging interval'],
        rows: [
          ['Air temperature and humidity', 'The two inputs to vapour pressure deficit', '1 min'],
          [
            'Vapour pressure deficit',
            'The variable the misting decision is actually made on',
            '1 min',
          ],
          ['Substrate moisture', 'Waterlogging at the base of the cell', '5 min'],
          ['Substrate conductivity', 'Salt build-up under repeated misting', '5 min'],
          ['Light, PAR', 'The load driving water loss from the leaf', '1 min'],
        ],
      },
    ],
    note: 'Moisture sensors are calibrated to the substrate actually in use — coco peat, a vermiculite blend and a peat formulation each read differently. Supplied as hardware, dashboard and support together, with threshold alerts and export of the full history.',
  },
  {
    id: 'hygiene',
    heading: 'Nursery hygiene',
    stageLabel: 'Protect',
    stageHref: '/supplies/protect',
    tables: [
      {
        caption: 'PRO-SAN working dilutions from a 12 % concentrate',
        columns: ['Application', 'Target', 'Concentrate per 10 L', 'Contact time'],
        rows: [
          ['Tool dip, between plants', '1 000 ppm', '83 ml', '30 s or more'],
          ['Footbath, refreshed daily', '1 000 ppm', '83 ml', 'on entry'],
          ['Bench and surface wash', '500 ppm', '42 ml', '5 min or more'],
          ['Irrigation line shock', '200 ppm', '17 ml', '60 min or more'],
          ['Empty-house terminal clean', '2 000 ppm', '167 ml', '10 min or more'],
        ],
      },
      {
        caption: 'Hygiene range',
        columns: ['SKU', 'Product', 'Strength', 'Pack'],
        rows: [
          ['PRO-SAN 10', 'Sodium hypochlorite', '10 % available chlorine, nominal', '20 L'],
          ['PRO-SAN 12', 'Sodium hypochlorite', '12 % available chlorine, nominal', '20 L · 200 L'],
          ['PRO-FOOT', 'Footbath tray and grid', '600 × 400 mm', 'each'],
          ['PRO-DIP', 'Tool dip station', '5 L', 'each'],
          ['PRO-SPRAY 5', 'Knapsack sprayer', '5 L', 'each'],
          ['PRO-SPRAY 16', 'Knapsack sprayer', '16 L', 'each'],
          ['PRO-PPE', 'Gloves, aprons, overshoes, eye protection', '—', 'by pack'],
        ],
      },
    ],
    note: 'Sodium hypochlorite, CAS 7681-52-9. Shelf life 90 days from manufacture at 25 °C or below, stored out of direct light. Safety data sheet and certificate of analysis supplied with every consignment.',
  },
  {
    id: 'traceability',
    heading: 'Traceability and QC',
    stageLabel: 'Record',
    stageHref: '/supplies/record',
    tables: [
      {
        caption: 'Traceability and QC',
        columns: ['SKU', 'Format', 'Size', 'Material', 'Pack'],
        rows: [
          ['PRO-LABEL LOOP', 'Loop label', '200 × 8 mm', 'LDPE, UV stable', '1 000'],
          ['PRO-LABEL T', 'Write-on tag', '120 × 20 mm', 'Rigid polypropylene', '1 000'],
          [
            'PRO-TRACE',
            'Thermal label roll',
            '50 × 25 mm',
            'Top-coated synthetic',
            '1 000 · 5 000',
          ],
          ['PRO-TRACE CARD', 'Batch card', 'A6', '200 gsm, moisture resistant', '500 · 1 000'],
          [
            'PRO-QC',
            'QC logbook',
            'A5, 100 pages, duplicate',
            'Carbonless, numbered',
            '50 · 100 books',
          ],
          ['PRO-MARK', 'Permanent marker', '1.0 mm bullet', 'Pigment ink, UV resistant', '12'],
        ],
      },
    ],
    note: 'Batch cards carry fixed fields for variety, rootstock, scion source, date, operator, treatment and QC observation. Logbooks are sequentially numbered and duplicate, so the copy stays in the house and the original goes to the file.',
  },
] as const;
