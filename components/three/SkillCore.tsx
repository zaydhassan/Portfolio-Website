"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { useRenderActive } from "@/components/three/useRenderActive";

const ACCENT_HEX: Record<string, string> = {
  cyan: "#22d3ee",
  purple: "#a855f7",
  blue: "#3b82f6",
};

/* Central distorted orb that pulses and shifts color with the category. */
function CoreOrb({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const s = 1 + Math.sin(t * 1.6) * 0.04;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.1, 6]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.45}
        metalness={0.3}
        roughness={0.15}
        distort={0.32}
        speed={2}
      />
    </mesh>
  );
}

/* Outer wireframe shell rotating opposite. */
function Shell({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = -t * 0.18;
    ref.current.rotation.y = t * 0.12;
  });
  return (
    <Icosahedron ref={ref} args={[1.7, 1]}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.18} />
    </Icosahedron>
  );
}

/* Orbiting nodes on tilted rings. */
function Orbit({
  radius,
  speed,
  tilt,
  color,
  count,
  size,
}: {
  radius: number;
  speed: number;
  tilt: [number, number, number];
  color: string;
  count: number;
  size: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });
  return (
    <group ref={ref} rotation={tilt}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}
          >
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* Drifting particle dust. */
function Dust({ color, count = 320 }: { color: string; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Pointer parallax on the whole group. */
function Parallax({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += (pointer.x * 0.6 - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += (-pointer.y * 0.4 - ref.current.rotation.x) * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

export default function SkillCore({ accent }: { accent: "cyan" | "purple" | "blue" }) {
  const color = ACCENT_HEX[accent];
  const { ref, active } = useRenderActive<HTMLDivElement>();
  return (
    <div ref={ref} className="absolute inset-0">
    <Canvas
      className="!absolute inset-0"
      // Pause the render loop while off-screen / tab hidden — seamless visually.
      frameloop={active ? "always" : "never"}
      gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
    >
      <color attach="background" args={["#07070b"]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 3]} intensity={0.7} />
      <pointLight position={[0, 0, 2]} color={color} intensity={5} distance={9} />

      <Suspense fallback={null}>
        <Parallax>
          <CoreOrb color={color} />
          <Shell color={color} />
          <Orbit radius={1.95} speed={0.5} tilt={[1.2, 0.2, 0]} color={color} count={6} size={0.045} />
          <Orbit radius={2.4} speed={-0.35} tilt={[0.3, 1.1, 0.4]} color={color} count={9} size={0.03} />
          <Dust color={color} />
        </Parallax>
      </Suspense>
    </Canvas>
    </div>
  );
}