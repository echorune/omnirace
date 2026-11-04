import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { RegattaState, Vessel, ViewType, RaceEvent } from '../types';
import { INITIAL_REGATTA_STATE } from '../data/mockRegatta';
import { audioEngine } from '../services/audioEngine';

interface RegattaContextValue {
  state: RegattaState;
  selectedVessel: Vessel;
  setActiveView: (view: ViewType) => void;
  selectVessel: (id: string) => void;
  togglePlay: () => void;
  setSimulationSpeed: (speed: number) => void;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  testAudio: (type: 'sonar' | 'chime' | 'hazard' | 'emergency') => void;
  toggleSatellite: () => void;
  addEvent: (event: Omit<RaceEvent, 'id' | 'timestamp'>) => void;
  formatRaceTime: (totalSeconds: number) => string;
}

const RegattaContext = createContext<RegattaContextValue | null>(null);

export const RegattaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<RegattaState>(INITIAL_REGATTA_STATE);

  // Sync initial audio volume
  useEffect(() => {
    audioEngine.setMuted(!state.soundEnabled);
    audioEngine.setVolume(state.soundVolume);
  }, [state.soundEnabled, state.soundVolume]);

  const selectedVessel = useMemo(() => {
    return state.vessels.find(v => v.id === state.selectedVesselId) || state.vessels[0];
  }, [state.vessels, state.selectedVesselId]);

  const setActiveView = useCallback((view: ViewType) => {
    audioEngine.playClick(920);
    setState(prev => ({ ...prev, activeView: view }));
  }, []);

  const selectVessel = useCallback((id: string) => {
    audioEngine.playSonarPing();
    setState(prev => ({ ...prev, selectedVesselId: id }));
  }, []);

  const togglePlay = useCallback(() => {
    audioEngine.playClick(750);
    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const setSimulationSpeed = useCallback((speed: number) => {
    audioEngine.playClick(850 + speed * 15);
    setState(prev => ({ ...prev, simulationSpeed: speed }));
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => {
      const nextSound = !prev.soundEnabled;
      audioEngine.setMuted(!nextSound);
      if (nextSound) {
        audioEngine.playClick(1000);
      }
      return { ...prev, soundEnabled: nextSound };
    });
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioEngine.setVolume(volume);
    setState(prev => ({ ...prev, soundVolume: volume }));
  }, []);

  const testAudio = useCallback((type: 'sonar' | 'chime' | 'hazard' | 'emergency') => {
    switch (type) {
      case 'sonar':
        audioEngine.playSonarPing();
        break;
      case 'chime':
        audioEngine.playWaypointChime();
        break;
      case 'hazard':
        audioEngine.playHazardAlert();
        break;
      case 'emergency':
        audioEngine.playEmergencySignal();
        break;
    }
  }, []);

  const toggleSatellite = useCallback(() => {
    audioEngine.playClick(600);
    setState(prev => ({ ...prev, isSatelliteOnline: !prev.isSatelliteOnline }));
  }, []);

  const addEvent = useCallback((event: Omit<RaceEvent, 'id' | 'timestamp'>) => {
    const newEvent: RaceEvent = {
      ...event,
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      recentEvents: [newEvent, ...prev.recentEvents.slice(0, 19)]
    }));
  }, []);

  // Format seconds into DDd HHh MMm SSs
  const formatRaceTime = useCallback((totalSeconds: number): string => {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }, []);

  // Real-time Simulation Clock Loop
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      setState(prev => {
        const stepSeconds = prev.simulationSpeed;
        const newElapsed = prev.elapsedSeconds + stepSeconds;

        // Dynamic vessel physics simulation: micro variations for realistic telemetry
        const updatedVessels = prev.vessels.map(vessel => {
          // Slight natural oscillating drift for realism
          const jitter = (Math.random() - 0.5) * 0.15;
          const newSog = Math.max(12, Math.min(38, vessel.sog + jitter));
          const newVmg = Math.max(10, Math.min(newSog * 0.96, vessel.vmg + jitter * 0.9));
          const heelOscillation = vessel.heel + Math.sin(newElapsed * 0.2) * 0.25;

          // Lat/lon subtle forward progression along heading
          const nmPerDegree = 60.0;
          const distCoveredNM = (newSog * (stepSeconds / 3600));
          const headingRad = (vessel.heading * Math.PI) / 180;
          const dLat = (distCoveredNM * Math.cos(headingRad)) / nmPerDegree;
          const dLon = (distCoveredNM * Math.sin(headingRad)) / (nmPerDegree * Math.cos((vessel.lat * Math.PI) / 180));

          const newLat = vessel.lat + dLat;
          const newLon = vessel.lon + dLon;
          const newDtf = Math.max(0, vessel.dtf - distCoveredNM);

          return {
            ...vessel,
            sog: parseFloat(newSog.toFixed(1)),
            vmg: parseFloat(newVmg.toFixed(1)),
            heel: parseFloat(heelOscillation.toFixed(1)),
            lat: parseFloat(newLat.toFixed(4)),
            lon: parseFloat(newLon.toFixed(4)),
            dtf: parseFloat(newDtf.toFixed(1)),
          };
        });

        // Recalculate rank and DTL
        const sorted = [...updatedVessels].sort((a, b) => a.dtf - b.dtf);
        const leaderDtf = sorted[0].dtf;
        const finalVessels = updatedVessels.map(v => {
          const rank = sorted.findIndex(s => s.id === v.id) + 1;
          const dtl = parseFloat(Math.max(0, v.dtf - leaderDtf).toFixed(1));
          return { ...v, rank, dtl };
        });

        return {
          ...prev,
          elapsedSeconds: newElapsed,
          vessels: finalVessels,
          starlinkLatency: Math.floor(35 + Math.random() * 8)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPlaying, state.simulationSpeed]);

  return (
    <RegattaContext.Provider
      value={{
        state,
        selectedVessel,
        setActiveView,
        selectVessel,
        togglePlay,
        setSimulationSpeed,
        toggleSound,
        setVolume,
        testAudio,
        toggleSatellite,
        addEvent,
        formatRaceTime
      }}
    >
      {children}
    </RegattaContext.Provider>
  );
};

export const useRegatta = (): RegattaContextValue => {
  const context = useContext(RegattaContext);
  if (!context) {
    throw new Error('useRegatta must be used within a RegattaProvider');
  }
  return context;
};
