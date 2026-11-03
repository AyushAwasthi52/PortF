import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileData } from '@/data/profiles';
import styles from './MapPin.module.css';

interface MapPinProps {
  profile: ProfileData;
  isSelected: boolean;
  isHovered: boolean;
  isVisited?: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

function PlatformIcon({ icon, name }: { icon: string; name: string }) {
  switch (icon.toLowerCase()) {
    case 'github':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      );
    case 'codeforces':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="10" width="4.5" height="11" rx="1" fill="#4B9CD3" />
          <rect x="9.75" y="4" width="4.5" height="17" rx="1" fill="#FFC83B" />
          <rect x="16.5" y="13" width="4.5" height="8" rx="1" fill="#E74C3C" />
        </svg>
      );
    case 'leetcode':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.618 5.82 5.82 0 0 0 1.258-.043 5.922 5.922 0 0 0 2.228-.806l7.85-6.042a1.374 1.374 0 1 0-1.68-2.185l-7.85 6.042a3.172 3.172 0 0 1-1.193.432 3.125 3.125 0 0 1-.674.023 3.187 3.187 0 0 1-2.587-1.942 3.127 3.127 0 0 1-.188-.546 2.96 2.96 0 0 1-.033-1.267 2.85 2.85 0 0 1 .65-1.13l3.854-4.125 5.406-5.788A1.374 1.374 0 0 0 13.483 0z" fill="#FFA116"/>
          <path d="M17.483 7.5a1.375 1.375 0 0 0 0 2.75h4a1.375 1.375 0 1 0 0-2.75h-4z" fill="#E8D5B5"/>
        </svg>
      );
    case 'codechef':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" stroke="#d49a6a"/>
          <line x1="6" y1="17" x2="18" y2="17" stroke="#d49a6a"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'hackerrank':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#00EA64">
          <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm-2.4 16.2H7.2V7.8h2.4v3.3h4.8V7.8h2.4v8.4h-2.4v-3.3H9.6v3.3z"/>
        </svg>
      );
    default:
      return <span>{name.slice(0, 2).toUpperCase()}</span>;
  }
}

export default function MapPin({
  profile,
  isSelected,
  isHovered,
  isVisited,
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
        className={`${styles.pin} ${isSelected ? styles.selected : ''} ${isHovered && !isSelected ? styles.hovered : ''} ${isVisited ? styles.visited : ''}`}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }
        }}
        role="button"
        aria-label={`${profile.name} profile (${profile.category})`}
      >
        <div className={styles.icon}>
          <PlatformIcon icon={profile.icon} name={profile.name} />
        </div>
        
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

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && !isSelected && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.tooltipName}>{profile.name}</div>
            <div className={styles.tooltipCategory}>{profile.category}</div>
            {profile.statistics[0] && (
              <div className={styles.tooltipStat}>
                {profile.statistics[0].label}: {profile.statistics[0].value}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
