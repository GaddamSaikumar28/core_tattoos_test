
export const getDistance = (touches: React.TouchList): number => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};
 
/**
 * Returns the angle (degrees) of the line connecting two touch points.
 * Used to compute a two-finger rotation delta.
 */
export const getAngle = (touches: React.TouchList): number => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};
 