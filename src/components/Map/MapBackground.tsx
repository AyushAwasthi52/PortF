import React from 'react';
import styles from './MapBackground.module.css';

interface MapBackgroundProps {
  width: number;
  height: number;
}

export default function MapBackground({ width, height }: MapBackgroundProps) {
  return (
    <div className={styles.mapBackground} style={{ width, height }}>
      {/* Base texture layer */}
      <div className={styles.textureLayer} />
      
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 8000 4800" 
        preserveAspectRatio="none" 
        className={styles.svgLayer} 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
          <pattern id="majorGrid" width="500" height="500" patternUnits="userSpaceOnUse">
            <path d="M 500 0 L 0 0 0 500" fill="none" stroke="rgba(200, 180, 150, 0.08)" strokeWidth="1.5" />
          </pattern>
        </defs>
        
        {/* Grid Layers */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#majorGrid)" />

        {/* Tactical Sector Boundaries (Dashed) */}
        <path
          d="M 2800 1800 L 3700 1800 L 3800 2500 L 2900 2500 Z"
          fill="none"
          stroke="rgba(200, 180, 150, 0.12)"
          strokeWidth="2"
          strokeDasharray="12 8"
        />
        <text x="2850" y="1840" fill="rgba(200, 180, 150, 0.25)" fontFamily="monospace" fontSize="22" letterSpacing="3">
          ZONE 01 // DEV CITADEL
        </text>

        <path
          d="M 3900 1600 L 5200 1600 L 5300 2800 L 4000 2800 Z"
          fill="none"
          stroke="rgba(200, 180, 150, 0.12)"
          strokeWidth="2"
          strokeDasharray="12 8"
        />
        <text x="3950" y="1640" fill="rgba(200, 180, 150, 0.25)" fontFamily="monospace" fontSize="22" letterSpacing="3">
          ZONE 02 // ALGORITHM VALLEY
        </text>

        <path
          d="M 2800 2600 L 4200 2600 L 4100 3200 L 2900 3200 Z"
          fill="none"
          stroke="rgba(200, 180, 150, 0.12)"
          strokeWidth="2"
          strokeDasharray="12 8"
        />
        <text x="2850" y="2640" fill="rgba(200, 180, 150, 0.25)" fontFamily="monospace" fontSize="22" letterSpacing="3">
          ZONE 03 // OUTPOST COMMAND
        </text>

        {/* Subtle Topographical Elevation Contours */}
        <ellipse cx="4400" cy="2250" rx="900" ry="500" fill="none" stroke="rgba(200, 180, 150, 0.05)" strokeWidth="2" />
        <ellipse cx="4400" cy="2250" rx="600" ry="350" fill="none" stroke="rgba(200, 180, 150, 0.04)" strokeWidth="1.5" />
        <ellipse cx="3400" cy="2500" rx="800" ry="600" fill="none" stroke="rgba(200, 180, 150, 0.04)" strokeWidth="1.5" />

        {/* Tactical Supply / Connection Routes between Profiles */}
        <path
          d="M 3300 2200 Q 3700 2000 4200 2000"
          fill="none"
          stroke="rgba(200, 180, 150, 0.18)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M 4200 2000 Q 4350 2300 4500 2600"
          fill="none"
          stroke="rgba(200, 180, 150, 0.18)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M 4500 2600 Q 4700 2400 4900 2200"
          fill="none"
          stroke="rgba(200, 180, 150, 0.18)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M 3300 2200 Q 3150 2500 3200 2800"
          fill="none"
          stroke="rgba(200, 180, 150, 0.18)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M 3200 2800 Q 3500 2850 3800 2900"
          fill="none"
          stroke="rgba(200, 180, 150, 0.18)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <path
          d="M 3800 2900 Q 4200 2800 4500 2600"
          fill="none"
          stroke="rgba(200, 180, 150, 0.18)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
      </svg>
      
      {/* Decorative Coordinates across map */}
      <div className={styles.coordinates}>
        {['A', 'B', 'C', 'D', 'E', 'F'].map((row, i) => (
          <div key={row} style={{ top: i * 700 + 400, left: 150 }} className={styles.coordLabel}>
            GRID_REF // {row}-0{i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
