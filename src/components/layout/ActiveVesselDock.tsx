import React, { useState } from 'react';
import { useRegatta } from '../../state/RegattaContext';
import {
  Play,
  Pause,
  Anchor,
  Flame,
  ChevronUp,
  ChevronDown,
  Info,
  AlertTriangle,
  Radio
} from 'lucide-react';

export const ActiveVesselDock: React.FC = () => {
  const {
    state,
    selectedVessel,
    selectVessel,
    togglePlay,
    setSimulationSpeed
  } = useRegatta();

  const [showVesselSelector, setShowVesselSelector] = useState(false);
  const [showEventsDrawer, setShowEventsDrawer] = useState(false);

  const speedOptions = [1, 5, 15, 30];

  const latestEvent = state.recentEvents[0];

  return (
    <div className="relative z-40 bg-tropic-abyss/95 border-t border-tropic-cyan/20 backdrop-blur-md transition-all select-none">
      
      {/* Mini Event Ticker Strip */}
      <div className="bg-tropic-deep/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-4">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-tropic-cyan/15 text-tropic-cyan text-[10px] font-bold uppercase shrink-0">
            <Radio className="w-3 h-3 animate-pulse" />
            LIVE TELEMETRY FEED
          </span>
          {latestEvent && (
            <div className="flex items-center gap-2 truncate text-slate-300">
              {latestEvent.type === 'record' && <Flame className="w-3.5 h-3.5 text-tropic-coral shrink-0" />}
              {latestEvent.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-tropic-sand shrink-0" />}
              {latestEvent.type === 'tactical' && <Anchor className="w-3.5 h-3.5 text-tropic-cyan shrink-0" />}
              {latestEvent.type === 'info' && <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              <span className="truncate">{latestEvent.message}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowEventsDrawer(!showEventsDrawer)}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-tropic-cyan transition-colors shrink-0"
        >
          <span>Log ({state.recentEvents.length})</span>
          {showEventsDrawer ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded Events Drawer */}
      {showEventsDrawer && (
        <div className="max-h-48 overflow-y-auto bg-tropic-deep/95 border-b border-tropic-cyan/20 p-3 space-y-2 text-xs font-mono animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400 text-[10px] uppercase">
            <span>Pelagic Tactical Event Log</span>
            <span>Real-time Transponder Intercepts</span>
          </div>
          {state.recentEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-start gap-2.5 p-1.5 rounded hover:bg-slate-800/40 transition-colors"
            >
              <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                {new Date(ev.timestamp).toLocaleTimeString([], { hour12: false })}
              </span>
              <div className="flex-1">
                <span className={`inline-block px-1.5 py-0.2 mr-2 text-[9px] rounded font-bold uppercase ${
                  ev.type === 'record'
                    ? 'bg-tropic-coral/20 text-tropic-coral'
                    : ev.type === 'warning'
                    ? 'bg-tropic-sand/20 text-tropic-sand'
                    : ev.type === 'tactical'
                    ? 'bg-tropic-cyan/20 text-tropic-cyan'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {ev.type}
                </span>
                <span className="text-slate-200">{ev.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Bottom Cockpit Bar */}
      <div className="max-w-[1920px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Vessel Quick Selection Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowVesselSelector(!showVesselSelector)}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-tropic-deep border border-tropic-cyan/30 hover:border-tropic-cyan/60 transition-all shadow-glow-cyan text-left"
          >
            <div
              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shrink-0"
              style={{ backgroundColor: selectedVessel.accentColor }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  {selectedVessel.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-tropic-cyan border border-tropic-cyan/20">
                  #{selectedVessel.rank}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {selectedVessel.skipper} ({selectedVessel.countryCode}) • {selectedVessel.boatClass}
              </div>
            </div>
            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${showVesselSelector ? 'rotate-180' : ''}`} />
          </button>

          {/* Vessel Selection Popover */}
          {showVesselSelector && (
            <div className="absolute bottom-full mb-2 left-0 w-80 max-h-96 overflow-y-auto rounded-xl bg-tropic-deep border border-tropic-cyan/40 shadow-2xl p-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-bold border-b border-slate-800">
                Switch Active Telemetry Target
              </div>
              <div className="mt-1 space-y-1">
                {state.vessels.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      selectVessel(v.id);
                      setShowVesselSelector(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                      v.id === selectedVessel.id
                        ? 'bg-tropic-cyan/20 border border-tropic-cyan/50 text-white'
                        : 'hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: v.accentColor }}
                      />
                      <div>
                        <div className="text-xs font-semibold">{v.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {v.skipper} • {v.boatClass}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-tropic-cyan">{v.sog} kt</div>
                      <div className="text-[10px] text-slate-400">#{v.rank}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Real-Time Hydrodynamic Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4 font-mono">
          
          {/* Speed Over Ground (SOG) */}
          <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-tropic-deep/80 border border-tropic-cyan/20">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">SOG (Boat Speed)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-extrabold text-tropic-cyan glow-cyan">
                {selectedVessel.sog.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">KT</span>
            </div>
          </div>

          {/* Velocity Made Good (VMG) */}
          <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-tropic-deep/80 border border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">VMG (Target Eff)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-tropic-aqua">
                {selectedVessel.vmg.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">KT</span>
            </div>
          </div>

          {/* True Wind Angle (TWA) */}
          <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-tropic-deep/80 border border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">TWA & Tack</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-tropic-sand">
                {Math.abs(selectedVessel.twa)}°
              </span>
              <span className="text-[10px] font-bold text-emerald-400">
                {selectedVessel.twa >= 0 ? 'STBD' : 'PORT'}
              </span>
            </div>
          </div>

          {/* Heel Inclinometer */}
          <div className="hidden sm:flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-tropic-deep/80 border border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Hull Heel</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-slate-200">
                {Math.abs(selectedVessel.heel).toFixed(1)}°
              </span>
              <span className="text-[10px] text-slate-400">
                {selectedVessel.heel < 0 ? 'PORT' : 'STBD'}
              </span>
            </div>
          </div>

          {/* Distance To Finish (DTF) */}
          <div className="hidden md:flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-tropic-deep/80 border border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">DTF (To Suva)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-bold text-slate-100">
                {selectedVessel.dtf.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">NM</span>
            </div>
          </div>

          {/* Distance To Leader (DTL) */}
          <div className="hidden md:flex flex-col items-center justify-center px-3 py-1.5 rounded-lg bg-tropic-deep/80 border border-slate-800">
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Delta to Leader</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-base sm:text-lg font-bold ${
                selectedVessel.dtl === 0 ? 'text-tropic-cyan glow-cyan' : 'text-tropic-coral'
              }`}>
                {selectedVessel.dtl === 0 ? 'LEADER' : `+${selectedVessel.dtl.toFixed(1)}`}
              </span>
              {selectedVessel.dtl !== 0 && <span className="text-[10px] text-slate-400">NM</span>}
            </div>
          </div>
        </div>

        {/* Right: Simulation Speed & Controls */}
        <div className="flex items-center gap-2 bg-tropic-deep/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={togglePlay}
            className={`p-2 rounded-lg transition-all ${
              state.isPlaying
                ? 'bg-tropic-cyan text-tropic-abyss hover:bg-tropic-cyan/90 shadow-glow-cyan'
                : 'bg-amber-500 text-tropic-abyss hover:bg-amber-400'
            }`}
            title={state.isPlaying ? 'Pause Simulation (Space)' : 'Resume Simulation (Space)'}
          >
            {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Time Multipliers */}
          <div className="flex items-center gap-1 font-mono">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  state.simulationSpeed === speed
                    ? 'bg-tropic-cyan/20 text-tropic-cyan border border-tropic-cyan/50'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
