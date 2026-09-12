// The specification-table registry: one descriptor per published table.
//
// Session 8 integration note. The stage pages under /supplies and the
// /specifications index both render these tables. Originally each page
// declared its own column array, which meant the same table could drift
// between the two places. Both now import the descriptor from here, so the
// caption, the column set, the column order and the rows are defined once.
// A new table is added by appending a descriptor — nothing else.

import type { SpecColumn } from '../../components/supplies/SpecTable.astro';
import { VERMICULITE_GRADES, PEAT_FORMULATIONS, TRAYS_AND_CONTAINERS } from './prepare';
import { GRAFTING_SLEEVES, GRAFTING_CLIPS } from './graft';
import { PROPAGATION_MONITORING } from './root';
import { PRO_SAN_DILUTIONS, HYGIENE_RANGE } from './protect';
import { TRACEABILITY_AND_QC } from './record';

export type StageSlug = 'prepare' | 'graft' | 'root' | 'protect' | 'record';

export interface SpecTableDescriptor {
  /** Stable identifier, used as the anchor on /specifications. */
  id: string;
  /** The stage page this table also appears on. */
  stage: StageSlug;
  caption: string;
  columns: SpecColumn[];
  rows: Record<string, string>[];
}

export const SPEC_TABLES: SpecTableDescriptor[] = [
  {
    id: 'vermiculite',
    stage: 'prepare',
    caption: 'Propagation media — vermiculite grades',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'grade', label: 'Grade' },
      { key: 'particleFraction', label: 'Particle fraction' },
      { key: 'ph', label: 'pH' },
      { key: 'bulkDensity', label: 'Bulk density' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: VERMICULITE_GRADES,
  },
  {
    id: 'peat',
    stage: 'prepare',
    caption: 'Propagation media — peat formulations',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'formulation', label: 'Formulation' },
      { key: 'particleFraction', label: 'Particle fraction' },
      { key: 'ph', label: 'pH' },
      { key: 'conductivity', label: 'Conductivity (1:5)' },
      { key: 'airFilledPorosity', label: 'Air-filled porosity' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: PEAT_FORMULATIONS,
  },
  {
    id: 'trays',
    stage: 'prepare',
    caption: 'Trays and containers',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'cells', label: 'Cells' },
      { key: 'cellVolume', label: 'Cell volume' },
      { key: 'sheetSize', label: 'Sheet size' },
      { key: 'material', label: 'Material' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: TRAYS_AND_CONTAINERS,
  },
  {
    id: 'sleeves',
    stage: 'graft',
    caption: 'Silicone grafting sleeves',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'bore', label: 'Bore' },
      { key: 'wall', label: 'Wall' },
      { key: 'length', label: 'Length' },
      { key: 'crop', label: 'Crop' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: GRAFTING_SLEEVES,
  },
  {
    id: 'clips',
    stage: 'graft',
    caption: 'Grafting clips',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'profile', label: 'Profile' },
      { key: 'jaw', label: 'Jaw' },
      { key: 'material', label: 'Material' },
      { key: 'reusable', label: 'Reusable' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: GRAFTING_CLIPS,
  },
  {
    id: 'monitoring',
    stage: 'root',
    caption: 'Propagation monitoring',
    columns: [
      { key: 'measurement', label: 'Measurement' },
      { key: 'why', label: 'Why it is measured' },
      { key: 'loggingInterval', label: 'Logging interval' },
    ],
    rows: PROPAGATION_MONITORING,
  },
  {
    id: 'dilutions',
    stage: 'protect',
    caption: 'PRO-SAN working dilutions from a 12 % concentrate',
    columns: [
      { key: 'application', label: 'Application' },
      { key: 'target', label: 'Target' },
      { key: 'concentratePer10L', label: 'Concentrate per 10 L' },
      { key: 'contactTime', label: 'Contact time' },
    ],
    rows: PRO_SAN_DILUTIONS,
  },
  {
    id: 'hygiene',
    stage: 'protect',
    caption: 'Hygiene range',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'product', label: 'Product' },
      { key: 'strength', label: 'Strength' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: HYGIENE_RANGE,
  },
  {
    id: 'traceability',
    stage: 'record',
    caption: 'Traceability and QC',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'format', label: 'Format' },
      { key: 'size', label: 'Size' },
      { key: 'material', label: 'Material' },
      { key: 'pack', label: 'Pack' },
    ],
    rows: TRACEABILITY_AND_QC,
  },
];

export function specTable(id: string): SpecTableDescriptor {
  const table = SPEC_TABLES.find((candidate) => candidate.id === id);
  if (!table) throw new Error(`Unknown specification table: ${id}`);
  return table;
}

export function specTablesForStage(stage: StageSlug): SpecTableDescriptor[] {
  return SPEC_TABLES.filter((table) => table.stage === stage);
}
