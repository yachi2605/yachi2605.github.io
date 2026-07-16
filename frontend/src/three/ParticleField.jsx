import React, { useMemo, useRef } from "react";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { webglState } from "./state";

// Ashima 3D simplex noise (public domain) for in-shader color + displacement.
const SNOISE = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const ParticleMaterial = shaderMaterial(
  {
    uTime: 0,
    uScroll: 0,
    uMotion: 1,
    uPointer: new THREE.Vector3(),
    uColorA: new THREE.Color("#5B73FF"),
    uColorB: new THREE.Color("#4ADE80"),
    uOpacity: 1,
  },
  // vertex
  `
  uniform float uTime;
  uniform float uScroll;
  uniform float uMotion;
  uniform vec3 uPointer;
  attribute float aScale;
  attribute vec3 aSeed;
  varying float vMix;
  varying float vFade;
  ${SNOISE}
  void main(){
    vec3 pos = position;
    float t = uTime * 0.12;
    // ambient organic drift
    pos.x += sin(t + aSeed.x * 6.2831) * 0.35 * uMotion;
    pos.y += cos(t * 1.1 + aSeed.y * 6.2831) * 0.35 * uMotion;
    pos.z += sin(t * 0.8 + aSeed.z * 6.2831) * 0.35 * uMotion;

    // cursor repel in the XY plane
    vec2 dir = pos.xy - uPointer.xy;
    float d = length(dir);
    float force = smoothstep(3.2, 0.0, d) * 2.4 * uMotion;
    pos.xy += normalize(dir + 0.0001) * force;

    // recede + condense as the hero scrolls away
    pos.z -= uScroll * 7.0;
    pos.xy *= (1.0 - uScroll * 0.35);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = aScale * (250.0 / max(-mv.z, 0.001));
    gl_PointSize = size * (1.0 - uScroll * 0.4);

    vMix = snoise(pos * 0.14 + t * 0.25) * 0.5 + 0.5;
    vFade = 1.0 - smoothstep(0.0, 0.85, uScroll);
  }
  `,
  // fragment
  `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vMix;
  varying float vFade;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float dd = length(c);
    if (dd > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dd);
    vec3 col = mix(uColorA, uColorB, smoothstep(0.4, 0.8, vMix));
    gl_FragColor = vec4(col, alpha * 0.4 * vFade * uOpacity);
  }
  `
);

extend({ ParticleMaterial });

export default function ParticleField({ count = 5000 }) {
  const matRef = useRef();
  const smooth = useRef(new THREE.Vector3());

  const { positions, scales, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a wide, shallow slab facing the camera.
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scales[i] = Math.random() * 1.4 + 0.3;
      seeds[i * 3] = Math.random();
      seeds[i * 3 + 1] = Math.random();
      seeds[i * 3 + 2] = Math.random();
    }
    return { positions, scales, seeds };
  }, [count]);

  useFrame((stateThree, delta) => {
    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value += delta * webglState.motion;
    m.uniforms.uScroll.value = webglState.heroProgress;
    m.uniforms.uMotion.value = webglState.motion;

    // map global pointer (NDC) to world position on the z=0 plane
    const { viewport } = stateThree;
    const targetX = webglState.px * (viewport.width / 2);
    const targetY = webglState.py * (viewport.height / 2);
    smooth.current.x += (targetX - smooth.current.x) * 0.08;
    smooth.current.y += (targetY - smooth.current.y) * 0.08;
    m.uniforms.uPointer.value.set(smooth.current.x, smooth.current.y, 0);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 3]} />
      </bufferGeometry>
      <particleMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
