import React from 'react';
import { useRegatta } from '../../state/RegattaContext';
import { ChartView } from './ChartView';
import {
  Navigation,
  Users,
  Gauge,
  CloudRain,
  History,
  Activity,
  Waves,
  MapPin
} from 'lucide-react';

export const ViewContainer: React.FC = () => {
  const { state, selectedVessel, setActiveView } = useRegatta();

  // If active view is the interactive nautical chart, render ChartView
  if (state.activeView === 'chart') {
    return <ChartView />;
  }

  return (
    <div className="flex-1 w-full h-full overflow-y-auto p-4 md:p-6 marine-grid">
      <div className="max-w-[1920px] mx-auto h-full flex flex-col gap-6">
        
        {/* Top Hero Banner & Quick Fleet Telemetry Pulse */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-tropic-deep via-tropic-surface to-tropic-deep border border-tropic-cyan/25 p-5 md:p-6 shadow-2xl">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-tropic-cyan/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-tropic-coral/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-tropic-cyan/20 text-tropic-cyan border border-tropic-cyan/40">
                  SOUTH PACIFIC ARCHIPELAGO CORRIDOR
                </span>
                <span className="text-xs font-mono text-slate-400">
                  STAGE 2 • TAHITI → FIJI
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {state.raceName}
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                High-speed foiling fleet tracking across the Cook Islands & Tonga Trench. Real-time telemetry synchronized via Starlink Maritime array at 60 FPS.
              </p>
            </div>

            {/* Quick Tactical Stats Strip */}
            <div className="flex flex-wrap items-center gap-3 font-mono">
              <div className="px-4 py-2.5 rounded-xl bg-tropic-abyss/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Race Distance</div>
                <div className="text-sm font-bold text-white">1,850 NM</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-tropic-abyss/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Fleet Size</div>
                <div className="text-sm font-bold text-tropic-cyan">8 Foiling Yachts</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-tropic-abyss/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Leader Distance To Finish</div>
                <div className="text-sm font-bold text-tropic-sand">{state.vessels[0]?.dtf} NM</div>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-tropic-abyss/80 border border-tropic-cyan/30 shadow-glow-cyan">
                <div className="text-[10px] text-tropic-cyan uppercase">Fleet Speed Record</div>
                <div className="text-sm font-bold text-white">34.1 KT (Vortex)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vessel Spotlight Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Telemetry & Hull Profile */}
          <div className="lg:col-span-2 rounded-2xl bg-tropic-deep/80 border border-tropic-cyan/20 p-5 md:p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full ring-4 ring-white/10"
                  style={{ backgroundColor: selectedVessel.accentColor }}
                />
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedVessel.name}
                    <span className="text-xs font-mono font-medium text-slate-400">
                      ({selectedVessel.sailNumber})
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Skipper: <span className="text-slate-200">{selectedVessel.skipper}</span> • {selectedVessel.team}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${
                  selectedVessel.status === 'foiling'
                    ? 'bg-tropic-cyan/20 text-tropic-cyan border border-tropic-cyan/40 shadow-glow-cyan'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  🚀 {selectedVessel.status}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-800 text-slate-200">
                  Rank #{selectedVessel.rank}
                </span>
              </div>
            </div>

            {/* Vessel Grid Data */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5 font-mono">
              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Boat Speed (SOG)</div>
                <div className="text-xl font-extrabold text-tropic-cyan mt-1 glow-cyan">
                  {selectedVessel.sog} <span className="text-xs text-slate-400">kt</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Target: 25.8 kt (+2.3%)</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">True Wind (TWS / TWA)</div>
                <div className="text-xl font-bold text-white mt-1">
                  {selectedVessel.tws} <span className="text-xs text-slate-400">kt</span>
                </div>
                <div className="text-[10px] text-tropic-sand mt-0.5">TWA: {Math.abs(selectedVessel.twa)}° {selectedVessel.twa >= 0 ? 'STBD' : 'PORT'}</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Hydrofoil Extension</div>
                <div className="text-xl font-bold text-tropic-aqua mt-1">
                  {selectedVessel.foilPort}% <span className="text-xs text-slate-400">Port</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Rake: +{selectedVessel.foilRake}°</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Hull Heel Angle</div>
                <div className="text-xl font-bold text-slate-100 mt-1">
                  {Math.abs(selectedVessel.heel)}°
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Max Threshold: 28.0°</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Active Sail Plan</div>
                <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                  {selectedVessel.sailPlan}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Trim Efficiency: 98.4%</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Current Position</div>
                <div className="text-xs font-bold text-slate-200 mt-1">
                  {Math.abs(selectedVessel.lat).toFixed(2)}°S, {Math.abs(selectedVessel.lon).toFixed(2)}°W
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Heading: {selectedVessel.heading}° COG: {selectedVessel.cog}°</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">LiFePO4 Storage</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {selectedVessel.batterySoC}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">HydroGen: +{selectedVessel.hydroGenWatts}W</div>
              </div>

              <div className="p-3 rounded-xl bg-tropic-abyss/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase">Skipper Biometrics</div>
                <div className="text-xl font-bold text-tropic-coral mt-1">
                  {selectedVessel.skipperHeartRate} <span className="text-xs text-slate-400">bpm</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Rest: {selectedVessel.skipperSleepHours}h in last 24h</div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono">
                Select an operational mode to drill down into tactical subsystems:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveView('chart')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-tropic-cyan/15 text-tropic-cyan hover:bg-tropic-cyan/25 border border-tropic-cyan/30 transition-all font-mono"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Tactical Chart
                </button>
                <button
                  onClick={() => setActiveView('cockpit')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all font-mono"
                >
                  <Gauge className="w-3.5 h-3.5 text-tropic-sand" />
                  Polar Cockpit
                </button>
                <button
                  onClick={() => setActiveView('weather')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all font-mono"
                >
                  <CloudRain className="w-3.5 h-3.5 text-tropic-aqua" />
                  Weather Router
                </button>
              </div>
            </div>
          </div>

          {/* Environmental & Race Waypoints Card */}
          <div className="rounded-2xl bg-tropic-deep/80 border border-slate-800 p-5 md:p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-tropic-aqua" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Tropical Sea Conditions
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tropic-aqua/20 text-tropic-aqua font-bold">
                  {state.environment.seaState}
                </span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-tropic-abyss/60 border border-slate-800">
                  <span className="text-slate-400">Trade Wind Velocity:</span>
                  <span className="font-bold text-tropic-sand">
                    {state.environment.windSpeed} kt @ {state.environment.windDirection}°
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-tropic-abyss/60 border border-slate-800">
                  <span className="text-slate-400">South Pacific Swell:</span>
                  <span className="font-bold text-white">
                    {state.environment.swellHeight}m @ {state.environment.swellPeriod}s ({state.environment.swellDirection}°)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-tropic-abyss/60 border border-slate-800">
                  <span className="text-slate-400">Lagoon / SST Temp:</span>
                  <span className="font-bold text-tropic-cyan">{state.environment.seaTemp}°C (Air: {state.environment.airTemp}°C)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-tropic-abyss/60 border border-slate-800">
                  <span className="text-slate-400">Barometric Pressure:</span>
                  <span className="font-bold text-white">{state.environment.barometricPressure} hPa ({state.environment.pressureTrend})</span>
                </div>
              </div>

              {/* Waypoints Preview */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 mb-2">
                  <span>Race Waypoints & Gates</span>
                  <span>{state.waypoints.length} Total</span>
                </div>
                <div className="space-y-1.5">
                  {state.waypoints.slice(0, 4).map((wp) => (
                    <div
                      key={wp.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-tropic-coral shrink-0" />
                        <span className="truncate text-slate-300">{wp.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {wp.type.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Telemetry Clock: <span className="text-tropic-cyan">{state.isPlaying ? 'ACTIVE 1000ms' : 'PAUSED'}</span> • Multiplier: <span className="text-tropic-sand">{state.simulationSpeed}x</span>
            </div>
          </div>
        </div>

        {/* Feature Modules Overview Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Operational Modules & Tactical Stations
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Keyboard Shortcuts: [1] through [6]
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* 1. Tactical Chart */}
            <div
              onClick={() => setActiveView('chart')}
              className="p-4 rounded-xl bg-tropic-deep/60 border border-slate-800 hover:border-tropic-cyan/40 hover:bg-tropic-deep/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-tropic-cyan/15 text-tropic-cyan group-hover:scale-110 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-tropic-cyan bg-tropic-cyan/10 px-2 py-0.5 rounded">
                  [1]
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-tropic-cyan transition-colors">
                Nautical Vector Chart & Wind Streamlines
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Interactive 2D Canvas sea chart with particle wind streamfields, coral hazard zones, and distance ruler tool.
              </p>
            </div>

            {/* 2. Fleet Roster */}
            <div
              onClick={() => setActiveView('fleet')}
              className="p-4 rounded-xl bg-tropic-deep/60 border border-slate-800 hover:border-tropic-cyan/40 hover:bg-tropic-deep/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-tropic-sand/15 text-tropic-sand group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-tropic-sand bg-tropic-sand/10 px-2 py-0.5 rounded">
                  [2]
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-tropic-sand transition-colors">
                Fleet Leaderboard & Tactical Intelligence
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Real-time competitor tracking, sector split deltas, handicap scoring (IRC/ORC), and skipper cards.
              </p>
            </div>

            {/* 3. Polar Cockpit */}
            <div
              onClick={() => setActiveView('cockpit')}
              className="p-4 rounded-xl bg-tropic-deep/60 border border-slate-800 hover:border-tropic-cyan/40 hover:bg-tropic-deep/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-tropic-coral/15 text-tropic-coral group-hover:scale-110 transition-transform">
                  <Gauge className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-tropic-coral bg-tropic-coral/10 px-2 py-0.5 rounded">
                  [3]
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-tropic-coral transition-colors">
                Polar Performance & Hydrodynamic Telemetry
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Theoretical polar curves, apparent wind vectors, foil load cells, heel inclinometer, and sail advisory.
              </p>
            </div>

            {/* 4. Weather Router */}
            <div
              onClick={() => setActiveView('weather')}
              className="p-4 rounded-xl bg-tropic-deep/60 border border-slate-800 hover:border-tropic-cyan/40 hover:bg-tropic-deep/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-tropic-aqua/15 text-tropic-aqua group-hover:scale-110 transition-transform">
                  <CloudRain className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-tropic-aqua bg-tropic-aqua/10 px-2 py-0.5 rounded">
                  [4]
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-tropic-aqua transition-colors">
                Isochrone Weather Router & Strategy Engine
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                72-hour forecast time scrubber, isobar pressure gradients, and Rhumb line vs Isochrone simulation.
              </p>
            </div>

            {/* 5. Blackbox Replay */}
            <div
              onClick={() => setActiveView('replay')}
              className="p-4 rounded-xl bg-tropic-deep/60 border border-slate-800 hover:border-tropic-cyan/40 hover:bg-tropic-deep/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-110 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  [5]
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-purple-400 transition-colors">
                Blackbox Replay & Anomaly Sparklines
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Time-travel scrubber with event bookmarks (jibes, squalls, foil strikes) and synchronized telemetry channels.
              </p>
            </div>

            {/* 6. Systems & Crew */}
            <div
              onClick={() => setActiveView('systems')}
              className="p-4 rounded-xl bg-tropic-deep/60 border border-slate-800 hover:border-tropic-cyan/40 hover:bg-tropic-deep/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  [6]
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-3 group-hover:text-emerald-400 transition-colors">
                Marine Power Grid & Crew Biometrics
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                48V LiFePO4 bank, hydro-generators, desalinator telemetry, 4-hour watch rota, and sleep debt monitor.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
