import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileData } from '@/data/profiles';
import styles from './ProfilePanel.module.css';

interface ProfilePanelProps {
  profile: ProfileData | null;
  onClose: () => void;
}

export default function ProfilePanel({ profile, onClose }: ProfilePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap and escape handling could go here, but ESC is handled in MapInterface
  
  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          ref={panelRef}
          className={styles.panel}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          role="dialog"
          aria-labelledby="profile-title"
        >
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <h2 id="profile-title" className={styles.title}>{profile.name}</h2>
              <span className={styles.icon}>{profile.icon}</span>
            </div>
            <div className={styles.username}>{profile.username}</div>
            <div className={styles.category}>{profile.category}</div>
          </div>

          <div className={styles.content}>
            <p className={styles.description}>{profile.description}</p>
            
            <div className={styles.statsContainer}>
              {profile.statistics.map((stat, idx) => (
                <div key={idx} className={styles.statBlock}>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statValue}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <a 
              href={profile.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.actionButton}
            >
              [ VIEW PROFILE ]
            </a>
            <button className={styles.closeButton} onClick={onClose}>
              [ CLOSE ]
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
