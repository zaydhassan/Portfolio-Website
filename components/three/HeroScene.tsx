"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useRenderActive } from "@/components/three/useRenderActive";

/* ----------------------------------------------------------------
   Particle field — drifting additive points
   ---------------------------------------------------------------- */
function ParticleField({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi) - 4;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.1;
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
        size={0.035}
        color="#9bb8ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ----------------------------------------------------------------
   Neural network — nodes + connections with a traveling pulse
   ---------------------------------------------------------------- */
function NeuralNetwork({ nodeCount = 26 }: { nodeCount?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const nodeMatRef = useRef<THREE.PointsMaterial>(null);

  const { nodes, edges } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const r = 2.2 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodes.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi) - 2,
        ),
      );
    }
    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        dists.push({ j, d: nodes[i].distanceTo(nodes[j]) });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let k = 0; k < 2; k++) {
        const j = dists[k].j;
        if (j > i) edges.push([i, j]);
      }
    }
    return { nodes, edges };
  }, [nodeCount]);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    edges.forEach(([a, b]) => {
      arr.push(nodes[a].x, nodes[a].y, nodes[a].z);
      arr.push(nodes[b].x, nodes[b].y, nodes[b].z);
    });
    return new Float32Array(arr);
  }, [edges, nodes]);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;
    }
    if (lineMatRef.current) {
      lineMatRef.current.opacity = 0.18 + Math.sin(t * 1.4) * 0.12;
    }
    if (nodeMatRef.current) {
      nodeMatRef.current.opacity = 0.85 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#7aa2ff"
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
            count={nodePositions.length / 3}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={nodeMatRef}
          size={0.09}
          color="#a78bfa"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ----------------------------------------------------------------
   Glass orbs — distortion spheres with emissive tint
   ---------------------------------------------------------------- */
function GlassOrb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh position={position} scale={scale}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.1}
          distort={0.35}
          speed={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      <pointLight position={position} color={color} intensity={6} distance={10} />
    </Float>
  );
}

/* ----------------------------------------------------------------
   Wireframe ring — subtle rotating geometry
   ---------------------------------------------------------------- */
function WireRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
  });
  return (
    <Icosahedron ref={ref} args={[3.4, 1]} position={[0, 0, -3]}>
      <meshBasicMaterial
        color="#22d3ee"
        wireframe
        transparent
        opacity={0.08}
      />
    </Icosahedron>
  );
}

/* ----------------------------------------------------------------
   Camera rig — gentle parallax toward pointer
   ---------------------------------------------------------------- */
function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 1.0 + 0.2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, -3);
  });
  return null;
}

/* ----------------------------------------------------------------
   Scene wrapper
   ---------------------------------------------------------------- */
export default function HeroScene() {
  const { theme } = useTheme();
  const { ref, active } = useRenderActive<HTMLDivElement>();

  // Scene background tracks the active theme so the canvas matches the
  // surrounding `bg-bg` section and the top/bottom fade gradients. Matches
  // the --bg token (dark: #050505, light: #fafafa) to avoid a visible seam.
  const bg = theme === "light" ? "#fafafa" : "#050505";

  return (
    <div ref={ref} className="absolute inset-0">
    <Canvas
      className="!absolute inset-0"
      // Pause the render loop while the canvas is off-screen or the tab is
      // in the background — visually seamless, big main-thread saving.
      frameloop={active ? "always" : "never"}
      gl={{ powerPreference: "high-performance", antialias: false, alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 7], fov: 50 }}
    >
      {/* Scene background + fog follow the theme so the canvas never stays
          black in light mode (and never composites to white in dark mode). */}
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 7, 19]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={0.8} />
      <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#a78bfa" />

      <Suspense fallback={null}>
        <ParticleField />
        <NeuralNetwork />
        <WireRing />
        <GlassOrb position={[-2.6, 1.4, -1]} color="#22d3ee" scale={0.7} speed={1.2} />
        <GlassOrb position={[2.8, -0.8, -1.5]} color="#a855f7" scale={0.95} speed={1.5} />
        <GlassOrb position={[0.4, 1.8, -3]} color="#3b82f6" scale={0.55} speed={1.8} />
      </Suspense>

      <CameraRig />
    </Canvas>
    </div>
  );
}