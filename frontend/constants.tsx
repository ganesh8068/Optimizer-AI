
import React from 'react';

export const APP_NAME = "LinkedIn Optimizer";

export const Icons = {
  Logo: ({ className = "w-10 h-10" }: { className?: string }) => (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="bladeGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Central Core - The thick 'O' */}
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="5" />
      
      {/* Inner Mechanical Bearing Rings */}
      <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Bearing Dividers (Technical Details) */}
      <g stroke="currentColor" strokeWidth="1.5">
        {[0, 72, 144, 216, 288].map((angle) => (
          <line 
            key={`div-${angle}`}
            x1="50" y1="18" x2="50" y2="24" 
            transform={`rotate(${angle + 36} 50 50)`} 
          />
        ))}
      </g>

      {/* The 5 Mechanical Arms / Shutter Blades */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {[0, 72, 144, 216, 288].map((angle) => (
          <g key={`arm-${angle}`} transform={`rotate(${angle} 50 50)`}>
            {/* Outer Boxy Frame of the Arm */}
            <path d="M40 10 L65 15 L70 40 L50 35 L40 10" fill="none" />
            
            {/* Inner Curved Connection to Ring */}
            <path d="M50 24 C55 24 62 28 65 38" fill="none" strokeWidth="2" />
            
            {/* The Gradient Shaded 'Light' Effect from the image */}
            <path 
              d="M58 18 L72 24 L78 40 L65 35 Z" 
              fill="url(#bladeGradient)" 
              stroke="none" 
              opacity="0.5" 
            />

            {/* Pivot Pin / Connector Circle */}
            <circle cx="52" cy="18" r="2.2" fill="currentColor" stroke="none" />
            
            {/* Linkage Line to Pin */}
            <line x1="52" y1="18" x2="52" y2="24" strokeWidth="1.2" />
          </g>
        ))}
      </g>

      {/* Subtle Outer Frame Connectors */}
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" opacity="0.3" />
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  )
};
