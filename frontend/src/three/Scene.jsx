import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ParticleField from "./ParticleField";
import { webglState } from "./state";

// Very subtle camera parallax tied to the global pointer. No flying camera.
function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    const tx = webglState.px * 0.9 * webglState.motion;
    const ty = webglState.py * 0.6 * webglState.motion;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene() {
  return (
    <>
      <CameraRig />
      <ParticleField count={5000} />
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={0.32}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}
