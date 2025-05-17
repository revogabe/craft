export const findClosestSnapPoint = (
  left: number,
  top: number,
  width: number,
  height: number,
  gutter: number
) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const snapPoints = [
    { left: gutter, top: gutter },
    { left: screenWidth / 2 - width / 2, top: gutter },
    { left: screenWidth - width - gutter, top: gutter },
    { left: gutter, top: screenHeight / 2 - height / 2 },
    { left: screenWidth - width - gutter, top: screenHeight / 2 - height / 2 },
    { left: gutter, top: screenHeight - height - gutter },
    {
      left: screenWidth / 2 - width / 2,
      top: screenHeight - height - gutter,
    },
    {
      left: screenWidth - width - gutter,
      top: screenHeight - height - gutter,
    },
  ];

  let closest = snapPoints[gutter];
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
