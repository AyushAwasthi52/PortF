import React from 'react';
import styles from './MapBackground.module.css';

interface MapBackgroundProps {
  width: number;
  height: number;
}

export default function MapBackground({ width, height }: MapBackgroundProps) {
  // Generate some procedural-looking topological paths
  // Since we want this to be original, we'll draw some abstract contours using SVG
  
  return (
    <div className={styles.mapBackground} style={{ width, height }}>
      {/* Base texture layer */}
      <div className={styles.textureLayer} />
      
      <svg width="100%" height="100%" viewBox="0 0 8000 4800" preserveAspectRatio="none" className={styles.svgLayer} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        
        {/* Grid Layer */}
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      
      {/* Compass overlay */}
      <div className={styles.compass}>
        <div className={styles.compassN}>N</div>
        <div className={styles.compassCross}>
          <div className={styles.compassW}>W</div>
          <div className={styles.compassCenter}>+</div>
          <div className={styles.compassE}>E</div>
        </div>
        <div className={styles.compassS}>S</div>
      </div>
      
      {/* Decorative Coordinates */}
      <div className={styles.coordinates}>
        {['A', 'B', 'C', 'D'].map((row, i) => (
          <div key={row} style={{ top: i * 300 + 150, left: 50 }} className={styles.coordLabel}>{row}-04</div>
        ))}
      </div>
    </div>
  );
}
