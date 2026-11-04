import React from 'react';
import { RegattaProvider } from './state/RegattaContext';
import { AppShell } from './components/layout/AppShell';

export const App: React.FC = () => {
  return (
    <RegattaProvider>
      <AppShell />
    </RegattaProvider>
  );
};

export default App;
