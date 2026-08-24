// Each room expands along the Z-axis:
// Room 1: Z [-3.5 to 2.5]
// Room 2: Z [-11.5 to -4.5]
// Room 3: Z [-19.5 to -12.5]
// Room 4 (Surprise): Z [-27.5 to -20.5]

export const checkCollision = (newX, newZ, unlockedRooms) => {
  // Outer Side Walls Check (X boundary)
  if (newX < -2.6 || newX > 2.6) return true;

  // Front Wall Boundary (Room 1 back)
  if (newZ > 2.2) return true;

  // Room 1 to 2 Doorway Check
  if (newZ < -3.5 && unlockedRooms < 2) return true;

  // Room 2 to 3 Doorway Check
  if (newZ < -11.5 && unlockedRooms < 3) return true;

  // Room 3 to 4 (Surprise Room) Doorway Check
  if (newZ < -19.5 && unlockedRooms < 4) return true;

  // Final Wall Boundary (Room 4 back)
  if (newZ < -27.5) return true;

  return false;
};