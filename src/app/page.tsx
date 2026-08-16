'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import styles from './page.module.css';

const MENU_ITEMS = [
  { id: 'projects', label: 'PROJECTS', path: '/projects' },
  { id: 'profiles', label: 'CODING PROFILES', path: '/profiles' },
  { id: 'personal', label: 'PERSONAL', path: '/personal' },
  { id: 'socials', label: 'SOCIALS', path: '/socials' },
  { id: 'tech', label: 'TECH STACK', path: '/tech' },
  { id: 'links', label: 'LINKS', path: '/links' },
  { id: 'bio', label: 'BIO', path: '/bio' },
];

export default function MainMenu() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { playHover, playSelect } = useAudio();
  const router = useRouter();

  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowUp') {
        playHover();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : MENU_ITEMS.length - 1));
      } else if (e.key === 'ArrowDown') {
        playHover();
        setSelectedIndex((prev) => (prev < MENU_ITEMS.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        handleSelect(MENU_ITEMS[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isTransitioning, playHover]);

  const handleSelect = (item: typeof MENU_ITEMS[0]) => {
    if (isTransitioning) return;
    playSelect();
    setIsTransitioning(true);
    // Add a slight delay for the cinematic transition
    setTimeout(() => {
      router.push(item.path);
    }, 800);
  };

  return (
    <main className={styles.mainContainer}>
      {/* Background cinematic vignette */}
      <div className={styles.vignette} />
      
      <div className={styles.content}>
        <motion.div 
          className={styles.titleContainer}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <h1 className={styles.title}>AYUSH<br/>PORTFOLIO</h1>
          <div className={styles.separator} />
          <p className={styles.subtitle}>DEVELOPMENT FILE_01</p>
        </motion.div>

        <nav className={styles.menuList}>
          {MENU_ITEMS.map((item, index) => {
            const isSelected = selectedIndex === index;
            
            return (
              <motion.div
                key={item.id}
                className={`${styles.menuItem} ${isSelected ? styles.selected : ''}`}
                onMouseEnter={() => {
                  if (!isTransitioning && index !== selectedIndex) {
                    playHover();
                    setSelectedIndex(index);
                  }
                }}
                onClick={() => handleSelect(item)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={styles.indicatorContainer}>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        className={styles.indicator}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span className={styles.menuText}>{item.label}</span>
                {isSelected && (
                  <motion.div 
                    className={styles.scanline}
                    layoutId="scanline"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Screen flash transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className={styles.transitionOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
