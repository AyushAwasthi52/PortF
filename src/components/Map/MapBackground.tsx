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
      
      <svg width="100%" height="100%" viewBox="0 0 2000 1200" preserveAspectRatio="none" className={styles.svgLayer} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        
        {/* Grid Layer */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Topographic Lines */}
        <path d="M 0 200 Q 400 300 800 100 T 1600 400 T 2000 200" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <path d="M 0 220 Q 400 320 800 120 T 1600 420 T 2000 220" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        <path d="M 0 600 Q 500 800 1000 500 T 1800 900 T 2000 700" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <path d="M 0 620 Q 500 820 1000 520 T 1800 920 T 2000 720" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        
        <path d="M 400 0 C 300 400 700 800 600 1200" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="10 5" />
        <path d="M 1300 0 C 1400 500 1100 800 1400 1200" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="10 5" />
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
