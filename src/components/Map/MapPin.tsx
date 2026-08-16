import React from 'react';
import { motion } from 'framer-motion';
import { ProfileData } from '@/data/profiles';
import styles from './MapPin.module.css';

interface MapPinProps {
  profile: ProfileData;
  isSelected: boolean;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export default function MapPin({
  profile,
  isSelected,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick
}: MapPinProps) {
  return (
    <motion.div
      className={styles.pinContainer}
      style={{ left: profile.coordinates.x, top: profile.coordinates.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
    >
      <div 
        className={`${styles.pin} ${isSelected ? styles.selected : ''} ${isHovered && !isSelected ? styles.hovered : ''}`}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            onClick();
          }
        }}
        role="button"
        aria-label={`${profile.name} profile`}
      >
        <span className={styles.icon}>{profile.icon}</span>
        
        {/* Glowing ring when selected */}
        {isSelected && (
          <motion.div 
            className={styles.selectedRing}
            layoutId="selectedRing"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0.5 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
          />
        )}
      </div>
    </motion.div>
  );
}
