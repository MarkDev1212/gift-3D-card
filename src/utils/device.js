export const checkMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;
};

export const checkWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
};

/**
 * isLowEnd: true when the device has ≤4 logical CPU cores or is a known
 * low-power mobile.  Used to further strip geometry/particles.
 */
export const isLowEnd = () => {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  return checkMobile() && cores <= 4;
};

/**
 * DPR caps:
 *  - Low-end mobile  → 1.0   (saves ~56% GPU fill vs 1.5)
 *  - Mobile          → 1.0   (was 1.5 — biggest single perf win)
 *  - Desktop         → 1.5   (good visual / perf balance)
 */
export const getDPR = () => {
  if (typeof window === 'undefined') return 1;
  if (checkMobile()) return 1.0;
  return Math.min(window.devicePixelRatio || 1, 1.5);
};
