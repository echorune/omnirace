import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRegatta } from '../../state/RegattaContext';
import { PACIFIC_ISLANDS, CORAL_HAZARDS, BATHYMETRY_CONTOURS, getWindVectorAt } from '../../data/nauticalGeography';
import {
  calculateDistanceNM,
  calculateBearing,
  formatLatitude,
  formatLongitude,
  normalizePacificLon,
  formatDurationHours
} from '../../utils/nauticalMath';
import { Vessel, Waypoint } from '../../types';

export interface ChartLayersConfig {
  windStreamlines: boolean;
  bathymetry: boolean;
  coralHazards: boolean;
  waypointsAndRoute: boolean;
  vesselTracks: boolean;
  graticuleGrid: boolean;
}

interface RulerPoint {
  lat: number;
  lon: number;
}

interface NauticalChartCanvasProps {
  layers: ChartLayersConfig;
  isRulerActive: boolean;
  onRulerMeasurementChange?: (measurement: { distanceNM: number; bearingDeg: number; etaHours: number } | null) => void;
  onResetRuler?: () => void;
}

interface WindParticle {
  lat: number;
  lon: number;
  age: number;
  maxAge: number;
  speed: number;
}

export const NauticalChartCanvas: React.FC<NauticalChartCanvasProps> = ({
  layers,
  isRulerActive,
  onRulerMeasurementChange,
  onResetRuler
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { state, selectedVessel, selectVessel } = useRegatta();

  // Viewport navigation state (Center coordinate & Zoom scale)
  // Default centered roughly on the Cook Islands / Tonga passage
  const [viewport, setViewport] = useState({
    centerLat: -18.8,
    centerLon: -164.5,
    zoom: 46 // pixels per degree
  });

  const [mouseCoord, setMouseCoord] = useState<{ lat: number; lon: number } | null>(null);
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);
  const [hoveredWaypoint, setHoveredWaypoint] = useState<Waypoint | null>(null);

  // Ruler points
  const [rulerStart, setRulerStart] = useState<RulerPoint | null>(null);
  const [rulerEnd, setRulerEnd] = useState<RulerPoint | null>(null);

  // Dragging state for pan
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Wind streamline particles
  const particlesRef = useRef<WindParticle[]>([]);
  const PARTICLE_COUNT = 550;

  // Initialize wind particles across the race zone
  useEffect(() => {
    const particles: WindParticle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        lat: -15.5 - Math.random() * 8.0,
        lon: -148.0 - Math.random() * 35.0,
        age: Math.floor(Math.random() * 80),
        maxAge: 70 + Math.floor(Math.random() * 50),
        speed: 20
      });
    }
    particlesRef.current = particles;
  }, []);

  // Coordinate transforms
  const coordToScreen = useCallback(
    (lat: number, lon: number, width: number, height: number) => {
      const normLon = normalizePacificLon(lon);
      const x = width / 2 + (normLon - viewport.centerLon) * viewport.zoom;
      const y = height / 2 - (lat - viewport.centerLat) * viewport.zoom;
      return { x, y };
    },
    [viewport]
  );

  const screenToCoord = useCallback(
    (x: number, y: number, width: number, height: number) => {
      const lon = viewport.centerLon + (x - width / 2) / viewport.zoom;
      const lat = viewport.centerLat - (y - height / 2) / viewport.zoom;
      return { lat, lon };
    },
    [viewport]
  );

  // Recenter on active vessel if requested externally
  const focusOnVessel = useCallback((vessel: Vessel) => {
    setViewport(prev => ({
      ...prev,
      centerLat: vessel.lat,
      centerLon: normalizePacificLon(vessel.lon),
      zoom: Math.max(prev.zoom, 55)
    }));
  }, []);

  // Reset to full regatta course
  const fitRegattaCourse = useCallback(() => {
    setViewport({
      centerLat: -18.8,
      centerLon: -164.5,
      zoom: 46
    });
  }, []);

  // Expose focus handler to window for controls
  useEffect(() => {
    const handleRecenter = (e: CustomEvent) => {
      if (e.detail?.vessel) {
        focusOnVessel(e.detail.vessel);
      } else if (e.detail?.fitCourse) {
        fitRegattaCourse();
      }
    };
    window.addEventListener('omnirace-recenter-chart' as unknown as keyof WindowEventMap, handleRecenter as EventListener);
    return () => {
      window.removeEventListener('omnirace-recenter-chart' as unknown as keyof WindowEventMap, handleRecenter as EventListener);
    };
  }, [focusOnVessel, fitRegattaCourse]);

  // Handle ruler measurement calculation
  useEffect(() => {
    if (rulerStart && rulerEnd) {
      const dist = calculateDistanceNM(rulerStart.lat, rulerStart.lon, rulerEnd.lat, rulerEnd.lon);
      const bearing = calculateBearing(rulerStart.lat, rulerStart.lon, rulerEnd.lat, rulerEnd.lon);
      const effectiveSog = Math.max(12, selectedVessel.sog);
      const eta = dist / effectiveSog;
      if (onRulerMeasurementChange) {
        onRulerMeasurementChange({
          distanceNM: parseFloat(dist.toFixed(1)),
          bearingDeg: Math.round(bearing),
          etaHours: parseFloat(eta.toFixed(2))
        });
      }
    } else {
      if (onRulerMeasurementChange) {
        onRulerMeasurementChange(null);
      }
    }
  }, [rulerStart, rulerEnd, selectedVessel.sog, onRulerMeasurementChange]);

  // Reset ruler when deactivated
  useEffect(() => {
    if (!isRulerActive) {
      setRulerStart(null);
      setRulerEnd(null);
    }
  }, [isRulerActive]);

  // Clear ruler trigger
  useEffect(() => {
    if (onResetRuler) {
      // hook can call this
    }
  }, [onResetRuler]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return; // Only left click

    if (isRulerActive) {
      const rect = e.currentTarget.getBoundingClientRect();
      const coord = screenToCoord(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
      if (!rulerStart) {
        setRulerStart(coord);
        setRulerEnd(coord);
      } else if (!rulerEnd || (rulerStart && rulerEnd)) {
        setRulerEnd(coord);
      }
      return;
    }

    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const currentCoord = screenToCoord(x, y, rect.width, rect.height);
    setMouseCoord(currentCoord);

    // Update ruler end point preview while placing
    if (isRulerActive && rulerStart && !rulerEnd) {
      // preview
    } else if (isRulerActive && rulerStart && e.buttons === 1) {
      setRulerEnd(currentCoord);
    }

    // Handle Pan
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      setViewport(prev => ({
        ...prev,
        centerLon: prev.centerLon - dx / prev.zoom,
        centerLat: prev.centerLat + dy / prev.zoom
      }));
      return;
    }

    // Hover detection for vessels and waypoints
    const width = rect.width;
    const height = rect.height;

    let foundVessel: Vessel | null = null;
    for (const vessel of state.vessels) {
      const screenPos = coordToScreen(vessel.lat, vessel.lon, width, height);
      const dist = Math.hypot(x - screenPos.x, y - screenPos.y);
      if (dist < 22) {
        foundVessel = vessel;
        break;
      }
    }
    setHoveredVessel(foundVessel);

    let foundWp: Waypoint | null = null;
    if (!foundVessel) {
      for (const wp of state.waypoints) {
        const screenPos = coordToScreen(wp.lat, wp.lon, width, height);
        const dist = Math.hypot(x - screenPos.x, y - screenPos.y);
        if (dist < 18) {
          foundWp = wp;
          break;
        }
      }
    }
    setHoveredWaypoint(foundWp);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mouseCoordBefore = screenToCoord(mouseX, mouseY, rect.width, rect.height);

    setViewport(prev => {
      const newZoom = Math.max(18, Math.min(220, prev.zoom * zoomFactor));
      // Keep coordinate under mouse stable
      const newCenterLon = mouseCoordBefore.lon - (mouseX - rect.width / 2) / newZoom;
      const newCenterLat = mouseCoordBefore.lat + (mouseY - rect.height / 2) / newZoom;

      return {
        zoom: newZoom,
        centerLon: newCenterLon,
        centerLat: newCenterLat
      };
    });
  };

  const handleClick = () => {
    if (isRulerActive) return;

    if (hoveredVessel) {
      selectVessel(hoveredVessel.id);
    }
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas with Abyss Navy Gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#04111c');
      bgGrad.addColorStop(0.65, '#030b12');
      bgGrad.addColorStop(1, '#02070c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ───────────────────────────────────────────────────────────
      // Layer: Graticule Nautical Grid & Coordinate Lines
      // ───────────────────────────────────────────────────────────
      if (layers.graticuleGrid) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 245, 212, 0.07)';
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(0, 245, 212, 0.45)';
        ctx.font = '10px "JetBrains Mono", monospace';

        // Draw parallels (latitude lines every 2 degrees)
        for (let lat = -26; lat <= -12; lat += 2) {
          const p1 = coordToScreen(lat, -186, width, height);
          const p2 = coordToScreen(lat, -145, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Margin text
          if (p1.y > 20 && p1.y < height - 20) {
            ctx.fillText(formatLatitude(lat), 12, p1.y - 4);
            ctx.fillText(formatLatitude(lat), width - 64, p1.y - 4);
          }
        }

        // Draw meridians (longitude lines every 4 degrees)
        for (let lon = -186; lon <= -144; lon += 4) {
          const p1 = coordToScreen(-12, lon, width, height);
          const p2 = coordToScreen(-26, lon, width, height);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // Margin text
          if (p1.x > 20 && p1.x < width - 20) {
            ctx.fillText(formatLongitude(lon), p1.x + 4, height - 12);
            ctx.fillText(formatLongitude(lon), p1.x + 4, 20);
          }
        }
        ctx.restore();
      }

      // ───────────────────────────────────────────────────────────
      // Layer: Bathymetry Depth Isolines
      // ───────────────────────────────────────────────────────────
      if (layers.bathymetry) {
        ctx.save();
        BATHYMETRY_CONTOURS.forEach(contour => {
          ctx.strokeStyle = contour.color;
          ctx.lineWidth = contour.depthM === 50 ? 1.5 : 1;
          ctx.setLineDash(contour.depthM === 1000 ? [4, 4] : []);

          contour.lines.forEach(line => {
            if (line.length < 2) return;
            ctx.beginPath();
            const start = coordToScreen(line[0][0], line[0][1], width, height);
            ctx.moveTo(start.x, start.y);
            for (let i = 1; i < line.length; i++) {
              const p = coordToScreen(line[i][0], line[i][1], width, height);
              ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
          });
        });
        ctx.restore();
      }

      // ───────────────────────────────────────────────────────────
      // Layer: Coral Reef Hazard Zones
      // ───────────────────────────────────────────────────────────
      if (layers.coralHazards) {
        ctx.save();
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);

        CORAL_HAZARDS.forEach(hazard => {
          if (hazard.polygon.length < 3) return;

          ctx.beginPath();
          const start = coordToScreen(hazard.polygon[0][0], hazard.polygon[0][1], width, height);
          ctx.moveTo(start.x, start.y);
          for (let i = 1; i < hazard.polygon.length; i++) {
            const p = coordToScreen(hazard.polygon[i][0], hazard.polygon[i][1], width, height);
            ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();

          // Hazard zone fill & pulsating border
          ctx.fillStyle = `rgba(255, 94, 126, ${0.08 + pulse * 0.05})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(255, 94, 126, ${0.45 + pulse * 0.35})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Hazard label & warning icon
          const center = coordToScreen(hazard.center[0], hazard.center[1], width, height);
          if (viewport.zoom > 32) {
            ctx.fillStyle = '#FF5E7E';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`⚠️ ${hazard.name}`, center.x, center.y - 8);
          }
        });
        ctx.restore();
      }

      // ───────────────────────────────────────────────────────────
      // Layer: Pacific Islands Coastlines & Topography
      // ───────────────────────────────────────────────────────────
      ctx.save();
      PACIFIC_ISLANDS.forEach(island => {
        if (island.polygon.length < 3) return;

        ctx.beginPath();
        const start = coordToScreen(island.polygon[0][0], island.polygon[0][1], width, height);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < island.polygon.length; i++) {
          const p = coordToScreen(island.polygon[i][0], island.polygon[i][1], width, height);
          ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();

        // Lush volcanic tropical island shading
        ctx.fillStyle = '#0a2333';
        ctx.fill();
        ctx.strokeStyle = '#00F5D4';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Island label
        const center = coordToScreen(island.center[0], island.center[1], width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(island.name, center.x, center.y);

        if (viewport.zoom > 40 && island.elevationM > 100) {
          ctx.fillStyle = '#10B981';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`▲ ${island.elevationM}m`, center.x, center.y + 12);
        }
      });
      ctx.restore();

      // ───────────────────────────────────────────────────────────
      // Layer: Dynamic Vector Wind Streamfield
      // ───────────────────────────────────────────────────────────
      if (layers.windStreamlines) {
        ctx.save();
        const particles = particlesRef.current;
        const nowSec = Date.now() / 1000;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const wind = getWindVectorAt(p.lat, p.lon, nowSec);

          // Previous screen position
          const prevScreen = coordToScreen(p.lat, p.lon, width, height);

          // Advance particle position
          const dt = 0.0035;
          // u is eastward (lon), v is northward (lat)
          p.lon += (wind.u * dt) / Math.cos((p.lat * Math.PI) / 180);
          p.lat += wind.v * dt;
          p.age += 1;
          p.speed = wind.speedKnots;

          // Next screen position
          const nextScreen = coordToScreen(p.lat, p.lon, width, height);

          // Color calculation based on wind velocity
          let strokeColor = 'rgba(0, 245, 212, 0.4)'; // Light breeze
          if (wind.speedKnots > 26) {
            strokeColor = 'rgba(255, 94, 126, 0.7)'; // Squall coral
          } else if (wind.speedKnots > 22) {
            strokeColor = 'rgba(255, 209, 102, 0.65)'; // Sand amber
          } else if (wind.speedKnots > 18) {
            strokeColor = 'rgba(0, 187, 249, 0.55)'; // Aqua
          }

          // Fade in and out with age
          const lifeAlpha = Math.sin((p.age / p.maxAge) * Math.PI);

          ctx.strokeStyle = strokeColor;
          ctx.globalAlpha = lifeAlpha * 0.7;
          ctx.lineWidth = 1.2;

          ctx.beginPath();
          ctx.moveTo(prevScreen.x, prevScreen.y);
          ctx.lineTo(nextScreen.x, nextScreen.y);
          ctx.stroke();

          // Respawn expired or out of bounds particles
          if (
            p.age >= p.maxAge ||
            p.lat > -14.0 ||
            p.lat < -24.0 ||
            p.lon < -185.0 ||
            p.lon > -146.0
          ) {
            p.lat = -15.0 - Math.random() * 8.0;
            p.lon = -147.0 - Math.random() * 36.0;
            p.age = 0;
            p.maxAge = 60 + Math.floor(Math.random() * 50);
          }
        }
        ctx.restore();
      }

      // ───────────────────────────────────────────────────────────
      // Layer: Race Route, Waypoints & Laylines
      // ───────────────────────────────────────────────────────────
      if (layers.waypointsAndRoute) {
        ctx.save();

        // Draw dotted Rhumb line connecting course waypoints
        ctx.beginPath();
        const firstWp = state.waypoints[0];
        const firstPos = coordToScreen(firstWp.lat, firstWp.lon, width, height);
        ctx.moveTo(firstPos.x, firstPos.y);

        for (let i = 1; i < state.waypoints.length; i++) {
          const wpPos = coordToScreen(state.waypoints[i].lat, state.waypoints[i].lon, width, height);
          ctx.lineTo(wpPos.x, wpPos.y);
        }

        ctx.strokeStyle = 'rgba(0, 245, 212, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw each waypoint marker
        state.waypoints.forEach((wp, index) => {
          const pos = coordToScreen(wp.lat, wp.lon, width, height);

          // Pulse ring for finish and active gates
          const pulseRing = 12 + 6 * Math.sin(Date.now() * 0.004 + index);

          ctx.strokeStyle = wp.type === 'finish' ? '#FFD166' : wp.type === 'hazard' ? '#FF5E7E' : '#00F5D4';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, pulseRing, 0, Math.PI * 2);
          ctx.stroke();

          // Waypoint center symbol
          ctx.fillStyle = wp.type === 'finish' ? '#FFD166' : wp.type === 'hazard' ? '#FF5E7E' : '#00F5D4';
          ctx.beginPath();
          if (wp.type === 'gate') {
            // Diamond gate
            ctx.moveTo(pos.x, pos.y - 7);
            ctx.lineTo(pos.x + 7, pos.y);
            ctx.lineTo(pos.x, pos.y + 7);
            ctx.lineTo(pos.x - 7, pos.y);
            ctx.closePath();
          } else {
            ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
          }
          ctx.fill();

          // Waypoint text tag
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'left';
          ctx.fillText(`WP${index + 1}: ${wp.name}`, pos.x + 16, pos.y + 3);
        });

        ctx.restore();
      }

      // ───────────────────────────────────────────────────────────
      // Layer: Fleet Vessels, Wakes & Heading Vectors
      // ───────────────────────────────────────────────────────────
      ctx.save();
      state.vessels.forEach(vessel => {
        const isSelected = vessel.id === selectedVessel.id;
        const pos = coordToScreen(vessel.lat, vessel.lon, width, height);

        // Vessel historical breadcrumb trail
        if (layers.vesselTracks && vessel.trackHistory && vessel.trackHistory.length > 1) {
          ctx.save();
          ctx.beginPath();
          const firstTrack = coordToScreen(vessel.trackHistory[0].lat, vessel.trackHistory[0].lon, width, height);
          ctx.moveTo(firstTrack.x, firstTrack.y);
          for (let i = 1; i < vessel.trackHistory.length; i++) {
            const trackPos = coordToScreen(vessel.trackHistory[i].lat, vessel.trackHistory[i].lon, width, height);
            ctx.lineTo(trackPos.x, trackPos.y);
          }
          // Connect to current vessel pos
          ctx.lineTo(pos.x, pos.y);

          ctx.strokeStyle = vessel.accentColor;
          ctx.globalAlpha = isSelected ? 0.7 : 0.35;
          ctx.lineWidth = isSelected ? 2.2 : 1.2;
          ctx.stroke();
          ctx.restore();
        }

        // Foiling Spray Wake behind vessel
        const headingRad = (vessel.heading * Math.PI) / 180;
        const wakeLength = Math.max(14, (vessel.sog / 35) * 45);
        const wakeBehindX = pos.x - Math.sin(headingRad) * wakeLength;
        const wakeBehindY = pos.y + Math.cos(headingRad) * wakeLength;

        // Draw foam wake triangle
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        const perpX = Math.cos(headingRad) * 6;
        const perpY = Math.sin(headingRad) * 6;
        ctx.lineTo(wakeBehindX + perpX, wakeBehindY + perpY);
        ctx.lineTo(wakeBehindX - perpX, wakeBehindY - perpY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 245, 212, 0.12)';
        ctx.fill();

        // Selected vessel active radar ring
        if (isSelected) {
          const radarRadius = 24 + 4 * Math.sin(Date.now() * 0.005);
          ctx.strokeStyle = '#00F5D4';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radarRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Heading projected vector line (30 minutes projection)
          const projDistNM = (vessel.sog * 0.5); // distance in 30 min
          const nmPerDegree = 60.0;
          const projLat = vessel.lat + (projDistNM * Math.cos(headingRad)) / nmPerDegree;
          const projLon = vessel.lon + (projDistNM * Math.sin(headingRad)) / (nmPerDegree * Math.cos((vessel.lat * Math.PI) / 180));
          const projScreen = coordToScreen(projLat, projLon, width, height);

          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(projScreen.x, projScreen.y);
          ctx.strokeStyle = 'rgba(0, 245, 212, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw Foiling Yacht Hull Geometry rotated to heading
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(headingRad);

        // Vessel Hull
        ctx.fillStyle = vessel.accentColor;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(0, -11); // Bow
        ctx.lineTo(4.5, 9); // Stbd stern
        ctx.lineTo(-4.5, 9); // Port stern
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Trimaran outriggers if Ultim
        if (vessel.boatClass === 'Ultim 32/23') {
          ctx.lineWidth = 1;
          // Crossbeams
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(10, 0);
          ctx.stroke();
          // Port Float
          ctx.fillRect(-11, -6, 2, 12);
          // Starboard Float
          ctx.fillRect(9, -6, 2, 12);
        }

        // Foils extension indicators
        if (vessel.foilPort > 0) {
          ctx.strokeStyle = '#00F5D4';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-4, 0);
          ctx.lineTo(-10, 4);
          ctx.stroke();
        }
        if (vessel.foilStbd > 0) {
          ctx.strokeStyle = '#00F5D4';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(4, 0);
          ctx.lineTo(10, 4);
          ctx.stroke();
        }

        ctx.restore();

        // Vessel Information Tag (Name, SOG, Rank)
        ctx.save();
        ctx.font = isSelected ? 'bold 11px "JetBrains Mono", monospace' : '10px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 4;

        const tagText = `${vessel.name} [${vessel.sog} kt]`;
        ctx.fillText(tagText, pos.x + 14, pos.y + 4);

        if (isSelected) {
          ctx.fillStyle = '#00F5D4';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`RANK #${vessel.rank} • DTF: ${vessel.dtf} NM`, pos.x + 14, pos.y + 16);
        }
        ctx.restore();
      });
      ctx.restore();

      // ───────────────────────────────────────────────────────────
      // Layer: Interactive Nautical Ruler
      // ───────────────────────────────────────────────────────────
      if (isRulerActive && rulerStart) {
        ctx.save();
        const endCoord = rulerEnd || mouseCoord || rulerStart;
        const startPos = coordToScreen(rulerStart.lat, rulerStart.lon, width, height);
        const endPos = coordToScreen(endCoord.lat, endCoord.lon, width, height);

        // Vector line
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Pin markers
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, 5, 0, Math.PI * 2);
        ctx.arc(endPos.x, endPos.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Midpoint measurement badge
        const midX = (startPos.x + endPos.x) / 2;
        const midY = (startPos.y + endPos.y) / 2;
        const dist = calculateDistanceNM(rulerStart.lat, rulerStart.lon, endCoord.lat, endCoord.lon);
        const bearing = calculateBearing(rulerStart.lat, rulerStart.lon, endCoord.lat, endCoord.lon);
        const eta = dist / Math.max(12, selectedVessel.sog);

        const badgeText = `${dist.toFixed(1)} NM • ${Math.round(bearing)}°T • ETA ${formatDurationHours(eta)}`;
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        const textWidth = ctx.measureText(badgeText).width;

        // Badge pill background
        ctx.fillStyle = 'rgba(6, 21, 34, 0.9)';
        ctx.strokeStyle = '#FFD166';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(midX - textWidth / 2 - 8, midY - 18, textWidth + 16, 24, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFD166';
        ctx.textAlign = 'center';
        ctx.fillText(badgeText, midX, midY - 2);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    layers,
    viewport,
    state.vessels,
    state.waypoints,
    selectedVessel,
    rulerStart,
    rulerEnd,
    mouseCoord,
    isRulerActive,
    coordToScreen
  ]);

  // Resize canvas to fill container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-tropic-abyss">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className={`w-full h-full block ${isRulerActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* Floating Hover Tooltip for Vessel */}
      {hoveredVessel && !isRulerActive && (
        <div
          className="absolute pointer-events-none z-30 p-3 rounded-xl bg-tropic-deep/95 border border-tropic-cyan/40 shadow-glow-cyan text-xs font-mono animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: mouseCoord ? coordToScreen(hoveredVessel.lat, hoveredVessel.lon, canvasRef.current?.width || 0, canvasRef.current?.height || 0).x + 16 : 0,
            top: mouseCoord ? coordToScreen(hoveredVessel.lat, hoveredVessel.lon, canvasRef.current?.width || 0, canvasRef.current?.height || 0).y - 20 : 0
          }}
        >
          <div className="flex items-center gap-2 font-bold text-white">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: hoveredVessel.accentColor }}
            />
            <span>{hoveredVessel.name}</span>
            <span className="text-tropic-cyan">#{hoveredVessel.rank}</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Skipper: {hoveredVessel.skipper} ({hoveredVessel.countryCode})
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px]">
            <div>SOG: <span className="font-bold text-tropic-cyan">{hoveredVessel.sog} kt</span></div>
            <div>VMG: <span className="font-bold text-tropic-aqua">{hoveredVessel.vmg} kt</span></div>
            <div>TWA: <span className="font-bold text-slate-200">{Math.abs(hoveredVessel.twa)}°</span></div>
            <div>DTF: <span className="font-bold text-tropic-sand">{hoveredVessel.dtf} NM</span></div>
          </div>
          <div className="text-[9px] text-tropic-cyan mt-1.5 opacity-80">
            Click to lock telemetry focus
          </div>
        </div>
      )}

      {/* Floating Hover Tooltip for Waypoint */}
      {hoveredWaypoint && !isRulerActive && (
        <div
          className="absolute pointer-events-none z-30 p-2.5 rounded-xl bg-tropic-deep/95 border border-tropic-sand/40 shadow-glow-sand text-xs font-mono"
          style={{
            left: mouseCoord ? coordToScreen(hoveredWaypoint.lat, hoveredWaypoint.lon, canvasRef.current?.width || 0, canvasRef.current?.height || 0).x + 16 : 0,
            top: mouseCoord ? coordToScreen(hoveredWaypoint.lat, hoveredWaypoint.lon, canvasRef.current?.width || 0, canvasRef.current?.height || 0).y - 20 : 0
          }}
        >
          <div className="font-bold text-tropic-sand">{hoveredWaypoint.name}</div>
          <div className="text-[10px] text-slate-300 mt-0.5">{hoveredWaypoint.notes}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Lat: {formatLatitude(hoveredWaypoint.lat)} • Lon: {formatLongitude(hoveredWaypoint.lon)}
          </div>
        </div>
      )}

      {/* Live Cursor Coordinate HUD & Scale */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-tropic-deep/85 border border-slate-800/80 backdrop-blur-md text-[11px] font-mono text-slate-300 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">POS:</span>
          {mouseCoord ? (
            <span className="text-tropic-cyan font-semibold">
              {formatLatitude(mouseCoord.lat)} , {formatLongitude(mouseCoord.lon)}
            </span>
          ) : (
            <span className="text-slate-400">---</span>
          )}
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <div className="flex items-center gap-1">
          <span className="text-slate-500">ZOOM:</span>
          <span className="text-slate-200">{Math.round(viewport.zoom)} px/°</span>
        </div>
      </div>
    </div>
  );
};
