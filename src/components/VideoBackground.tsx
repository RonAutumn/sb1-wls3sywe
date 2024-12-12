import React from 'react';

export function VideoBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="absolute inset-0 bg-black/40 z-10" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://github.com/RonAutumn/SVG-Hosting/blob/ebc7f45b723c325c90979709097e0d028e268fe9/2025634-sd_640_360_25fps.mp4?raw=true"
          type="video/mp4"
        />
      </video>
    </div>
  );
}