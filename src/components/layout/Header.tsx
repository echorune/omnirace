import React, { useState } from 'react';
import { useRegatta } from '../../state/RegattaContext';
import { ViewType } from '../../types';
import {
  Compass,
  Radio,
  Volume2,
  VolumeX,
  Gauge,
  Navigation,
  CloudRain,
  History,
  Activity,
  Users,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    state,
    setActiveView,
    toggleSound,
    testAudio,
    toggleSatellite,
    formatRaceTime,
    setVolume
  } = useRegatta();

  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const [showSatelliteModal, setShowSatelliteModal] = useState(false);

  const navItems: { id: ViewType; label: string; icon: React.ElementType; keyNumber: string }[] = [
    { id: 'chart', label: 'Tactical Chart', icon: Navigation, keyNumber: '1' },
    { id: 'fleet', label: 'Fleet Roster', icon: Users, keyNumber: '2' },
    { id: 'cockpit', label: 'Polar Cockpit', icon: Gauge, keyNumber: '3' },
    { id: 'weather', label: 'Isochrone Router', icon: CloudRain, keyNumber: '4' },
    { id: 'replay', label: 'Blackbox Replay', icon: History, keyNumber: '5' },
    { id: 'systems', label: 'Systems & Crew', icon: Activity, keyNumber: '6' },
  ];

  return (
    <header className="relative z-50 bg-tropic-abyss/95 border-b border-tropic-cyan/20 backdrop-blur-md px-4 py-2.5 transition-all select-none">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity & Race Stage */}
        <div className="flex items-center gap-3.5 min-w-[260px]">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-tropic-cyan/20 via-tropic-surface to-tropic-abyss border border-tropic-cyan/40 shadow-glow-cyan">
            {/* Animated Foiling Hydrofoil Logo */}
            <svg className="w-6 h-6 text-tropic-cyan animate-pulse-subtle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2" />
              <path d="M5 14h14" strokeWidth="1.5" strokeDasharray="2 2" />
              <path d="M8 22l4-5 4 5" stroke="#FF5E7E" strokeWidth="2" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tropic-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tropic-cyan"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base uppercase bg-gradient-to-r from-white via-slate-100 to-tropic-cyan bg-clip-text text-transparent">
                OmniRace
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono tracking-widest font-semibold uppercase rounded bg-tropic-cyan/15 text-tropic-cyan border border-tropic-cyan/30">
                PELAGIC OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">
              Tahiti → Fiji • Trans-Pacific Foiling Cup
            </p>
          </div>
        </div>

        {/* Center: Operational Mode Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-tropic-deep/80 border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-tropic-cyan/25 to-tropic-aqua/20 text-white border border-tropic-cyan/50 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'text-tropic-cyan scale-110' : 'group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded transition-opacity ${
                  isActive ? 'bg-tropic-cyan/20 text-tropic-cyan' : 'bg-slate-800 text-slate-500 opacity-60 group-hover:opacity-100'
                }`}>
                  {item.keyNumber}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-tropic-cyan rounded-full shadow-[0_0_8px_#00F5D4]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Race Time, Marine Weather & System Telemetry HUD */}
        <div className="flex items-center gap-3">
          
          {/* Race Elapsed Time (RET) */}
          <div className="hidden sm:flex flex-col items-end px-3 py-1 rounded-lg bg-tropic-deep/60 border border-slate-800 font-mono">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400">
              <span className={`w-1.5 h-1.5 rounded-full ${state.isPlaying ? 'bg-tropic-cyan animate-pulse' : 'bg-amber-500'}`} />
              <span>RET (Elapsed)</span>
            </div>
            <span className="text-xs font-bold text-tropic-cyan glow-cyan tracking-tight">
              {formatRaceTime(state.elapsedSeconds)}
            </span>
          </div>

          {/* Meteorological Quick Capsule */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-lg bg-tropic-deep/60 border border-slate-800 text-xs">
            <Compass className="w-3.5 h-3.5 text-tropic-sand animate-spin" style={{ animationDuration: '30s' }} />
            <div>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                <span>TRADE WIND</span>
                <span className="text-tropic-sand font-semibold">{state.environment.windDirection}°</span>
              </div>
              <span className="font-mono font-bold text-white">
                {state.environment.windSpeed.toFixed(1)} <span className="text-[10px] text-slate-400">KT</span>
              </span>
            </div>
          </div>

          {/* Satellite Starlink Marine Status */}
          <div className="relative">
            <button
              onClick={() => setShowSatelliteModal(!showSatelliteModal)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors border ${
                state.isSatelliteOnline
                  ? 'bg-tropic-cyan/10 border-tropic-cyan/30 text-tropic-cyan hover:bg-tropic-cyan/20'
                  : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
              }`}
              title="Starlink Maritime Uplink"
            >
              {state.isSatelliteOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-tropic-cyan" />
                  <span className="hidden md:inline">{state.starlinkLatency}ms</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden md:inline">OFFLINE</span>
                </>
              )}
            </button>

            {/* Satellite Popover */}
            {showSatelliteModal && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-tropic-deep border border-tropic-cyan/30 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-tropic-cyan" />
                    <span className="text-xs font-bold text-white tracking-wide">STARLINK MARITIME</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                    state.isSatelliteOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {state.isSatelliteOnline ? 'LINK LOCKED' : 'DISCONNECTED'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Constellation:</span>
                    <span>Direct-to-Cell V2 (Pelagic)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Uplink Throughput:</span>
                    <span className="text-tropic-cyan font-semibold">{state.starlinkUplink} Mbps</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Transponder Ping:</span>
                    <span>{state.starlinkLatency} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Elevation Azimuth:</span>
                    <span>54° N / 138° W</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={toggleSatellite}
                    className="w-full py-1.5 text-xs font-bold uppercase rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                  >
                    {state.isSatelliteOnline ? 'Simulate Disconnect' : 'Reconnect Satellite'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Procedural Web Audio Synthesizer Controls */}
          <div className="relative">
            <button
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              className={`p-2 rounded-lg text-xs font-medium transition-all border ${
                state.soundEnabled
                  ? 'bg-tropic-cyan/15 border-tropic-cyan/40 text-tropic-cyan hover:bg-tropic-cyan/25 shadow-glow-cyan'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500 hover:text-slate-300'
              }`}
              title="Marine Synthesizer Sound Engine"
            >
              {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Audio Synth Popover */}
            {showAudioMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-tropic-deep border border-tropic-cyan/30 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-tropic-cyan" />
                    <span className="text-xs font-bold text-white tracking-wide">SYNTHETIC AUDIO ENGINE</span>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                      state.soundEnabled ? 'bg-tropic-cyan text-tropic-abyss' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {state.soundEnabled ? 'ACTIVE' : 'MUTED'}
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Synthesizer Gain:</span>
                    <span className="text-tropic-cyan font-bold">{Math.round(state.soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={state.soundVolume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-tropic-cyan"
                  />
                </div>

                {/* Procedural Marine Audio Samples */}
                <div className="mt-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                    Procedural Sound Test Matrix
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => testAudio('sonar')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-tropic-cyan/20 hover:text-tropic-cyan hover:border-tropic-cyan/40 text-slate-200 border border-slate-700 transition-all font-mono text-[11px] text-left"
                    >
                      📡 Sonar Blip
                    </button>
                    <button
                      onClick={() => testAudio('chime')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-tropic-sand/20 hover:text-tropic-sand hover:border-tropic-sand/40 text-slate-200 border border-slate-700 transition-all font-mono text-[11px] text-left"
                    >
                      🔔 Waypoint Chime
                    </button>
                    <button
                      onClick={() => testAudio('hazard')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-tropic-coral/20 hover:text-tropic-coral hover:border-tropic-coral/40 text-slate-200 border border-slate-700 transition-all font-mono text-[11px] text-left"
                    >
                      ⚠️ Reef Hazard
                    </button>
                    <button
                      onClick={() => testAudio('emergency')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 text-slate-200 border border-slate-700 transition-all font-mono text-[11px] text-left"
                    >
                      🚨 EPIRB Distress
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
