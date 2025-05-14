export const findClosestSnapPoint = (
  x: number,
  y: number,
  width: number,
  height: number,
  offset: number
) => {
  const margin = offset;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const snapPoints = [
    { x: margin, y: margin },
    { x: screenWidth / 2 - width / 2, y: margin },
    { x: screenWidth - width - margin, y: margin },
    { x: margin, y: screenHeight / 2 - height / 2 },
    { x: screenWidth - width - margin, y: screenHeight / 2 - height / 2 },
    { x: margin, y: screenHeight - height - margin },
    { x: screenWidth / 2 - width / 2, y: screenHeight - height - margin },
    { x: screenWidth - width - margin, y: screenHeight - height - margin },
  ];

  let closest = snapPoints[0];
  let minDist = Infinity;

  for (const point of snapPoints) {
    const dist = Math.hypot(x - point.x, y - point.y);
    if (dist < minDist) {
      minDist = dist;
      closest = point;
    }
  }

  return closest;
};
