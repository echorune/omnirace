import React, { useEffect } from 'react';
import { useRegatta } from '../../state/RegattaContext';
import { Header } from './Header';
import { ActiveVesselDock } from './ActiveVesselDock';
import { ViewContainer } from '../views/ViewContainer';

export const AppShell: React.FC = () => {
  const { setActiveView, togglePlay, toggleSound, testAudio } = useRegatta();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is in an input or textarea
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }

      switch (e.key) {
        case '1':
          setActiveView('chart');
          break;
        case '2':
          setActiveView('fleet');
          break;
        case '3':
          setActiveView('cockpit');
          break;
        case '4':
          setActiveView('weather');
          break;
        case '5':
          setActiveView('replay');
          break;
        case '6':
          setActiveView('systems');
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
        case 'M':
          toggleSound();
          break;
        case 's':
        case 'S':
          testAudio('sonar');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveView, togglePlay, toggleSound, testAudio]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-tropic-abyss text-slate-100 font-sans selection:bg-tropic-cyan/20 selection:text-tropic-cyan">
      {/* Top Tactical Command Header */}
      <Header />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 flex overflow-hidden relative">
        <ViewContainer />
      </main>

      {/* Bottom Marine Telemetry & Active Vessel Dock */}
      <ActiveVesselDock />
    </div>
  );
};
