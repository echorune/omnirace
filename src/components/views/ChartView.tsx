import React, { useState, useCallback } from 'react';
import { NauticalChartCanvas, ChartLayersConfig } from '../chart/NauticalChartCanvas';
import { ChartControls } from '../chart/ChartControls';
import { useRegatta } from '../../state/RegattaContext';

export const ChartView: React.FC = () => {
  const { state } = useRegatta();

  const [layers, setLayers] = useState<ChartLayersConfig>({
    windStreamlines: true,
    bathymetry: true,
    coralHazards: true,
    waypointsAndRoute: true,
    vesselTracks: true,
    graticuleGrid: true
  });

  const [isRulerActive, setIsRulerActive] = useState(false);
  const [rulerMeasurement, setRulerMeasurement] = useState<{
    distanceNM: number;
    bearingDeg: number;
    etaHours: number;
  } | null>(null);

  const handleToggleLayer = useCallback((layerKey: keyof ChartLayersConfig) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  }, []);

  const handleToggleRuler = useCallback(() => {
    setIsRulerActive(prev => !prev);
  }, []);

  const handleClearRuler = useCallback(() => {
    setRulerMeasurement(null);
  }, []);

  const handleJumpToWaypoint = (wp: { lat: number; lon: number }) => {
    window.dispatchEvent(
      new CustomEvent('omnirace-recenter-chart', {
        detail: {
          vessel: {
            lat: wp.lat,
            lon: wp.lon
          }
        }
      })
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-tropic-abyss">
      {/* Main Interactive Canvas */}
      <div className="relative flex-1 w-full h-full">
        <NauticalChartCanvas
          layers={layers}
          isRulerActive={isRulerActive}
          onRulerMeasurementChange={setRulerMeasurement}
          onResetRuler={handleClearRuler}
        />

        {/* Floating Tool Controls Overlay */}
        <ChartControls
          layers={layers}
          onToggleLayer={handleToggleLayer}
          isRulerActive={isRulerActive}
          onToggleRuler={handleToggleRuler}
          rulerMeasurement={rulerMeasurement}
          onClearRuler={handleClearRuler}
        />

        {/* Floating Compass Rose Widget */}
        <div className="absolute bottom-12 right-4 z-20 pointer-events-none hidden sm:flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full border border-tropic-cyan/30 bg-tropic-deep/80 backdrop-blur-md flex items-center justify-center shadow-2xl">
            {/* North Indicator */}
            <div className="absolute top-1 text-[9px] font-mono font-bold text-tropic-coral">
              N
            </div>
            <div className="absolute bottom-1 text-[9px] font-mono font-bold text-slate-400">
              S
            </div>
            <div className="absolute right-1.5 text-[9px] font-mono font-bold text-slate-400">
              E
            </div>
            <div className="absolute left-1.5 text-[9px] font-mono font-bold text-slate-400">
              W
            </div>

            {/* Rotating Wind Arrow */}
            <div
              className="w-12 h-12 flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotate(${state.environment.windDirection}deg)` }}
            >
              <div className="w-1.5 h-8 bg-gradient-to-t from-tropic-cyan to-transparent rounded-full" />
              <div className="absolute top-1 w-2.5 h-2.5 border-t-2 border-r-2 border-tropic-cyan transform -rotate-45" />
            </div>

            <div className="absolute w-2 h-2 rounded-full bg-tropic-cyan" />
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase">
            Wind: {state.environment.windDirection}°
          </span>
        </div>

        {/* Quick Waypoint Rounding Strip (Collapsible Horizontal Dock) */}
        <div className="absolute bottom-3 right-28 z-20 hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-tropic-deep/80 border border-slate-800/80 backdrop-blur-md text-xs font-mono">
          <span className="px-2 text-[10px] uppercase text-slate-400 font-bold">
            Gates:
          </span>
          {state.waypoints.map((wp, idx) => (
            <button
              key={wp.id}
              onClick={() => handleJumpToWaypoint(wp)}
              className="px-2 py-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-tropic-cyan transition-colors text-[11px] truncate max-w-[130px]"
              title={`Jump to ${wp.name}`}
            >
              {idx + 1}. {wp.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
