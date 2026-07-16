// Shared mutable state for the WebGL layer. Updated from DOM listeners (Lenis
// scroll + global pointer) and read inside the R3F render loop. Using a plain
// mutable object avoids running two competing scroll/animation systems.

export const webglState = {
  scroll: 0, // 0..1 total page scroll progress (from Lenis)
  heroProgress: 0, // 0..1 progress out of the hero viewport
  px: 0, // pointer X in NDC (-1..1)
  py: 0, // pointer Y in NDC (-1..1)
  motion: 1, // 1 = full motion, 0 = reduced motion
};

let pointerInited = false;

export function initWebglPointer() {
  if (pointerInited || typeof window === "undefined") return () => {};
  pointerInited = true;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  webglState.motion = reduced ? 0 : 1;

  const onMove = (e) => {
    webglState.px = (e.clientX / window.innerWidth) * 2 - 1;
    webglState.py = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  const onScroll = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    webglState.scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    webglState.heroProgress = Math.min(1, window.scrollY / (h.clientHeight || 1));
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("scroll", onScroll);
    pointerInited = false;
  };
}
