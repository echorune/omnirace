/**
 * Detailed nautical cartography coordinates for the South Pacific race zone:
 * Tahiti to Fiji via Cook Islands and Tonga (-148° to -182° normalized lon, -15° to -23° lat).
 */

export interface Island {
  id: string;
  name: string;
  archipelago: string;
  center: [number, number]; // [lat, lon] (lon normalized -148 to -182)
  polygon: [number, number][]; // coordinates for coastline rendering
  elevationM: number;
}

export interface HazardZone {
  id: string;
  name: string;
  type: 'coral-reef' | 'submerged-volcano' | 'shallows' | 'restricted';
  severity: 'extreme' | 'moderate' | 'caution';
  center: [number, number];
  polygon: [number, number][];
  warningText: string;
}

export interface BathymetryContour {
  depthM: number;
  label: string;
  color: string;
  lines: [number, number][][];
}

// Normalized longitudes: 178°E is represented as -182.0 for continuous cartographic rendering
export const PACIFIC_ISLANDS: Island[] = [
  // Society Islands (French Polynesia)
  {
    id: 'isl-tahiti',
    name: 'Tahiti (Nui & Iti)',
    archipelago: 'Society Islands',
    center: [-17.65, -149.45],
    elevationM: 2241,
    polygon: [
      [-17.48, -149.60],
      [-17.52, -149.30],
      [-17.68, -149.15],
      [-17.82, -149.18],
      [-17.88, -149.25],
      [-17.78, -149.42],
      [-17.85, -149.60],
      [-17.62, -149.65],
      [-17.50, -149.62]
    ]
  },
  {
    id: 'isl-moorea',
    name: 'Moorea',
    archipelago: 'Society Islands',
    center: [-17.53, -149.83],
    elevationM: 1207,
    polygon: [
      [-17.47, -149.83],
      [-17.50, -149.77],
      [-17.58, -149.78],
      [-17.59, -149.88],
      [-17.52, -149.92],
      [-17.47, -149.85]
    ]
  },
  {
    id: 'isl-raiatea',
    name: 'Raiatea & Taha’a',
    archipelago: 'Society Islands',
    center: [-16.75, -151.48],
    elevationM: 1017,
    polygon: [
      [-16.60, -151.50],
      [-16.68, -151.42],
      [-16.82, -151.40],
      [-16.92, -151.48],
      [-16.85, -151.56],
      [-16.68, -151.55]
    ]
  },
  // Cook Islands
  {
    id: 'isl-rarotonga',
    name: 'Rarotonga',
    archipelago: 'Cook Islands',
    center: [-21.23, -159.78],
    elevationM: 658,
    polygon: [
      [-21.20, -159.78],
      [-21.22, -159.73],
      [-21.26, -159.75],
      [-21.27, -159.81],
      [-21.23, -159.83],
      [-21.20, -159.79]
    ]
  },
  {
    id: 'isl-aitutaki',
    name: 'Aitutaki Atoll',
    archipelago: 'Cook Islands',
    center: [-18.86, -159.78],
    elevationM: 123,
    polygon: [
      [-18.82, -159.78],
      [-18.85, -159.74],
      [-18.91, -159.76],
      [-18.90, -159.82],
      [-18.84, -159.81]
    ]
  },
  {
    id: 'isl-palmerston',
    name: 'Palmerston Atoll',
    archipelago: 'Cook Islands',
    center: [-18.06, -163.19],
    elevationM: 6,
    polygon: [
      [-18.02, -163.19],
      [-18.05, -163.14],
      [-18.10, -163.16],
      [-18.09, -163.23],
      [-18.04, -163.22]
    ]
  },
  // Niue
  {
    id: 'isl-niue',
    name: 'Niue (The Rock of Polynesia)',
    archipelago: 'Niue',
    center: [-19.05, -169.86],
    elevationM: 68,
    polygon: [
      [-19.00, -169.87],
      [-19.03, -169.80],
      [-19.12, -169.82],
      [-19.14, -169.91],
      [-19.07, -169.93]
    ]
  },
  // Kingdom of Tonga
  {
    id: 'isl-vavau',
    name: 'Vava’u Group',
    archipelago: 'Tonga',
    center: [-18.65, -173.98],
    elevationM: 215,
    polygon: [
      [-18.58, -173.98],
      [-18.62, -173.90],
      [-18.72, -173.92],
      [-18.74, -174.05],
      [-18.66, -174.06]
    ]
  },
  {
    id: 'isl-tongatapu',
    name: 'Tongatapu',
    archipelago: 'Tonga',
    center: [-21.17, -175.20],
    elevationM: 65,
    polygon: [
      [-21.12, -175.20],
      [-21.15, -175.08],
      [-21.24, -175.12],
      [-21.26, -175.28],
      [-21.18, -175.32]
    ]
  },
  // Fiji Archipelago (lon normalized)
  {
    id: 'isl-lau',
    name: 'Lau Archipelago (Lakeba)',
    archipelago: 'Fiji',
    center: [-18.22, -178.78],
    elevationM: 219,
    polygon: [
      [-18.18, -178.78],
      [-18.21, -178.74],
      [-18.25, -178.76],
      [-18.25, -178.82],
      [-18.20, -178.81]
    ]
  },
  {
    id: 'isl-viti-levu',
    name: 'Viti Levu & Suva',
    archipelago: 'Fiji',
    center: [-18.00, -181.80], // 178.2°E
    elevationM: 1324,
    polygon: [
      [-17.40, -182.20],
      [-17.50, -181.50],
      [-18.05, -181.40],
      [-18.25, -181.55],
      [-18.15, -182.00],
      [-17.75, -182.45]
    ]
  }
];

export const CORAL_HAZARDS: HazardZone[] = [
  {
    id: 'hz-moorea-barrier',
    name: 'Moorea Outer Barrier Coral Break',
    type: 'coral-reef',
    severity: 'extreme',
    center: [-17.46, -149.83],
    polygon: [
      [-17.44, -149.88],
      [-17.44, -149.75],
      [-17.48, -149.73],
      [-17.49, -149.90]
    ],
    warningText: 'Exposed coral heads at low tide. Breaking swell 3.2m.'
  },
  {
    id: 'hz-palmerston-lagoon',
    name: 'Palmerston Shoal & Breaker Shelf',
    type: 'coral-reef',
    severity: 'extreme',
    center: [-18.06, -163.19],
    polygon: [
      [-17.98, -163.26],
      [-17.98, -163.10],
      [-18.14, -163.11],
      [-18.14, -163.27]
    ],
    warningText: 'Uncharted submerged pinnacles. Keep 5 NM radar clearance.'
  },
  {
    id: 'hz-astrolabe-reef',
    name: 'Great Astrolabe Barrier Reef (Fiji)',
    type: 'coral-reef',
    severity: 'extreme',
    center: [-18.75, -181.50],
    polygon: [
      [-18.60, -181.55],
      [-18.62, -181.40],
      [-18.95, -181.42],
      [-18.90, -181.60]
    ],
    warningText: 'Continuous 100km reef barrier with rapid tidal current rips.'
  },
  {
    id: 'hz-metis-shoal',
    name: 'Late’iki (Metis Shoal Submerged Seamount)',
    type: 'submerged-volcano',
    severity: 'moderate',
    center: [-19.18, -174.87],
    polygon: [
      [-19.12, -174.92],
      [-19.12, -174.82],
      [-19.24, -174.83],
      [-19.24, -174.93]
    ],
    warningText: 'Active hydro-thermal venting. Depth variation 4m to 80m.'
  }
];

export const BATHYMETRY_CONTOURS: BathymetryContour[] = [
  {
    depthM: 50,
    label: '50m Continental Shelf',
    color: 'rgba(0, 245, 212, 0.25)',
    lines: [
      [
        [-17.42, -149.70],
        [-17.50, -149.20],
        [-17.75, -149.08],
        [-17.95, -149.20],
        [-17.88, -149.70],
        [-17.55, -149.72]
      ],
      [
        [-21.15, -159.72],
        [-21.25, -159.68],
        [-21.32, -159.76],
        [-21.28, -159.88],
        [-21.18, -159.85]
      ]
    ]
  },
  {
    depthM: 200,
    label: '200m Archipelago Margin',
    color: 'rgba(0, 187, 249, 0.18)',
    lines: [
      [
        [-17.30, -150.00],
        [-17.40, -149.00],
        [-18.10, -149.00],
        [-18.10, -150.00],
        [-17.30, -150.00]
      ],
      [
        [-18.40, -174.20],
        [-18.40, -173.80],
        [-18.90, -173.70],
        [-18.90, -174.20],
        [-18.40, -174.20]
      ]
    ]
  },
  {
    depthM: 1000,
    label: '1000m Oceanic Abyss & Tonga Trench',
    color: 'rgba(131, 56, 236, 0.15)',
    lines: [
      [
        [-16.00, -155.00],
        [-19.00, -158.00],
        [-23.00, -162.00]
      ],
      [
        [-16.50, -173.20],
        [-19.50, -173.40],
        [-23.00, -173.80]
      ]
    ]
  }
];

/**
 * Evaluates the local South Pacific wind vector at any coordinate (lat, lon).
 * Simulates the Trade Winds (ESE ~118° blowing toward ~298°) with localized divergence,
 * frontal squall acceleration, and island windward compression.
 * Returns: { u: number, v: number, speedKnots: number, directionDeg: number }
 */
export const getWindVectorAt = (lat: number, lon: number, timeOffsetSeconds: number = 0) => {
  // Base trade wind vector
  const baseSpeed = 21.5;
  const baseDirRad = (118 * Math.PI) / 180; // coming from 118°

  // Latitude gradient: trade winds peak between 17°S and 20°S
  const latFactor = Math.cos(((lat + 18.5) * Math.PI) / 16.0);

  // Time perturbation
  const timeWave = Math.sin(timeOffsetSeconds * 0.05 + lon * 2.0);

  // Localized frontal trough near Palmerston (-163° lon)
  const distToTrough = Math.abs(lon - (-163.0));
  const troughEffect = Math.exp(-(distToTrough * distToTrough) / 8.0);
  
  // Acceleration in trench corridor
  const trenchEffect = lon < -171 && lon > -176 ? 3.5 : 0;

  // Local speed calculation
  const speed = baseSpeed * (0.85 + 0.15 * latFactor) + (troughEffect * 4.5) + trenchEffect + (timeWave * 1.8);

  // Slight wind direction veer: 115° to 128°
  const dirRad = baseDirRad + (troughEffect * 0.15) + (timeWave * 0.06);

  // Wind blows towards direction: (dirRad + Math.PI)
  const flowDirRad = dirRad + Math.PI;
  const u = Math.sin(flowDirRad) * speed; // Eastward component
  const v = Math.cos(flowDirRad) * speed; // Northward component

  return {
    u,
    v,
    speedKnots: parseFloat(speed.toFixed(1)),
    directionDeg: Math.round(((dirRad * 180) / Math.PI) % 360)
  };
};
