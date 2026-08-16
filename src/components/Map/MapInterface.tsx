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

  const minScale = 0.3;

  // Center the map initially
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      
      let currentScale = mapScale.get();
      if (currentScale < minScale) {
        currentScale = minScale;
        mapScale.set(currentScale);
      }

      // We want the center of the map (MAP_WIDTH/2) to be at the center of the screen (clientWidth/2)
      // Visual center X = mapX + MAP_WIDTH/2
      // We want Visual center X = clientWidth/2
      // Therefore, mapX = clientWidth/2 - MAP_WIDTH/2
      mapX.set(clientWidth / 2 - MAP_WIDTH / 2);
      mapY.set(clientHeight / 2 - MAP_HEIGHT / 2);
    }
  }, [mapX, mapY, mapScale]);

  const selectedProfile = profilesData.find(p => p.id === selectedId) || null;

  const checkCollisions = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    const screenCenterX = clientWidth / 2;
    const screenCenterY = clientHeight / 2;
    const scale = mapScale.get();

    let foundId: string | null = null;

    for (const profile of profilesData) {
      // With default transformOrigin (center), the visual center of the map is:
      const visualMapCenterX = mapX.get() + MAP_WIDTH / 2;
      const visualMapCenterY = mapY.get() + MAP_HEIGHT / 2;

      // The pin's offset from the center of the unscaled map:
      const offsetX = profile.coordinates.x - MAP_WIDTH / 2;
      const offsetY = profile.coordinates.y - MAP_HEIGHT / 2;

      // The actual visual screen coordinate of the pin:
      const pinScreenX = visualMapCenterX + (offsetX * scale);
      const pinScreenY = visualMapCenterY + (offsetY * scale);

      const distance = Math.hypot(pinScreenX - screenCenterX, pinScreenY - screenCenterY);

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
      const screenCenterX = clientWidth / 2;
      const screenCenterY = clientHeight / 2;
      
      // Calculate the map offset currently under the screen center
      const offsetX = (screenCenterX - mapX.get() - MAP_WIDTH / 2) / oldScale;
      const offsetY = (screenCenterY - mapY.get() - MAP_HEIGHT / 2) / oldScale;
      
      // Calculate new mapX/mapY so the same offset stays under the screen center
      const newX = screenCenterX - MAP_WIDTH / 2 - offsetX * newScale;
      const newY = screenCenterY - MAP_HEIGHT / 2 - offsetY * newScale;

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
  }, [mapX, mapY, mapScale]);

  return (
    <div className={styles.container} ref={containerRef}>
      
      <motion.div 
        className={styles.mapLayer}
        style={{ 
          x: mapX, 
          y: mapY, 
          scale: mapScale,
          width: MAP_WIDTH, 
          height: MAP_HEIGHT 
        }}
        drag
        dragConstraints={containerRef}
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
