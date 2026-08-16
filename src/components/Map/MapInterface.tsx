import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate, useMotionValueEvent } from 'framer-motion';
import { profilesData } from '@/data/profiles';
import { useAudio } from '@/hooks/useAudio';
import MapBackground from './MapBackground';
import MapPin from './MapPin';
import ProfilePanel from './ProfilePanel';
import styles from './MapInterface.module.css';

const MAP_WIDTH = 8000;
const MAP_HEIGHT = 4800;
const RETICLE_RADIUS = 60;

export default function MapInterface() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { playHover, playSelect } = useAudio();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(1);

  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const minScale = 0.3; // Hardcoded minimum scale

  // Center the map initially and set constraints
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      
      // Initialize map scale if it's below minScale
      let currentScale = mapScale.get();
      if (currentScale < minScale) {
        currentScale = minScale;
        mapScale.set(currentScale);
      }

      mapX.set((clientWidth - MAP_WIDTH * currentScale) / 2);
      mapY.set((clientHeight - MAP_HEIGHT * currentScale) / 2);

      setDragConstraints({
        left: clientWidth - MAP_WIDTH * currentScale,
        right: 0,
        top: clientHeight - MAP_HEIGHT * currentScale,
        bottom: 0,
      });
    }
  }, [mapX, mapY, mapScale]);

  const selectedProfile = profilesData.find(p => p.id === selectedId) || null;

  const checkCollisions = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    const centerX = clientWidth / 2;
    const centerY = clientHeight / 2;
    const scale = mapScale.get();

    let foundId: string | null = null;

    for (const profile of profilesData) {
      // With transformOrigin '0 0', the scaled position is map + (coord * scale)
      const pinScreenX = mapX.get() + profile.coordinates.x * scale;
      const pinScreenY = mapY.get() + profile.coordinates.y * scale;

      const distance = Math.hypot(pinScreenX - centerX, pinScreenY - centerY);

      if (distance <= RETICLE_RADIUS) {
        foundId = profile.id;
        break;
      }
    }

    if (foundId !== selectedId) {
      if (foundId) {
        playSelect();
      } else if (selectedId) {
        playHover();
      }
      setSelectedId(foundId);
    }
  }, [mapX, mapY, mapScale, selectedId, playSelect, playHover]);

  useMotionValueEvent(mapX, 'change', checkCollisions);
  useMotionValueEvent(mapY, 'change', checkCollisions);
  useMotionValueEvent(mapScale, 'change', checkCollisions);

  // Keyboard and Wheel handling
  useEffect(() => {
    const doZoom = (newScale: number, animateZoom: boolean) => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const oldScale = mapScale.get();
      
      // The point on the map that is currently at the center of the screen
      const mapCenterX = (clientWidth / 2 - mapX.get()) / oldScale;
      const mapCenterY = (clientHeight / 2 - mapY.get()) / oldScale;
      
      // Calculate new mapX and mapY to keep that map point at the center of the screen
      let newX = clientWidth / 2 - mapCenterX * newScale;
      let newY = clientHeight / 2 - mapCenterY * newScale;

      // Clamp newX and newY to the new drag constraints to prevent flying off screen
      const minX = clientWidth - MAP_WIDTH * newScale;
      const minY = clientHeight - MAP_HEIGHT * newScale;
      newX = Math.max(minX, Math.min(newX, 0));
      newY = Math.max(minY, Math.min(newY, 0));

      setDragConstraints({ left: minX, right: 0, top: minY, bottom: 0 });

      if (animateZoom) {
        animate(mapScale, newScale, { duration: 0.1 });
        animate(mapX, newX, { duration: 0.1 });
        animate(mapY, newY, { duration: 0.1 });
      } else {
        mapScale.set(newScale);
        mapX.set(newX);
        mapY.set(newY);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const panSpeed = 60;
      let newX = mapX.get();
      let newY = mapY.get();
      let didPan = false;

      if (e.key === 'ArrowUp') { newY += panSpeed; didPan = true; }
      if (e.key === 'ArrowDown') { newY -= panSpeed; didPan = true; }
      if (e.key === 'ArrowLeft') { newX += panSpeed; didPan = true; }
      if (e.key === 'ArrowRight') { newX -= panSpeed; didPan = true; }
      
      if (didPan) {
        // Clamp to constraints
        if (containerRef.current) {
          const { clientWidth, clientHeight } = containerRef.current;
          const currentScale = mapScale.get();
          const minX = clientWidth - MAP_WIDTH * currentScale;
          const minY = clientHeight - MAP_HEIGHT * currentScale;
          newX = Math.max(minX, Math.min(newX, 0));
          newY = Math.max(minY, Math.min(newY, 0));
        }
        animate(mapX, newX, { duration: 0.1 });
        animate(mapY, newY, { duration: 0.1 });
      }

      if (e.key.toLowerCase() === 'z') {
        doZoom(Math.min(mapScale.get() + 0.1, 2), true);
      }
      if (e.key.toLowerCase() === 'x') {
        doZoom(Math.max(mapScale.get() - 0.1, minScale), true);
      }
    };
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      let newScale = mapScale.get() - (e.deltaY * zoomSpeed);
      newScale = Math.max(minScale, Math.min(newScale, 2));
      doZoom(newScale, false);
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [mapX, mapY, mapScale, minScale]);

  return (
    <div className={styles.container} ref={containerRef}>
      
      <motion.div 
        className={styles.mapLayer}
        style={{ 
          x: mapX, 
          y: mapY, 
          scale: mapScale,
          transformOrigin: '0 0', // Crucial for correct distance math
          width: MAP_WIDTH, 
          height: MAP_HEIGHT 
        }}
        drag
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragMomentum={false}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <MapBackground width={MAP_WIDTH} height={MAP_HEIGHT} />
        
        {profilesData.map((profile) => (
          <MapPin
            key={profile.id}
            profile={profile}
            isSelected={selectedId === profile.id}
            isHovered={false}
            onHoverStart={() => {}}
            onHoverEnd={() => {}}
            onClick={() => {}}
          />
        ))}
      </motion.div>

      <div className={`${styles.crosshair} ${selectedId ? styles.active : ''}`}>
        <div className={styles.crosshairCenter} />
        <span className={styles.crosshairLabel}>
          {selectedId ? 'TARGET LOCKED' : 'SEARCHING...'}
        </span>
      </div>

      {/* Instructions HUD */}
      <div className={styles.instructions}>
        DRAG or ARROWS: Pan | SCROLL or Z/X: Zoom
      </div>

      <ProfilePanel 
        profile={selectedProfile} 
        onClose={() => {}} 
      />

    </div>
  );
}
