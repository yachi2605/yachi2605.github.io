// Decide whether to mount the full WebGL layer. We skip it entirely on devices
// that lack WebGL2, look low-powered, or request reduced motion — no
// half-broken 3D on weak hardware.

export function canRenderWebGL() {
  if (typeof window === "undefined") return false;

  // Respect reduced-motion by still allowing static geometry, but treat very
  // constrained devices as a hard skip.
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
  } catch (e) {
    return false;
  }

  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4; // Chrome-only; defaults elsewhere
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 480;

  // Low-tier heuristic: few cores AND little memory, or a small touch screen.
  if (cores <= 2 && mem <= 2) return false;
  if (coarse && smallScreen && (cores <= 4 || mem <= 3)) return false;

  return true;
}
