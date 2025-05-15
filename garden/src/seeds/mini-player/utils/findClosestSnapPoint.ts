export const findClosestSnapPoint = (
  left: number,
  top: number,
  width: number,
  height: number,
  offset: number
) => {
  const margin = offset;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const snapPoints = [
    { left: margin, top: margin },
    { left: screenWidth / 2 - width / 2, top: margin },
    { left: screenWidth - width - margin, top: margin },
    { left: margin, top: screenHeight / 2 - height / 2 },
    { left: screenWidth - width - margin, top: screenHeight / 2 - height / 2 },
    { left: margin, top: screenHeight - height - margin },
    {
      left: screenWidth / 2 - width / 2,
      top: screenHeight - height - margin,
    },
    {
      left: screenWidth - width - margin,
      top: screenHeight - height - margin,
    },
  ];

  let closest = snapPoints[0];
  let minDist = Infinity;

  for (const point of snapPoints) {
    const dist = Math.hypot(left - point.left, top - point.top);
    if (dist < minDist) {
      minDist = dist;
      closest = point;
    }
  }

  return closest;
};
