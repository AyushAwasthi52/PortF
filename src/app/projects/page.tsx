'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import { projectsData } from '@/data/projects';
import AttacheCase from '@/components/AttacheCase';
import styles from './projects.module.css';

export default function ProjectsPage() {
  const router = useRouter();
  const { playHover, playSelect, playCaseOpen } = useAudio();
  
  // Play sound on mount if case is opening
  useState(() => {
    // Only play in browser
    if (typeof window !== 'undefined') {
      setTimeout(playCaseOpen, 300);
    }
  });

  const handleBack = () => {
    playSelect();
    router.push('/');
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <motion.button
          className={styles.backButton}
          onClick={handleBack}
          onMouseEnter={playHover}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={styles.backIcon}>←</span>
          <span>RETURN</span>
        </motion.button>
        
        <motion.div
          className={styles.titleContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>ATTACHÉ CASE</h1>
          <div className={styles.capacity}>
            <span>CAPACITY: 5/30</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className={styles.caseWrapper}
        initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <AttacheCase initialProjects={projectsData} />
      </motion.div>
    </main>
  );
}
