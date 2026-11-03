import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { profilesData, ProfileData } from '@/data/profiles';
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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [visitedIds, setVisitedIds] = useState<string[]>([]);
  const [showLocationsDrawer, setShowLocationsDrawer] = useState(false);
  const closedPinId = useRef<string | null>(null);

  const { playHover, playSelect } = useAudio();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mapX = useMotionValue(0);
  const mapY = useMotionValue(0);
  const mapScale = useMotionValue(0.45);

  const minScale = 0.25;

  // Center the map initially
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      
      let currentScale = mapScale.get();
      if (currentScale < minScale) {
        currentScale = minScale;
        mapScale.set(currentScale);
      }

      // Initial visual center X = mapX + MAP_WIDTH/2
      mapX.set(clientWidth / 2 - MAP_WIDTH / 2);
      mapY.set(clientHeight / 2 - MAP_HEIGHT / 2);
    }
  }, [mapX, mapY, mapScale]);

  const selectedProfile = profilesData.find(p => p.id === selectedId) || null;

  // Track visited profiles
  useEffect(() => {
    if (selectedId && !visitedIds.includes(selectedId)) {
      setVisitedIds(prev => [...prev, selectedId]);
    }
  }, [selectedId, visitedIds]);

  const checkCollisions = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    
    const screenCenterX = clientWidth / 2;
    const screenCenterY = clientHeight / 2;
    const scale = mapScale.get();

    let foundId: string | null = null;

    for (const profile of profilesData) {
      const visualMapCenterX = mapX.get() + MAP_WIDTH / 2;
      const visualMapCenterY = mapY.get() + MAP_HEIGHT / 2;

      const offsetX = profile.coordinates.x - MAP_WIDTH / 2;
      const offsetY = profile.coordinates.y - MAP_HEIGHT / 2;

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
        if (foundId !== closedPinId.current) {
          playSelect();
          setSelectedId(foundId);
        }
      } else {
        if (selectedId) {
          playHover();
        }
        closedPinId.current = null;
        setSelectedId(null);
      }
    }
  }, [mapX, mapY, mapScale, selectedId, playSelect, playHover]);

  useMotionValueEvent(mapX, 'change', checkCollisions);
  useMotionValueEvent(mapY, 'change', checkCollisions);
  useMotionValueEvent(mapScale, 'change', checkCollisions);

  // Zoom logic
  const doZoom = useCallback((newScale: number, animateZoom: boolean) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const oldScale = mapScale.get();
    const screenCenterX = clientWidth / 2;
    const screenCenterY = clientHeight / 2;
    
    const offsetX = (screenCenterX - mapX.get() - MAP_WIDTH / 2) / oldScale;
    const offsetY = (screenCenterY - mapY.get() - MAP_HEIGHT / 2) / oldScale;
    
    const newX = screenCenterX - MAP_WIDTH / 2 - offsetX * newScale;
    const newY = screenCenterY - MAP_HEIGHT / 2 - offsetY * newScale;

    if (animateZoom) {
      animate(mapScale, newScale, { duration: 0.15 });
      animate(mapX, newX, { duration: 0.15 });
      animate(mapY, newY, { duration: 0.15 });
    } else {
      mapScale.set(newScale);
      mapX.set(newX);
      mapY.set(newY);
    }
  }, [mapScale, mapX, mapY]);

  // Focus Camera onto a Specific Pin
  const focusPin = useCallback((profile: ProfileData, targetZoom?: number) => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const currentScale = mapScale.get();
    const scale = targetZoom ?? Math.max(currentScale, 0.65);

    const targetX = (clientWidth / 2) - (MAP_WIDTH / 2) - (profile.coordinates.x - MAP_WIDTH / 2) * scale;
    const targetY = (clientHeight / 2) - (MAP_HEIGHT / 2) - (profile.coordinates.y - MAP_HEIGHT / 2) * scale;

    playSelect();
    closedPinId.current = null;
    setSelectedId(profile.id);

    animate(mapScale, scale, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    animate(mapX, targetX, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    animate(mapY, targetY, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
  }, [mapScale, mapX, mapY, playSelect]);

  // Recenter Map
  const handleRecenter = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const defaultScale = 0.45;
    const targetX = clientWidth / 2 - MAP_WIDTH / 2;
    const targetY = clientHeight / 2 - MAP_HEIGHT / 2;
    playHover();
    closedPinId.current = null;
    setSelectedId(null);
    animate(mapScale, defaultScale, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    animate(mapX, targetX, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    animate(mapY, targetY, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
  }, [mapScale, mapX, mapY, playHover]);

  const handleZoomIn = useCallback(() => {
    playHover();
    doZoom(Math.min(mapScale.get() + 0.15, 2), true);
  }, [mapScale, doZoom, playHover]);

  const handleZoomOut = useCallback(() => {
    playHover();
    doZoom(Math.max(mapScale.get() - 0.15, minScale), true);
  }, [mapScale, doZoom, playHover, minScale]);

  // Keyboard and Wheel handling
  useEffect(() => {
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

      if (e.key.toLowerCase() === 'z' || e.key === '+') {
        doZoom(Math.min(mapScale.get() + 0.1, 2), true);
      }
      if (e.key.toLowerCase() === 'x' || e.key === '-') {
        doZoom(Math.max(mapScale.get() - 0.1, minScale), true);
      }
      if (e.key.toLowerCase() === 'l' || e.key.toLowerCase() === 'm') {
        playHover();
        setShowLocationsDrawer(prev => !prev);
      }
      if (e.key === 'Escape') {
        if (selectedId) {
          playHover();
          closedPinId.current = selectedId;
          setSelectedId(null);
        } else if (showLocationsDrawer) {
          playHover();
          setShowLocationsDrawer(false);
        }
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
  }, [mapX, mapY, mapScale, doZoom, playHover, selectedId, showLocationsDrawer, minScale]);

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
            isHovered={hoveredId === profile.id}
            isVisited={visitedIds.includes(profile.id)}
            onHoverStart={() => {
              playHover();
              setHoveredId(profile.id);
            }}
            onHoverEnd={() => {
              setHoveredId(null);
            }}
            onClick={() => {
              focusPin(profile);
            }}
          />
        ))}
      </motion.div>

      {/* Screen Center Crosshair Reticle */}
      <div className={`${styles.crosshair} ${selectedId ? styles.active : ''}`}>
        <div className={styles.crosshairCenter} />
        <span className={styles.crosshairLabel}>
          {selectedProfile ? `LOCKED // ${selectedProfile.name.toUpperCase()}` : 'SCANNING MAP...'}
        </span>
      </div>

      {/* On-screen Tactical Controls HUD */}
      <div className={styles.controlsHud}>
        <button 
          className={`${styles.hudButton} ${showLocationsDrawer ? styles.active : ''}`}
          onClick={() => {
            playHover();
            setShowLocationsDrawer(!showLocationsDrawer);
          }}
          aria-label="Toggle Tactical Locations Directory"
        >
          <span>☰</span>
          <span>LOCATIONS [{profilesData.length}]</span>
        </button>
        
        <button 
          className={styles.hudButton}
          onClick={handleRecenter}
          title="Recenter Map View"
          aria-label="Recenter Map"
        >
          <span>⌖</span>
          <span>RECENTER</span>
        </button>

        <div className={styles.zoomButtonGroup}>
          <button 
            className={styles.zoomButton} 
            onClick={handleZoomIn} 
            title="Zoom In (+ / Z)"
            aria-label="Zoom In"
          >
            +
          </button>
          <button 
            className={styles.zoomButton} 
            onClick={handleZoomOut} 
            title="Zoom Out (- / X)"
            aria-label="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* Tactical Locations Directory Drawer */}
      <AnimatePresence>
        {showLocationsDrawer && (
          <motion.div 
            className={styles.locationsDrawer}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="region"
            aria-label="Locations Directory"
          >
            <div className={styles.drawerHeader}>
              <div className={styles.drawerHeaderLeft}>
                <span className={styles.drawerTitle}>TACTICAL DIRECTORY</span>
                <span className={styles.exploredCount}>EXPLORED // {visitedIds.length}/{profilesData.length}</span>
              </div>
              <button 
                className={styles.drawerClose}
                onClick={() => {
                  playHover();
                  setShowLocationsDrawer(false);
                }}
                aria-label="Close Directory"
              >
                ✕
              </button>
            </div>

            <div className={styles.locationsList}>
              {profilesData.map((p, idx) => {
                const isVisited = visitedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    className={`${styles.locationItem} ${selectedId === p.id ? styles.active : ''}`}
                    onMouseEnter={() => {
                      playHover();
                      setHoveredId(p.id);
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => {
                      focusPin(p);
                    }}
                  >
                    <div className={styles.locationItemLeft}>
                      <span className={styles.locationIndex}>{isVisited ? '✓' : '○'} 0{idx + 1}</span>
                      <span className={styles.locationName}>{p.name}</span>
                    </div>
                    <span className={styles.locationCategory}>{p.category}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric Viewport Compass */}
      <div className={styles.compass} aria-hidden="true">
        <div className={styles.compassN}>N</div>
        <div className={styles.compassCross}>
          <div className={styles.compassW}>W</div>
          <div className={styles.compassCenter}>+</div>
          <div className={styles.compassE}>E</div>
        </div>
        <div className={styles.compassS}>S</div>
      </div>

      {/* Control Instructions */}
      <div className={styles.instructions}>
        DRAG or ARROWS: Pan | SCROLL or Z/X: Zoom | L: Locations | ESC: Close
      </div>

      {/* Selected Profile Detail Panel */}
      <ProfilePanel 
        profile={selectedProfile} 
        onClose={() => {
          playHover();
          closedPinId.current = selectedId;
          setSelectedId(null);
        }} 
      />

    </div>
  );
}
