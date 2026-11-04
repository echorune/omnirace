import React, { useState } from 'react';
import { useRegatta } from '../../state/RegattaContext';
import { ChartLayersConfig } from './NauticalChartCanvas';
import {
  Wind,
  Layers,
  Crosshair,
  Maximize2,
  Ruler,
  AlertTriangle,
  Waves,
  MapPin,
  TrendingUp,
  Grid
} from 'lucide-react';

interface ChartControlsProps {
  layers: ChartLayersConfig;
  onToggleLayer: (layerKey: keyof ChartLayersConfig) => void;
  isRulerActive: boolean;
  onToggleRuler: () => void;
  rulerMeasurement: { distanceNM: number; bearingDeg: number; etaHours: number } | null;
  onClearRuler: () => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  layers,
  onToggleLayer,
  isRulerActive,
  onToggleRuler,
  rulerMeasurement,
  onClearRuler
}) => {
  const { selectedVessel } = useRegatta();
  const [showLayerDrawer, setShowLayerDrawer] = useState(false);

  const handleCenterVessel = () => {
    window.dispatchEvent(
      new CustomEvent('omnirace-recenter-chart', {
        detail: { vessel: selectedVessel }
      })
    );
  };

  const handleFitCourse = () => {
    window.dispatchEvent(
      new CustomEvent('omnirace-recenter-chart', {
        detail: { fitCourse: true }
      })
    );
  };

  return (
    <>
      {/* Top-Right Floating Controls Dock */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2.5 pointer-events-auto">
        
        {/* Main Floating Tool Strip */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-tropic-deep/90 border border-tropic-cyan/30 shadow-2xl backdrop-blur-md">
          {/* Layer Menu Button */}
          <button
            onClick={() => setShowLayerDrawer(!showLayerDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showLayerDrawer
                ? 'bg-tropic-cyan text-tropic-abyss shadow-glow-cyan'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Marine Layers"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Layers</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          {/* Nautical Ruler Toggle */}
          <button
            onClick={onToggleRuler}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isRulerActive
                ? 'bg-tropic-sand text-tropic-abyss shadow-glow-sand font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Measure Nautical Distance & Bearing"
          >
            <Ruler className="w-4 h-4" />
            <span className="hidden sm:inline">{isRulerActive ? 'Ruler Active' : 'Ruler'}</span>
          </button>

          <div className="h-4 w-px bg-slate-800" />

          {/* Focus Selected Vessel */}
          <button
            onClick={handleCenterVessel}
            className="p-2 rounded-xl text-slate-300 hover:text-tropic-cyan hover:bg-slate-800 transition-colors"
            title="Focus on Selected Vessel"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Fit Course View */}
          <button
            onClick={handleFitCourse}
            className="p-2 rounded-xl text-slate-300 hover:text-tropic-cyan hover:bg-slate-800 transition-colors"
            title="Fit Entire Regatta Course"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Layer Selector Drawer */}
        {showLayerDrawer && (
          <div className="w-64 rounded-2xl bg-tropic-deep/95 border border-tropic-cyan/40 shadow-2xl backdrop-blur-md p-3.5 space-y-2 text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Nautical Layers
              </span>
              <span className="text-[10px] text-tropic-cyan">South Pacific Grid</span>
            </div>

            <div className="space-y-1">
              {/* Wind Streamlines */}
              <button
                onClick={() => onToggleLayer('windStreamlines')}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  layers.windStreamlines
                    ? 'bg-tropic-cyan/15 text-tropic-cyan border border-tropic-cyan/30'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span>Wind Streamlines</span>
                </div>
                <span className="text-[10px] font-bold">{layers.windStreamlines ? 'ON' : 'OFF'}</span>
              </button>

              {/* Coral Hazards */}
              <button
                onClick={() => onToggleLayer('coralHazards')}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  layers.coralHazards
                    ? 'bg-tropic-coral/15 text-tropic-coral border border-tropic-coral/30'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Coral Hazard Zones</span>
                </div>
                <span className="text-[10px] font-bold">{layers.coralHazards ? 'ON' : 'OFF'}</span>
              </button>

              {/* Bathymetry Contours */}
              <button
                onClick={() => onToggleLayer('bathymetry')}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  layers.bathymetry
                    ? 'bg-tropic-aqua/15 text-tropic-aqua border border-tropic-aqua/30'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4" />
                  <span>Bathymetry Contours</span>
                </div>
                <span className="text-[10px] font-bold">{layers.bathymetry ? 'ON' : 'OFF'}</span>
              </button>

              {/* Waypoints & Route */}
              <button
                onClick={() => onToggleLayer('waypointsAndRoute')}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  layers.waypointsAndRoute
                    ? 'bg-tropic-cyan/15 text-tropic-cyan border border-tropic-cyan/30'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Waypoints & Course</span>
                </div>
                <span className="text-[10px] font-bold">{layers.waypointsAndRoute ? 'ON' : 'OFF'}</span>
              </button>

              {/* Vessel Historical Tracks */}
              <button
                onClick={() => onToggleLayer('vesselTracks')}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  layers.vesselTracks
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Vessel Wake Trails</span>
                </div>
                <span className="text-[10px] font-bold">{layers.vesselTracks ? 'ON' : 'OFF'}</span>
              </button>

              {/* Coordinate Graticule Grid */}
              <button
                onClick={() => onToggleLayer('graticuleGrid')}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  layers.graticuleGrid
                    ? 'bg-slate-700/60 text-slate-200 border border-slate-600'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  <span>Nautical Graticule</span>
                </div>
                <span className="text-[10px] font-bold">{layers.graticuleGrid ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Active Ruler Measurement Readout Card */}
        {isRulerActive && (
          <div className="w-72 rounded-2xl bg-tropic-deep/95 border border-tropic-sand/50 shadow-glow-sand p-3.5 backdrop-blur-md animate-in slide-in-from-top-2 duration-150 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-tropic-sand font-bold">
                <Ruler className="w-4 h-4" />
                <span>NAUTICAL RULER</span>
              </div>
              <button
                onClick={onClearRuler}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Reset Pins
              </button>
            </div>

            {rulerMeasurement ? (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">Great Circle Distance:</span>
                  <span className="text-base font-extrabold text-tropic-sand glow-sand">
                    {rulerMeasurement.distanceNM} <span className="text-xs">NM</span>
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">True Initial Bearing:</span>
                  <span className="text-sm font-bold text-white">
                    {rulerMeasurement.bearingDeg}° True
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400">ETA @ {selectedVessel.sog} kt:</span>
                  <span className="text-sm font-bold text-tropic-cyan">
                    {Math.floor(rulerMeasurement.etaHours)}h {Math.round((rulerMeasurement.etaHours % 1) * 60)}m
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-tight">
                  Click on canvas to adjust Point A / Point B.
                </div>
              </div>
            ) : (
              <div className="mt-3 text-slate-300 text-[11px] leading-relaxed">
                Click two points on the nautical chart to measure distance, true bearing, and arrival time.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Wind Velocity Scale Legend */}
      {layers.windStreamlines && (
        <div className="absolute top-4 left-4 z-20 p-2.5 rounded-2xl bg-tropic-deep/85 border border-slate-800/80 backdrop-blur-md pointer-events-auto font-mono text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1.5 uppercase">
            <Wind className="w-3.5 h-3.5 text-tropic-cyan" />
            <span>GFS Wind Velocity Scale</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span className="w-7 h-2 rounded-sm bg-tropic-cyan" />
              <span className="text-[9px] text-slate-400 mt-0.5">12 kt</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-7 h-2 rounded-sm bg-tropic-aqua" />
              <span className="text-[9px] text-slate-400 mt-0.5">18 kt</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-7 h-2 rounded-sm bg-tropic-sand" />
              <span className="text-[9px] text-slate-400 mt-0.5">24 kt</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-7 h-2 rounded-sm bg-tropic-coral" />
              <span className="text-[9px] text-slate-400 mt-0.5">32+ kt</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
