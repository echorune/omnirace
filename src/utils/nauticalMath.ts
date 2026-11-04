/**
 * High-precision nautical mathematics and coordinate conversion utilities.
 */

// Convert degrees to radians
export const toRad = (deg: number): number => (deg * Math.PI) / 180;

// Convert radians to degrees
export const toDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Calculates Great Circle distance between two points in Nautical Miles (NM).
 * 1 Nautical Mile = 1852 meters. Earth radius ~ 6371 km = 3440.065 NM.
 */
export const calculateDistanceNM = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3440.065; // Earth radius in NM
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates initial true bearing (° True, 0-359) from point 1 to point 2.
 */
export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lon2 - lon1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  return (toDeg(θ) + 360) % 360;
};

/**
 * Formats decimal latitude into professional nautical degrees & minutes.
 * e.g. -17.525 -> "17°31.5'S"
 */
export const formatLatitude = (lat: number): string => {
  const hemisphere = lat >= 0 ? 'N' : 'S';
  const absLat = Math.abs(lat);
  const degrees = Math.floor(absLat);
  const minutes = ((absLat - degrees) * 60).toFixed(1);
  return `${degrees}°${minutes.padStart(4, '0')}'${hemisphere}`;
};

/**
 * Formats decimal longitude into professional nautical degrees & minutes.
 * Handles negative west and positive east (or wrapping).
 * e.g. -149.610 -> "149°36.6'W"
 */
export const formatLongitude = (lon: number): string => {
  let normalizedLon = lon;
  while (normalizedLon < -180) normalizedLon += 360;
  while (normalizedLon > 180) normalizedLon -= 360;

  const hemisphere = normalizedLon >= 0 ? 'E' : 'W';
  const absLon = Math.abs(normalizedLon);
  const degrees = Math.floor(absLon);
  const minutes = ((absLon - degrees) * 60).toFixed(1);
  return `${degrees}°${minutes.padStart(4, '0')}'${hemisphere}`;
};

/**
 * Normalizes longitude to a continuous range centered on the South Pacific race zone.
 * In this race, longitude goes from -148° (Tahiti) westward past -180° to Fiji (+178° or -182°).
 */
export const normalizePacificLon = (lon: number): number => {
  if (lon > 0) {
    return lon - 360; // e.g. +178.4 -> -181.6
  }
  return lon;
};

/**
 * Formats hours into human-readable duration (e.g. 14.5 -> "14h 30m").
 */
export const formatDurationHours = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};
