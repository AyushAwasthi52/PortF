// Read the code and mock the state changes
const projects = [
  { id: '1', x: 0, y: 0, rotation: 0, gridWidth: 2, gridHeight: 1 }
];

function getDimensions(p, rot) {
  const isSwapped = (rot % 180) !== 0;
  return {
    w: isSwapped ? p.gridHeight : p.gridWidth,
    h: isSwapped ? p.gridWidth : p.gridHeight,
  };
}

let liftedItem = { id: '1', x: 0, y: 0, rotation: 0 };
// move it
liftedItem.x = 2;
liftedItem.y = 2;
liftedItem.rotation = 90;

// attemptPlace
const nextProjects = projects.map(p => {
  if (p.id === liftedItem.id) {
    return { ...p, x: liftedItem.x, y: liftedItem.y, rotation: liftedItem.rotation };
  }
  return p;
});

console.log(nextProjects);

