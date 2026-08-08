"use client";

import { Suspense, useMemo, useRef, useEffect, type ComponentRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRenderActive } from "@/components/three/useRenderActive";

/* ----------------------------------------------------------------
   AI Core — the rotating, pulsing, touch- & tilt-reactive centerpiece.
   A distorted purple icosahedron emits an additive particle halo and is
   wrapped in two slow energy rings. Any tap flares a `burst`; device
   tilt (Android) and pointer/touch parallax tilt the core. A mount burst
   fires the "activation" flare when the menu opens.
   ---------------------------------------------------------------- */
function AICoreScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const haloRef = useRef<THREE.Points>(null);
  const haloMatRef = useRef<THREE.PointsMaterial>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  // Burst decays from 1→0 over ~0.45s after any pointerdown; drives the
  // emissive/scale/halo flare. A ref (not state) so useFrame mutates it
  // without triggering React renders.
  const burstRef = useRef(0);
  // Device-tilt (Android); inert on iOS where no permission is requested.
  const tiltRef = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  // Activation flare on mount + respond to any tap while open.
  useEffect(() => {
    burstRef.current = 1;
    const onDown = () => {
      burstRef.current = 1;
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // Device orientation — attached unconditionally. Fires freely on
  // Android; silently inert on iOS (we deliberately skip the permission
  // prompt to avoid intrusive UX; pointer/touch still drives tilt there).
  useEffect(() => {
    const onOrient = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left-right [-90, 90]
      const beta = e.beta ?? 0; // front-back [-180, 180]
      tiltRef.current.x = Math.max(-1, Math.min(1, gamma / 35));
      tiltRef.current.y = Math.max(-1, Math.min(1, (beta - 30) / 35));
    };
    window.addEventListener("deviceorientation", onOrient, true);
    return () => window.removeEventListener("deviceorientation", onOrient, true);
  }, []);

  const haloPositions = useMemo(() => {
    /* eslint-disable react-hooks/purity */
    const COUNT = 460;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 1.5 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
    /* eslint-enable react-hooks/purity */
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const burst = burstRef.current;
    if (burst > 0) burstRef.current = Math.max(0, burst - delta * 2.2);
    // Slow ~4s breath (0..1) layered under the faster pulse.
    const breath = Math.sin(t * (Math.PI / 2)) * 0.5 + 0.5;
    const tiltX = tiltRef.current.y * 0.3;
    const tiltY = tiltRef.current.x * 0.3;

    // Core: slow spin + pointer/tilt parallax + breath & burst scale.
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.28;
      meshRef.current.rotation.x =
        pointer.y * 0.35 + tiltX + Math.sin(t * 0.4) * 0.1;
      meshRef.current.rotation.z = pointer.x * 0.18 + tiltY;
      meshRef.current.scale.setScalar(1.2 + breath * 0.06 + burst * 0.18);
    }

    // Emissive: fast pulse + slow breath; burst spikes both.
    if (matRef.current) {
      const base = 0.5 + Math.sin(t * 1.6) * 0.2 + breath * 0.22;
      matRef.current.emissiveIntensity = base + burst * 1.4;
      matRef.current.distort = 0.3 + Math.sin(t * 1.1) * 0.05 + burst * 0.14;
    }

    // Tinted key light flares with the burst for a bloom-glow feel.
    if (lightRef.current) {
      lightRef.current.intensity =
        6 + Math.sin(t * 1.6) * 2.5 + breath * 2 + burst * 16;
    }

    // Halo: drift + expand outward on burst (the "emit" motion).
    if (haloRef.current) {
      haloRef.current.rotation.y = t * 0.12;
      haloRef.current.rotation.x = Math.sin(t * 0.25) * 0.2;
      haloRef.current.scale.setScalar(1 + burst * 0.5);
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = 0.55 + Math.sin(t * 2) * 0.15 + burst * 0.35;
    }

    // Energy rings — counter-rotating, slightly tilted planes.
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.35;
      ring1Ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.12;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.25;
      ring2Ref.current.rotation.x = Math.PI / 2.3;
      ring2Ref.current.rotation.y = Math.sin(t * 0.2) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 4]} intensity={6} color="#22d3ee" />
      <pointLight position={[-3, -2, -2]} intensity={4} color="#a855f7" />

      <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.8}>
        <mesh ref={meshRef} scale={1.2}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            ref={matRef}
            color="#6d28d9"
            emissive="#9333ea"
            emissiveIntensity={0.5}
            metalness={0.65}
            roughness={0.12}
            distort={0.3}
            speed={1.4}
            transparent
            opacity={0.94}
          />
        </mesh>
        <pointLight
          ref={lightRef}
          position={[0, 0, 2]}
          color="#a855f7"
          intensity={6}
          distance={9}
        />
      </Float>

      {/* Energy rings — additive, no depth write, cheap. */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.4, 0.012, 8, 96]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.7, 0.008, 8, 96]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Emitted energy halo — additive, no depth write. */}
      <points ref={haloRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[haloPositions, 3]}
            count={haloPositions.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={haloMatRef}
          size={0.045}
          color="#c4b5fd"
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

/* ----------------------------------------------------------------
   Canvas wrapper — transparent over the glass panel, frameloop gated
   to render only while the menu is open AND the canvas is on-screen.
   ---------------------------------------------------------------- */
export default function AICore({ open }: { open: boolean }) {
  const { ref, active } = useRenderActive<HTMLDivElement>();

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        className="!absolute inset-0"
        frameloop={open && active ? "always" : "never"}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.8], fov: 45 }}
      >
        <Suspense fallback={null}>
          <AICoreScene />
        </Suspense>
      </Canvas>
    </div>
  );
}