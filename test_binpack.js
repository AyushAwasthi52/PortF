const GRID_ROWS = 8;
const GRID_COLS = 12;

const projectsData = [
  { id: 'proj-1', gridWidth: 2, gridHeight: 2, x: 0, y: 0 },
  { id: 'proj-2', gridWidth: 2, gridHeight: 1, x: 2, y: 0 },
  { id: 'proj-3', gridWidth: 1, gridHeight: 2, x: 4, y: 0 },
  { id: 'proj-4', gridWidth: 1, gridHeight: 1, x: 2, y: 1 },
  { id: 'proj-5', gridWidth: 1, gridHeight: 1, x: 3, y: 1 }
];

const findEmptySpace = (placedProjects, newProject) => {
  for (let y = 0; y <= GRID_ROWS - newProject.gridHeight; y++) {
    for (let x = 0; x <= GRID_COLS - newProject.gridWidth; x++) {
      let collision = false;
      for (const p of placedProjects) {
        const pDims = { w: p.gridWidth, h: p.gridHeight };
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
  return null;
};

const spot6 = findEmptySpace(projectsData, { id: 'proj-6', gridWidth: 1, gridHeight: 1 });
console.log('proj-6 spot:', spot6);

projectsData.push({ ...{ id: 'proj-6', gridWidth: 1, gridHeight: 1 }, x: spot6.x, y: spot6.y });

const spot7 = findEmptySpace(projectsData, { id: 'proj-7', gridWidth: 2, gridHeight: 1 });
console.log('proj-7 spot:', spot7);

