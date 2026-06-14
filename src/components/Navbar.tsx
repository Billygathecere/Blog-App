import React from 'react';

/**
 * Dynamic navigation bar.
 * We will implement brand links, active viewport states, and toggleable login buttons here.
 */

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <div className="border-b border-zinc-200 bg-white p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="font-semibold text-zinc-900 font-sans tracking-tight">Chronicle</h1>
        <div className="flex gap-4">
          {/* We will build our dynamic action items together here! */}
        </div>
      </div>
    </div>
  );
};
