// Stage 03 · Root — misting, benching, irrigation and monitoring.
// Every field is copied verbatim from docs/content/copy-supplies.md; do not round or rephrase.

export interface MonitoringMeasurement {
  [key: string]: string;
  measurement: string;
  why: string;
  loggingInterval: string;
}

export const PROPAGATION_MONITORING: MonitoringMeasurement[] = [
  {
    measurement: 'Air temperature and humidity',
    why: 'The two inputs to vapour pressure deficit',
    loggingInterval: '1 min',
  },
  {
    measurement: 'Vapour pressure deficit',
    why: 'The variable the misting decision is actually made on',
    loggingInterval: '1 min',
  },
  {
    measurement: 'Substrate moisture',
    why: 'Waterlogging at the base of the cell',
    loggingInterval: '5 min',
  },
  {
    measurement: 'Substrate conductivity',
    why: 'Salt build-up under repeated misting',
    loggingInterval: '5 min',
  },
  {
    measurement: 'Light, PAR',
    why: 'The load driving water loss from the leaf',
    loggingInterval: '1 min',
  },
];

export const SPECIFIED_AND_SOURCED_CATEGORIES: string[] = [
  'Misting and fogging — nozzle selection, line layout, pump and filtration',
  'Climate control — heating, cooling, ventilation, humidity domes and covers',
  'Benching and racking — fixed, rolling, and heated benches',
  'Irrigation — drip, ebb and flow, capillary matting',
  'Shade and screening — internal and external, by light transmission',
  'LED growing lights and control',
  'Automation and control panels',
];
