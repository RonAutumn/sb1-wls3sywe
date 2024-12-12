import React from 'react';
import { VideoBackground } from './components/VideoBackground';
import { AccessButton } from './components/AccessButton';
import { SocialIcons } from './components/SocialIcons';

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <VideoBackground />

      <div className="relative z-20 text-center">
        <h1 className="text-6xl font-bold text-white mb-8 animate-fade-in">
          Need a menu?
        </h1>
        <AccessButton />
        <SocialIcons />
      </div>
    </div>
  );
}

export default App;
