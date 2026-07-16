import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

// Persistent, fixed canvas mounted behind all DOM content. Pointer events pass
// through to the page; the 3D reads a global pointer/scroll store instead.
export default function WebGLBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      data-testid="webgl-layer"
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 14], fov: 45 }}
        frameloop="always"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
