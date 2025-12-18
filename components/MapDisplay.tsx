
import React, { useState } from 'react';
import { Destination } from '../types';
import { DESTINATIONS } from '../constants';

interface MapDisplayProps {
  onSelectDestination: (dest: Destination) => void;
  selectedCategory: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ onSelectDestination, selectedCategory }) => {
  const filteredDestinations = selectedCategory === 'All' 
    ? DESTINATIONS 
    : DESTINATIONS.filter(d => d.category === selectedCategory);

  return (
    <div className="relative w-full h-full bg-[#e8f4f8] overflow-hidden rounded-3xl shadow-inner border-4 border-[#d4a373]/30">
      {/* Visual background layers for Parallax feeling */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d4a373" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Stylized World Map SVG Outline */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-[#c2b280]/40 transition-transform duration-1000 ease-out"
        style={{ transform: 'scale(1.2)' }}
      >
        <path
          fill="currentColor"
          d="M10,40 Q15,35 25,38 T40,35 T60,40 T85,38 T95,45 V60 Q85,65 70,62 T50,68 T30,65 T10,70 Z"
        />
        <path
          fill="currentColor"
          d="M75,20 Q80,18 85,22 T90,30 T85,35 T70,32 T65,25 Z"
        />
      </svg>

      {/* Interactive Destination Pins */}
      {filteredDestinations.map((dest) => (
        <button
          key={dest.id}
          onClick={() => onSelectDestination(dest)}
          className="group absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 hover:scale-110"
          style={{ left: `${dest.coordinates.x}%`, top: `${dest.coordinates.y}%` }}
        >
          <div className="relative flex flex-col items-center">
             <div className="pulse-ring absolute w-8 h-8 rounded-full pointer-events-none"></div>
             <div className="w-4 h-4 bg-[#d4a373] rounded-full border-2 border-white shadow-lg group-hover:bg-[#bc6c25] transition-colors"></div>
             <span className="mt-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-[#2d241e] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
               {dest.name}
             </span>
          </div>
        </button>
      ))}

      {/* Compass rose decoration */}
      <div className="absolute bottom-6 left-6 w-20 h-20 opacity-30 select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#bc6c25]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M50,5 V95 M5,50 H95" stroke="currentColor" strokeWidth="1" />
          <path d="M50,10 L55,45 L90,50 L55,55 L50,90 L45,55 L10,50 L45,45 Z" fill="currentColor" />
          <text x="47" y="15" className="fill-current text-[12px] font-bold">N</text>
        </svg>
      </div>
    </div>
  );
};

export default MapDisplay;
