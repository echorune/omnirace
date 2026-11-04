export type ViewType = 'chart' | 'fleet' | 'cockpit' | 'weather' | 'replay' | 'systems';

export type VesselClass = 'IMOCA 60' | 'Ultim 32/23' | 'Class40';

export type VesselStatus = 'racing' | 'foiling' | 'tactical-jibe' | 'warning' | 'standby';

export interface BreadcrumbPoint {
  lat: number;
  lon: number;
  timestamp: number;
  sog: number;
}

export interface Vessel {
  id: string;
  name: string;
  skipper: string;
  coSkipper?: string;
  nationality: string;
  countryCode: string;
  sailNumber: string;
  boatClass: VesselClass;
  team: string;
  accentColor: string;
  lat: number;
  lon: number;
  heading: number; // 0 - 359
  sog: number; // Speed Over Ground in knots
  cog: number; // Course Over Ground in degrees
  vmg: number; // Velocity Made Good in knots
  tws: number; // True Wind Speed in knots
  twa: number; // True Wind Angle (-180 to 180)
  aws: number; // Apparent Wind Speed in knots
  awa: number; // Apparent Wind Angle (-180 to 180)
  heel: number; // Heel Angle in degrees (-45 to 45)
  pitch: number; // Pitch Angle in degrees
  foilPort: number; // 0 - 100%
  foilStbd: number; // 0 - 100%
  foilRake: number; // degrees -2 to +6
  sailPlan: string;
  dtf: number; // Distance To Finish in Nautical Miles
  dtl: number; // Distance To Leader in Nautical Miles
  rank: number;
  status: VesselStatus;
  batterySoC: number; // Battery state of charge (0 - 100%)
  waterLiters: number; // Potable water remaining
  watermakerOutput: number; // L/h
  hydroGenWatts: number; // Current generation watts
  solarWatts: number;
  skipperHeartRate: number; // BPM
  skipperSleepHours: number; // Last 24h
  trackHistory: BreadcrumbPoint[];
}

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'start' | 'gate' | 'hazard' | 'finish';
  radiusNM: number;
  notes: string;
}

export interface EnvironmentalConditions {
  windSpeed: number; // knots
  windDirection: number; // degrees
  airTemp: number; // °C
  seaTemp: number; // °C
  barometricPressure: number; // hPa
  pressureTrend: 'rising' | 'falling' | 'steady';
  swellHeight: number; // meters
  swellPeriod: number; // seconds
  swellDirection: number; // degrees
  seaState: string;
  visibilityNM: number;
}

export interface RaceEvent {
  id: string;
  timestamp: number;
  type: 'info' | 'tactical' | 'warning' | 'record';
  message: string;
  vesselName?: string;
  vesselId?: string;
}

export interface RegattaState {
  raceId: string;
  raceName: string;
  subTitle: string;
  startTime: number;
  elapsedSeconds: number;
  totalDistanceNM: number;
  currentStage: string;
  simulationSpeed: number;
  isPlaying: boolean;
  activeView: ViewType;
  selectedVesselId: string;
  soundEnabled: boolean;
  soundVolume: number;
  isSatelliteOnline: boolean;
  starlinkLatency: number;
  starlinkUplink: number;
  environment: EnvironmentalConditions;
  vessels: Vessel[];
  waypoints: Waypoint[];
  recentEvents: RaceEvent[];
}
