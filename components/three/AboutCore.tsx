"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useRenderActive } from "@/components/three/useRenderActive";
import { useReducedMotion } from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";

/* ----------------------------------------------------------------
   AboutCore — "AI Signal".

   One quiet, mostly-dark intelligence core: a translucent deep-purple
   glass sphere with a faint internal cyan/blue light, breathing and
   turning almost imperceptibly. Two hairline orbital rings drift
   around it; every few seconds a reasoning pulse dims the core, sends
   a soft ring outward, and briefly illuminates it before settling. A
   handful of tiny light-points float nearby and occasionally draw a
   fleeting line to the core. The card stays mostly black — the empty
   space is the design. Pointer movement is read from R3F's state
   (no React state per move) to tilt the core and shift the rings a few
   degrees. Less is more.
   ---------------------------------------------------------------- */

const SMOOTH = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/* Soft round sprite for additive points (dust + travelers + nodes). */
function useGlowSprite() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.6)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/* Four floating light-points around the core (positions in local space). */
const NODE_POS = [
  new THREE.Vector3(1.15, 0.45, 0.25),
  new THREE.Vector3(-1.05, -0.3, 0.4),
  new THREE.Vector3(0.3, 1.05, -0.35),
  new THREE.Vector3(-0.5, -0.95, -0.45),
];

function CoreScene({ compact, mobile }: { compact: boolean; mobile: boolean }) {
  const DUST = mobile ? 8 : compact ? 12 : 18;
  const NODES = mobile ? 2 : compact ? 3 : 4;
  const TRAVELERS = mobile ? 1 : 2;
  const PULSE_PERIOD = 7.2; // seconds between reasoning pulses
  const PULSE_DURATION = 2.9; // seconds the pulse is active

  const sceneRef = useRef<THREE.Group>(null);
  const coreGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const rimMatRef = useRef<THREE.ShaderMaterial>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const dustRef = useRef<THREE.Points>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const traveler1Ref = useRef<THREE.Points>(null);
  const traveler2Ref = useRef<THREE.Points>(null);
  const signalRef = useRef<THREE.Mesh>(null);
  const signalMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const nodePointsRef = useRef<THREE.Points>(null);
  const nodeLinesRef = useRef<THREE.LineSegments>(null);
  const nodeLineMatRef = useRef<THREE.LineBasicMaterial>(null);

  const { pointer } = useThree();
  const energy = useRef(0);
  const lastPointer = useRef(new THREE.Vector2());
  const pulseClock = useRef(0);

  const glow = useGlowSprite();
  const tmpColor = useMemo(() => new THREE.Color(), []);

  /* Internal dust drifting inside the core. */
  const dust = useMemo(() => {
    const pos = new Float32Array(DUST * 3);
    const col = new Float32Array(DUST * 3);
    const cA = new THREE.Color("#22d3ee");
    const cB = new THREE.Color("#a855f7");
    for (let i = 0; i < DUST; i++) {
      const r = Math.cbrt(Math.random()) * 0.38;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      const c = i % 2 === 0 ? cA : cB;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.035,
      map: glow,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      opacity: 0.7,
    });
    return { geo, mat };
  }, [DUST, glow]);

  /* Floating nodes + their fleeting connection lines to the core. */
  const nodes = useMemo(() => {
    const nodeGeo = new THREE.BufferGeometry();
    const np = new Float32Array(NODES * 3);
    const ncol = new Float32Array(NODES * 3);
    const palette = ["#22d3ee", "#a855f7", "#3b82f6", "#22d3ee"];
    for (let i = 0; i < NODES; i++) {
      const v = NODE_POS[i % NODE_POS.length];
      np[i * 3] = v.x;
      np[i * 3 + 1] = v.y;
      np[i * 3 + 2] = v.z;
      const c = new THREE.Color(palette[i % palette.length]);
      ncol[i * 3] = c.r;
      ncol[i * 3 + 1] = c.g;
      ncol[i * 3 + 2] = c.b;
    }
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(np, 3));
    nodeGeo.setAttribute("color", new THREE.BufferAttribute(ncol, 3));
    const nodeMat = new THREE.PointsMaterial({
      size: 0.07,
      map: glow,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      opacity: 0.6,
    });

    // Lines: one segment per node (node → core origin).
    const linePos = new Float32Array(NODES * 6);
    const lineCol = new Float32Array(NODES * 6);
    for (let i = 0; i < NODES; i++) {
      const v = NODE_POS[i % NODE_POS.length];
      linePos[i * 6] = v.x;
      linePos[i * 6 + 1] = v.y;
      linePos[i * 6 + 2] = v.z;
      // core origin
      linePos[i * 6 + 3] = 0;
      linePos[i * 6 + 4] = 0;
      linePos[i * 6 + 5] = 0;
    }
    const lineGeo = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePos, 3);
    const lineColAttr = new THREE.BufferAttribute(lineCol, 3);
    lineGeo.setAttribute("position", linePosAttr);
    lineGeo.setAttribute("color", lineColAttr);
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });

    return {
      nodeGeo,
      nodeMat,
      lineGeo,
      lineMat,
      lineColAttr,
      // each node "fires" on its own slow, offset rhythm
      seeds: Array.from({ length: NODES }, (_, i) => i * 2.9 + 3.1),
    };
  }, [NODES, glow]);

  /* Fresnel rim shell shader — the soft glass edge. */
  const rimUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#8b5cf6") }, uOpacity: { value: 0.3 } }),
    [],
  );
  const rimVertex = `
    varying vec3 vNormal;
    varying vec3 vView;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }
  `;
  const rimFragment = `
    varying vec3 vNormal;
    varying vec3 vView;
    uniform vec3 uColor;
    uniform float uOpacity;
    void main() {
      float f = 1.0 - max(dot(vNormal, vView), 0.0);
      f = pow(f, 2.6);
      gl_FragColor = vec4(uColor, f * uOpacity);
    }
  `;

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    // Pointer energy — spikes on movement, decays to rest. No state.
    const pdx = pointer.x - lastPointer.current.x;
    const pdy = pointer.y - lastPointer.current.y;
    energy.current = Math.min(
      1,
      energy.current * Math.exp(-dt * 1.4) + Math.sqrt(pdx * pdx + pdy * pdy) * 5,
    );
    lastPointer.current.set(pointer.x, pointer.y);

    const breath = Math.sin(t * 0.7) * 0.5 + 0.5;
    const e = energy.current;

    // Reasoning-pulse envelope (dim → illuminate → recover), very slow.
    pulseClock.current += dt;
    const since = pulseClock.current % PULSE_PERIOD;
    const active = since < PULSE_DURATION;
    const phase = active ? since / PULSE_DURATION : 1;
    let emissiveMul = 1;
    let ringProg = 0;
    if (active) {
      if (phase < 0.15) {
        emissiveMul = 1 - 0.3 * SMOOTH(0, 0.15, phase); // dim
      } else if (phase < 0.5) {
        emissiveMul = 0.7 + 0.75 * SMOOTH(0.15, 0.5, phase); // illuminate rise
      } else if (phase < 0.85) {
        emissiveMul = 1.45 - 0.75 * SMOOTH(0.5, 0.85, phase); // illuminate fall
      } else {
        emissiveMul = 0.7 + 0.3 * SMOOTH(0.85, 1, phase); // recover
      }
      ringProg = SMOOTH(0.18, 0.55, phase); // outward ring expansion window
    }
    const pulseBump = Math.max(0, emissiveMul - 1); // 0..~0.45

    // Core group: very slow spin + lean toward cursor.
    if (coreGroupRef.current) {
      coreGroupRef.current.rotation.y = t * 0.07;
      coreGroupRef.current.rotation.x +=
        (pointer.y * 0.16 - coreGroupRef.current.rotation.x) * 0.03;
      coreGroupRef.current.rotation.z +=
        (pointer.x * 0.1 - coreGroupRef.current.rotation.z) * 0.03;
    }

    // Core sphere: gentle breath + faint pulse swell.
    if (meshRef.current) {
      const s = 1 + breath * 0.022 + pulseBump * 0.04;
      meshRef.current.scale.setScalar(s);
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = 0.16 * emissiveMul + e * 0.05;
    }
    if (rimMatRef.current) {
      rimMatRef.current.uniforms.uOpacity.value =
        0.26 + breath * 0.06 + pulseBump * 0.18 + e * 0.06;
    }
    if (innerLightRef.current) {
      innerLightRef.current.intensity = 1.0 + breath * 0.3 + pulseBump * 1.1 + e * 0.4;
    }

    // Internal dust: barely-there swirl, brightens slightly with life.
    if (dustRef.current) {
      dustRef.current.rotation.y = t * 0.18;
      dustRef.current.rotation.x = Math.sin(t * 0.25) * 0.15;
      (dustRef.current.material as THREE.PointsMaterial).opacity =
        0.5 + breath * 0.12 + e * 0.15;
    }

    // Orbital rings: slow, with a few-degree pointer drift.
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.12;
      ring1Ref.current.rotation.x += (pointer.y * 0.08 - ring1Ref.current.rotation.x) * 0.02;
      ring1Ref.current.rotation.y += (pointer.x * 0.06 - ring1Ref.current.rotation.y) * 0.02;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.09;
      ring2Ref.current.rotation.x +=
        (Math.PI / 2.4 + pointer.y * 0.07 - ring2Ref.current.rotation.x) * 0.02;
      ring2Ref.current.rotation.y += (pointer.x * 0.05 - ring2Ref.current.rotation.y) * 0.02;
    }

    // Travelers: ride the rings, fading in/out so they're occasional.
    const trav1 = traveler1Ref.current;
    if (trav1) (trav1.material as THREE.PointsMaterial).opacity = 0.25 + Math.max(0, Math.sin(t * 0.45)) * 0.5;
    const trav2 = traveler2Ref.current;
    if (trav2) (trav2.material as THREE.PointsMaterial).opacity = 0.2 + Math.max(0, Math.sin(t * 0.35 + 1.5)) * 0.45;

    // Signal ring: expands outward and fades during the pulse.
    if (signalRef.current && signalMatRef.current) {
      const s = 0.32 + ringProg * 1.0;
      signalRef.current.scale.setScalar(s);
      signalMatRef.current.opacity = Math.sin(ringProg * Math.PI) * 0.22;
    }

    // Floating nodes + fleeting connections (each on its own slow rhythm).
    const nMat = nodePointsRef.current?.material as THREE.PointsMaterial | null;
    if (nMat) nMat.opacity = 0.5 + breath * 0.1;
    const lineCol = nodes.lineColAttr;
    if (lineCol && nodeLinesRef.current) {
      for (let i = 0; i < NODES; i++) {
        const localT = (t + nodes.seeds[i]) % 9; // ~9s loop
        const env = Math.sin(Math.min(1, Math.max(0, (localT - 1.5) / 0.9)) * Math.PI); // brief fade in/out
        const c = env * 0.5;
        tmpColor.set("#67e8f9").multiplyScalar(c);
        lineCol.setXYZ(i * 2, tmpColor.r, tmpColor.g, tmpColor.b);
        lineCol.setXYZ(i * 2 + 1, tmpColor.r, tmpColor.g, tmpColor.b);
      }
      lineCol.needsUpdate = true;
      (nodeLinesRef.current.material as THREE.LineBasicMaterial).opacity = 0.85;
    }
  });

  return (
    <>
      <ambientLight intensity={0.28} />
      <pointLight position={[2.5, 2.5, 3]} intensity={1.6} color="#22d3ee" />
      <pointLight position={[-2.5, -1.5, -1.5]} intensity={1.1} color="#a855f7" />

      <group ref={sceneRef} position={[0, 0.18, 0]}>
        {/* Core */}
        <group ref={coreGroupRef}>
          <mesh ref={meshRef} scale={1}>
            <icosahedronGeometry args={[0.58, 3]} />
            <MeshDistortMaterial
              ref={matRef as never}
              color="#4c1d95"
              emissive="#7c3aed"
              emissiveIntensity={0.16}
              metalness={0.4}
              roughness={0.18}
              distort={0.09}
              speed={0.5}
              transparent
              opacity={0.55}
            />
          </mesh>

          {/* Glass rim — additive Fresnel shell */}
          <mesh scale={0.62}>
            <icosahedronGeometry args={[1, 3]} />
            <shaderMaterial
              ref={rimMatRef}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.BackSide}
              uniforms={rimUniforms}
              vertexShader={rimVertex}
              fragmentShader={rimFragment}
            />
          </mesh>

          {/* Faint internal light — subtle cyan/blue from within */}
          <pointLight ref={innerLightRef} position={[0, 0, 0]} color="#3b82f6" intensity={1.0} distance={3.4} />
          {/* Internal dust */}
          <points ref={dustRef} args={[dust.geo, dust.mat]} />
        </group>

        {/* Orbital ring 1 (violet) + traveler */}
        <group ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.95, 0.0035, 8, 120]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          <points ref={traveler1Ref} position={[0.95, 0, 0]} args={[travelerGeo(glow), travelerMat(glow)]} />
        </group>

        {/* Orbital ring 2 (cyan) + traveler */}
        <group ref={ring2Ref} rotation={[Math.PI / 2.4, 0, 0]}>
          <mesh>
            <torusGeometry args={[1.18, 0.003, 8, 120]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.13} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          {TRAVELERS > 1 && (
            <points ref={traveler2Ref} position={[1.18, 0, 0]} args={[travelerGeo(glow), travelerMat(glow)]} />
          )}
        </group>

        {/* Reasoning-pulse ring — expands outward, faces the camera */}
        <mesh ref={signalRef} scale={0.32}>
          <torusGeometry args={[0.58, 0.004, 8, 96]} />
          <meshBasicMaterial
            ref={signalMatRef}
            color="#67e8f9"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Floating nodes + fleeting connection lines */}
        <points ref={nodePointsRef} args={[nodes.nodeGeo, nodes.nodeMat]} />
        <lineSegments ref={nodeLinesRef} args={[nodes.lineGeo, nodes.lineMat]} />
      </group>
    </>
  );
}

/* Tiny single-point geometry/material for orbit travelers. */
function travelerGeo(glow: THREE.Texture) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
  void glow;
  return g;
}
function travelerMat(glow: THREE.Texture) {
  return new THREE.PointsMaterial({
    size: 0.07,
    map: glow,
    transparent: true,
    color: "#e9d5ff",
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
    opacity: 0.3,
  });
}

/* ----------------------------------------------------------------
   Canvas + single telemetry overlay (top-right). Everything else
   (LLM / RAG / AGENTS / …) is intentionally gone.
   ---------------------------------------------------------------- */
export default function AboutCore() {
  const { ref, active } = useRenderActive<HTMLDivElement>();
  const reduce = useReducedMotion();
  const mobile = useMediaQuery("(max-width: 768px)");
  const compact = useMediaQuery("(max-width: 1024px)");

  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <Canvas
        className="!absolute inset-0"
        frameloop={active && !reduce ? "always" : "never"}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
        dpr={mobile ? [1, 1] : [1, 1.5]}
        camera={{ position: [0, 0, 3.4], fov: 45 }}
      >
        <Suspense fallback={null}>
          <CoreScene compact={compact} mobile={mobile} />
        </Suspense>
      </Canvas>

      {/* Top telemetry — the only on-visual label */}
      <div className="pointer-events-none absolute right-3 top-3 z-[1] hidden font-mono text-[9px] tracking-[0.18em] text-fg-subtle/50 sm:block">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan/60 animate-pulse-glow" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
          </span>
          AI CORE // ONLINE
        </span>
      </div>
    </div>
  );
}