'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import MapInterface from '@/components/Map/MapInterface';
import styles from './profiles.module.css';

export default function ProfilesPage() {
  const router = useRouter();
  const { playSelect, playHover } = useAudio();
  
  const handleBack = () => {
    playSelect();
    router.push('/');
  };

  return (
    <main className={styles.mainContainer}>
      {/* Return button overlay */}
      <div className={styles.header}>
        <motion.button
          className={styles.backButton}
          onClick={handleBack}
          onMouseEnter={playHover}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className={styles.backIcon}>←</span>
          <span>RETURN</span>
        </motion.button>
        
        <motion.div
          className={styles.titleContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h1 className={styles.title}>CODING PROFILES</h1>
        </motion.div>
      </div>

      {/* Map reveal transition */}
      <motion.div
        className={styles.mapWrapper}
        initial={{ opacity: 0, scale: 1.05, filter: 'brightness(0)' }}
        animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <MapInterface />
      </motion.div>
    </main>
  );
}
