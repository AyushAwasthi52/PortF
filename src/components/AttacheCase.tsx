'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectData } from '@/data/projects';
import { useAudio } from '@/hooks/useAudio';
import styles from './AttacheCase.module.css';

const GRID_COLS = 12;
const GRID_ROWS = 8;
const CELL_SIZE = 80; 
const GAP = 4;

interface AttacheCaseProps {
  initialProjects: ProjectData[];
}

export default function AttacheCase({ initialProjects }: AttacheCaseProps) {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [inspectedProject, setInspectedProject] = useState<ProjectData | null>(null);
  
  // The item currently being moved
  const [liftedItem, setLiftedItem] = useState<{
    id: string;
    x: number;
    y: number;
    rotation: number;
  } | null>(null);

  // Keyboard navigation cursor
  const [gridCursor, setGridCursor] = useState<{ x: number, y: number } | null>(null);

  // Side menu active option (0: Examine, 1: Redirect)
  const [sideMenuHoverIndex, setSideMenuHoverIndex] = useState<number>(0);

  // Mouse hover state
  const [mouseHoveredId, setMouseHoveredId] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const { playHover, playSelect, playLift, playPlace, playRotate, playError } = useAudio();

  // Helper to calculate dimensions based on rotation
  const getDimensions = (id: string, rot: number) => {
    const p = initialProjects.find(p => p.id === id);
    if (!p) return { w: 1, h: 1, unrotatedW: 1, unrotatedH: 1 };
    const isSwapped = (rot % 180) !== 0;
    return {
      w: isSwapped ? p.gridHeight : p.gridWidth,
      h: isSwapped ? p.gridWidth : p.gridHeight,
      unrotatedW: p.gridWidth,
      unrotatedH: p.gridHeight
    };
  };

  // Helper to find first empty space for a given project size
  const findEmptySpace = (placedProjects: any[], newProject: ProjectData) => {
    for (let y = 0; y <= GRID_ROWS - newProject.gridHeight; y++) {
      for (let x = 0; x <= GRID_COLS - newProject.gridWidth; x++) {
        let collision = false;
        for (const p of placedProjects) {
          const pDims = getDimensions(p.id, p.rotation || 0);
          if (
            x < Number(p.x) + Number(pDims.w) &&
            x + newProject.gridWidth > Number(p.x) &&
            y < Number(p.y) + Number(pDims.h) &&
            y + newProject.gridHeight > Number(p.y)
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) return { x, y };
      }
    }
    return null; // No space found
  };

  // Load from localStorage or auto-place
  useEffect(() => {
    let savedLayout: any[] = [];
    const saved = localStorage.getItem('attache-layout');
    if (saved) {
      try {
        savedLayout = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved layout', e);
      }
    }

    const placedProjects: ProjectData[] = [];
    
    // First pass: Place anything with valid saved coordinates
    initialProjects.forEach(p => {
      const savedPos = savedLayout.find((sp: any) => sp.id === p.id);
      if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
        placedProjects.push({ ...p, x: savedPos.x, y: savedPos.y, rotation: savedPos.r || 0 });
      }
    });

    // Second pass: Place remaining with explicit fallback coordinates, or auto-place them
    initialProjects.forEach(p => {
      const isPlaced = placedProjects.some(placed => placed.id === p.id);
      if (!isPlaced) {
        if (p.x !== undefined && p.y !== undefined) {
          // Explicit hardcoded coordinates fallback
          placedProjects.push({ ...p, x: p.x, y: p.y, rotation: p.rotation || 0 });
        } else {
          // Auto-placement algorithm
          const spot = findEmptySpace(placedProjects, p);
          if (spot) {
            placedProjects.push({ ...p, x: spot.x, y: spot.y, rotation: 0 });
          } else {
            // Grid full! Stack at 0,0 and let user sort it out
            placedProjects.push({ ...p, x: 0, y: 0, rotation: 0 });
          }
        }
      }
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(placedProjects);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProjects]);

  // Save to localStorage
  useEffect(() => {
    const layout = projects.map(p => ({ id: p.id, x: p.x, y: p.y, r: p.rotation || 0 }));
    localStorage.setItem('attache-layout', JSON.stringify(layout));
  }, [projects]);



  const getCollisions = (dummy: {id: string, x: number, y: number, rotation: number}) => {
    const dims = getDimensions(dummy.id, dummy.rotation);
    
    // Check bounds
    if (Number(dummy.x) < 0 || Number(dummy.y) < 0) return ['OUT_OF_BOUNDS'];
    if (Number(dummy.x) + Number(dims.w) > GRID_COLS || Number(dummy.y) + Number(dims.h) > GRID_ROWS) return ['OUT_OF_BOUNDS'];

    // Check overlaps
    const collidedItemIds: string[] = [];
    for (const p of projects) {
      if (p.id !== dummy.id) {
        const pDims = getDimensions(p.id, p.rotation || 0);
        if (
          Number(dummy.x) < Number(p.x) + Number(pDims.w) &&
          Number(dummy.x) + Number(dims.w) > Number(p.x) &&
          Number(dummy.y) < Number(p.y) + Number(pDims.h) &&
          Number(dummy.y) + Number(dims.h) > Number(p.y)
        ) {
          collidedItemIds.push(p.id);
        }
      }
    }
    return collidedItemIds;
  };

  const attemptPlace = () => {
    if (!liftedItem) return;
    const collisions = getCollisions(liftedItem);
    
    if (collisions.includes('OUT_OF_BOUNDS') || collisions.length > 1) {
      playError();
      return; // Invalid placement
    }

    if (collisions.length === 1) {
      // SWAP MECHANIC
      playPlace();
      const collidedId = collisions[0];
      const collidedProject = projects.find(p => p.id === collidedId)!;
      
      // Update placed item
      setProjects(prev => prev.map(p => {
        if (p.id === liftedItem.id) {
          return { ...p, x: liftedItem.x, y: liftedItem.y, rotation: liftedItem.rotation };
        }
        return p;
      }));
      
      // Lift the collided item
      playLift();
      setLiftedItem({
        id: collidedProject.id,
        x: collidedProject.x,
        y: collidedProject.y,
        rotation: collidedProject.rotation || 0
      });
      return;
    }
    
    // Empty space placement
    playPlace();
    setProjects(prev => prev.map(p => {
      if (p.id === liftedItem.id) {
        return { ...p, x: liftedItem.x, y: liftedItem.y, rotation: liftedItem.rotation };
      }
      return p;
    }));
    setLiftedItem(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Clear grid cursor when using mouse
    if (gridCursor) setGridCursor(null);

    if (liftedItem) {
      const dims = getDimensions(liftedItem.id, liftedItem.rotation);
      const x = Math.round((mouseX - (dims.w * CELL_SIZE) / 2) / (CELL_SIZE + GAP));
      const y = Math.round((mouseY - (dims.h * CELL_SIZE) / 2) / (CELL_SIZE + GAP));
      
      const clampedX = Math.max(0, Math.min(x, GRID_COLS - dims.w));
      const clampedY = Math.max(0, Math.min(y, GRID_ROWS - dims.h));

      if (clampedX !== liftedItem.x || clampedY !== liftedItem.y) {
        setLiftedItem(prev => prev ? { ...prev, x: clampedX, y: clampedY } : null);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (inspectedProject) {
        if (e.key === 'Escape') {
          setInspectedProject(null);
          playSelect();
        }
        return; // Disable grid nav while inspecting
      }
      
      if (!liftedItem) {
        // Find if we are currently hovering an item
        const hoveredItem = mouseHoveredId
          ? projects.find(p => p.id === mouseHoveredId)
          : gridCursor ? projects.find(p => {
              const dims = getDimensions(p.id, p.rotation || 0);
              return Number(gridCursor.x) >= Number(p.x) && Number(gridCursor.x) < Number(p.x) + Number(dims.w) &&
                     Number(gridCursor.y) >= Number(p.y) && Number(gridCursor.y) < Number(p.y) + Number(dims.h);
            }) : null;

        if (hoveredItem) {
          if (e.key.toLowerCase() === 'w') {
            e.preventDefault();
            playHover();
            setSideMenuHoverIndex(prev => (prev === 0 ? 1 : 0));
            return;
          } else if (e.key.toLowerCase() === 's') {
            e.preventDefault();
            playHover();
            setSideMenuHoverIndex(prev => (prev === 1 ? 0 : 1));
            return;
          } else if (e.key === 'Tab') {
            e.preventDefault();
            playSelect();
            if (sideMenuHoverIndex === 0) {
              setInspectedProject(hoveredItem);
            } else if (sideMenuHoverIndex === 1) {
              const url = hoveredItem.githubUrl || hoveredItem.liveUrl || 'https://github.com';
              window.open(url, '_blank');
            }
            return;
          }
        }

        // Navigation mode
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          e.preventDefault();
          playHover();
          setGridCursor(prev => {
            if (!prev) return { x: 0, y: 0 };
            
            const itemUnderCursor = projects.find(p => {
              const dims = getDimensions(p.id, p.rotation || 0);
              return Number(prev.x) >= Number(p.x) && Number(prev.x) < Number(p.x) + Number(dims.w) &&
                     Number(prev.y) >= Number(p.y) && Number(prev.y) < Number(p.y) + Number(dims.h);
            });

            let newX = Number(prev.x);
            let newY = Number(prev.y);

            if (itemUnderCursor) {
              const dims = getDimensions(itemUnderCursor.id, itemUnderCursor.rotation || 0);
              const ix = Number(itemUnderCursor.x);
              const iy = Number(itemUnderCursor.y);
              const iw = Number(dims.w);
              const ih = Number(dims.h);
              
              if (e.key === 'ArrowUp') newY = Math.max(0, iy - 1);
              if (e.key === 'ArrowDown') newY = Math.min(GRID_ROWS - 1, iy + ih);
              if (e.key === 'ArrowLeft') newX = Math.max(0, ix - 1);
              if (e.key === 'ArrowRight') newX = Math.min(GRID_COLS - 1, ix + iw);
            } else {
              if (e.key === 'ArrowUp') newY = Math.max(0, newY - 1);
              if (e.key === 'ArrowDown') newY = Math.min(GRID_ROWS - 1, newY + 1);
              if (e.key === 'ArrowLeft') newX = Math.max(0, newX - 1);
              if (e.key === 'ArrowRight') newX = Math.min(GRID_COLS - 1, newX + 1);
            }
            
            return { x: newX, y: newY };
          });
        } else if (e.key === 'Enter') {
          if (gridCursor) {
            // Find item under cursor
            const itemUnderCursor = projects.find(p => {
              const dims = getDimensions(p.id, p.rotation || 0);
              return Number(gridCursor.x) >= Number(p.x) && Number(gridCursor.x) < Number(p.x) + Number(dims.w) &&
                     Number(gridCursor.y) >= Number(p.y) && Number(gridCursor.y) < Number(p.y) + Number(dims.h);
            });
            if (itemUnderCursor) {
              e.preventDefault();
              playLift();
              setLiftedItem({
                id: itemUnderCursor.id,
                x: itemUnderCursor.x,
                y: itemUnderCursor.y,
                rotation: itemUnderCursor.rotation || 0
              });
            }
          }
        }
        return;
      }

      // Lifted mode
      e.preventDefault();
      if (e.key === 'q') {
        playRotate();
        setLiftedItem(prev => {
          if (!prev) return null;
          let newRot = prev.rotation - 90;
          if (newRot < 0) newRot = 270;
          const dims = getDimensions(prev.id, newRot);
          return { 
            ...prev, 
            rotation: newRot,
            x: Math.min(prev.x, GRID_COLS - dims.w),
            y: Math.min(prev.y, GRID_ROWS - dims.h)
          };
        });
      } else if (e.key === 'e') {
        playRotate();
        setLiftedItem(prev => {
          if (!prev) return null;
          let newRot = (prev.rotation + 90) % 360;
          const dims = getDimensions(prev.id, newRot);
          return { 
            ...prev, 
            rotation: newRot,
            x: Math.min(prev.x, GRID_COLS - dims.w),
            y: Math.min(prev.y, GRID_ROWS - dims.h)
          };
        });
      } else if (e.key === 'ArrowUp') {
        setLiftedItem(prev => prev ? { ...prev, y: Math.max(0, Number(prev.y) - 1) } : null);
      } else if (e.key === 'ArrowDown') {
        setLiftedItem(prev => {
          if (!prev) return null;
          const dims = getDimensions(prev.id, prev.rotation);
          return { ...prev, y: Math.min(GRID_ROWS - dims.h, Number(prev.y) + 1) };
        });
      } else if (e.key === 'ArrowLeft') {
        setLiftedItem(prev => prev ? { ...prev, x: Math.max(0, Number(prev.x) - 1) } : null);
      } else if (e.key === 'ArrowRight') {
        setLiftedItem(prev => {
          if (!prev) return null;
          const dims = getDimensions(prev.id, prev.rotation);
          return { ...prev, x: Math.min(GRID_COLS - dims.w, Number(prev.x) + 1) };
        });
      } else if (e.key === 'Enter') {
        attemptPlace();
      } else if (e.key === 'Escape') {
        playError();
        setLiftedItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [liftedItem, projects, gridCursor, inspectedProject]);

  const gridCells = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => i);

  // Find item under cursor to visually highlight it
  const hoveredItemId = gridCursor ? projects.find(p => {
    const dims = getDimensions(p.id, p.rotation || 0);
    return Number(gridCursor.x) >= Number(p.x) && Number(gridCursor.x) < Number(p.x) + Number(dims.w) &&
           Number(gridCursor.y) >= Number(p.y) && Number(gridCursor.y) < Number(p.y) + Number(dims.h);
  })?.id : null;

  return (
    <div className={styles.wrapper}>
      <div 
        ref={boardRef}
        className={styles.caseBoard}
        style={{
          width: GRID_COLS * CELL_SIZE + (GRID_COLS - 1) * GAP,
          height: GRID_ROWS * CELL_SIZE + (GRID_ROWS - 1) * GAP,
          cursor: liftedItem ? 'none' : 'default'
        }}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          if (liftedItem) {
            if (e.target !== e.currentTarget) return;
            attemptPlace();
          }
        }}
        onMouseLeave={() => setGridCursor(null)}
      >
        <div className={styles.gridBackground}>
          {gridCells.map((i) => {
            const x = i % GRID_COLS;
            const y = Math.floor(i / GRID_COLS);
            const isCursor = gridCursor && gridCursor.x === x && gridCursor.y === y && !liftedItem;
            return (
              <div 
                key={i} 
                className={`${styles.gridCell} ${isCursor ? styles.cursorHover : ''}`} 
                style={{ width: CELL_SIZE, height: CELL_SIZE }} 
                onMouseEnter={() => {
                  if (!liftedItem) {
                    setGridCursor({ x, y });
                    setMouseHoveredId(null);
                  }
                }}
              />
            );
          })}
        </div>

        {projects.map(project => {
          const isLifted = liftedItem?.id === project.id;
          const dims = getDimensions(project.id, project.rotation || 0);
          let isHovered = mouseHoveredId === project.id;
          if (!isHovered && gridCursor) {
            isHovered = Number(gridCursor.x) >= Number(project.x) && Number(gridCursor.x) < Number(project.x) + Number(dims.w) &&
                        Number(gridCursor.y) >= Number(project.y) && Number(gridCursor.y) < Number(project.y) + Number(dims.h);
          }
          isHovered = isHovered && !liftedItem;

          return (
            <div
              key={project.id}
              className={`${styles.projectItem} ${isHovered ? styles.keyboardHover : ''} ${isLifted ? styles.lifted : ''}`}
              style={{
                left: (project.x ?? 0) * (CELL_SIZE + GAP),
                top: (project.y ?? 0) * (CELL_SIZE + GAP),
                width: dims.w * CELL_SIZE + (dims.w - 1) * GAP,
                height: dims.h * CELL_SIZE + (dims.h - 1) * GAP,
                zIndex: isHovered ? 50 : 10,
                opacity: isLifted ? 0 : 1
              }}
              onMouseEnter={() => {
                if (!liftedItem) {
                  setGridCursor({ x: project.x ?? 0, y: project.y ?? 0 });
                  setMouseHoveredId(project.id);
                  playHover();
                }
              }}
              onMouseLeave={() => setMouseHoveredId(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (liftedItem) {
                  attemptPlace();
                } else {
                  playLift();
                  setLiftedItem({
                    id: project.id,
                    x: project.x ?? 0,
                    y: project.y ?? 0,
                    rotation: project.rotation || 0
                  });
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!liftedItem) {
                  playSelect();
                  setInspectedProject(project);
                }
              }}
            >
              <div 
                className={styles.projectContent}
                style={{
                  width: dims.unrotatedW * CELL_SIZE + (dims.unrotatedW - 1) * GAP,
                  height: dims.unrotatedH * CELL_SIZE + (dims.unrotatedH - 1) * GAP,
                  transform: `rotate(${project.rotation || 0}deg)`,
                }}
              >
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.projectCategory}>{project.category}</span>
              </div>
              
              {/* Contextual Side Menu */}
              {isHovered && (
                <div 
                  className={styles.sideMenu}
                  onClick={(e) => e.stopPropagation()} // prevent lifting the item when clicking the menu
                >
                  <div 
                    className={`${styles.sideMenuOption} ${sideMenuHoverIndex === 0 ? styles.sideMenuOptionActive : ''}`}
                    onClick={() => {
                      playSelect();
                      setInspectedProject(project);
                    }}
                    onMouseEnter={() => {
                      playHover();
                      setSideMenuHoverIndex(0);
                    }}
                  >
                    EXAMINE
                  </div>
                  <div 
                    className={`${styles.sideMenuOption} ${sideMenuHoverIndex === 1 ? styles.sideMenuOptionActive : ''}`}
                    onClick={() => {
                      playSelect();
                      const url = project.githubUrl || project.liveUrl || 'https://github.com';
                      window.open(url, '_blank');
                    }}
                    onMouseEnter={() => {
                      playHover();
                      setSideMenuHoverIndex(1);
                    }}
                  >
                    REDIRECT
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Lifted Item (Ghost) */}
        {liftedItem && (() => {
          const originalProject = initialProjects.find(p => p.id === liftedItem.id)!;
          const collisions = getCollisions(liftedItem);
          const hasError = collisions.includes('OUT_OF_BOUNDS') || collisions.length > 1;
          const isSwap = collisions.length === 1 && !hasError;
          const dims = getDimensions(liftedItem.id, liftedItem.rotation);

          return (
            <div
              className={`${styles.projectItem} ${styles.lifted} ${hasError ? styles.collision : ''} ${isSwap ? styles.swapHighlight : ''}`}
              style={{
                left: (liftedItem.x ?? 0) * (CELL_SIZE + GAP),
                top: (liftedItem.y ?? 0) * (CELL_SIZE + GAP),
                width: dims.w * CELL_SIZE + (dims.w - 1) * GAP,
                height: dims.h * CELL_SIZE + (dims.h - 1) * GAP,
                pointerEvents: 'none',
                transition: 'left 0.1s, top 0.1s, width 0.15s, height 0.15s'
              }}
            >
              <div 
                className={styles.projectContent}
                style={{
                  width: dims.unrotatedW * CELL_SIZE + (dims.unrotatedW - 1) * GAP,
                  height: dims.unrotatedH * CELL_SIZE + (dims.unrotatedH - 1) * GAP,
                  transform: `rotate(${liftedItem.rotation}deg)`,
                  transition: 'transform 0.15s'
                }}
              >
                <h3 className={styles.projectTitle}>{originalProject.title}</h3>
                <span className={styles.projectCategory}>{originalProject.category}</span>
              </div>
              <div className={styles.controlsHint}>Q/E: Rotate | CLICK/ENTER: Place {isSwap ? '(SWAP)' : ''}</div>
            </div>
          );
        })()}
      </div>

      {/* Project Inspection Modal */}
      {inspectedProject && (
        <div className={styles.modalOverlay} onClick={() => setInspectedProject(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setInspectedProject(null)}>×</button>
            <div className={styles.modalHeader}>
              <h2>{inspectedProject.title}</h2>
              <span className={styles.modalCategory}>{inspectedProject.category} | {inspectedProject.year}</span>
            </div>
            
            <div className={styles.modalBody}>
              <p className={styles.modalDesc}>{inspectedProject.detailedDescription}</p>
              
              <div className={styles.techStack}>
                <h4>TECHNOLOGIES</h4>
                <div className={styles.techTags}>
                  {inspectedProject.technologies.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>

              <div className={styles.modalLinks}>
                {inspectedProject.githubUrl && (
                  <a href={inspectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    VIEW SOURCE
                  </a>
                )}
                {inspectedProject.liveUrl && (
                  <a href={inspectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    LIVE DEMO
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
