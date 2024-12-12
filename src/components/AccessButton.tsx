import React from 'react';
import { AccessForm } from './AccessForm';

export function AccessButton() {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="group relative px-8 py-4 text-white rounded-lg text-xl font-semibold transition-all duration-300 mb-12 overflow-hidden"
      >
      <span className="relative z-10">Request Access</span>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/80 to-gray-700/80 group-hover:from-gray-500/80 group-hover:to-gray-600/80 transition-colors duration-300" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
      </button>
      
      {showForm && <AccessForm onClose={() => setShowForm(false)} />}
    </>
  );
}