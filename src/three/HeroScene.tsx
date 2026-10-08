import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "../lib/theme";
import { createRidgeGeometry, type RidgeOptions } from "./terrain";
import { Lotus } from "./Lotus";

type Palette = {
  fog: string;
  far: string;
  mid: string;
  near: string;
  front: string;
  snow: string;
  sun: string;
  light: string;
  lightIntensity: number;
  ambient: number;
};

const PALETTES: Record<Theme, Palette> = {
  light: {
    fog: "#edf0ee",
    far: "#8fa6b8",
    mid: "#5f7f83",
    near: "#3a5a4c",
    front: "#22382f",
    snow: "#ffffff",
    sun: "#fff4e0",
    light: "#fff1dc",
    lightIntensity: 2.4,
    ambient: 0.9,
  },
  dark: {
    fog: "#0d1513",
    far: "#3b4c63",
    mid: "#24384a",
    near: "#1f3a3c",
    front: "#13262a",
    snow: "#c9d6ea",
    sun: "#e9eef7",
    light: "#b9c8ff",
    lightIntensity: 1.5,
    ambient: 0.45,
  },
};

type RidgeLayer = Omit<RidgeOptions, "base" | "snow"> & {
  tone: "far" | "mid" | "near" | "front";
  snowy: boolean;
  position: [number, number, number];
};

const LAYERS: RidgeLayer[] = [
  { tone: "far", snowy: true, seed: 3, width: 130, depth: 16, height: 17, frequency: 0.07, snowLine: 0.42, position: [0, -3, -42] },
  { tone: "mid", snowy: true, seed: 11, width: 100, depth: 14, height: 9.5, frequency: 0.09, snowLine: 0.7, position: [6, -3, -27] },
  { tone: "near", snowy: false, seed: 23, width: 70, depth: 12, height: 5, frequency: 0.12, position: [-4, -3, -14] },
  { tone: "front", snowy: false, seed: 37, width: 44, depth: 10, height: 1.8, frequency: 0.18, position: [0, -2.6, -3] },
];

function Mountains({ palette }: { palette: Palette }) {
  const geometries = useMemo(
    () =>
      LAYERS.map((layer) =>
        createRidgeGeometry({ ...layer, base: palette[layer.tone], snow: layer.snowy ? palette.snow : null }),
      ),
    [palette],
  );

  useEffect(() => () => geometries.forEach((geometry) => geometry.dispose()), [geometries]);

  return (
    <>
      {LAYERS.map((layer, i) => (
        <mesh key={layer.seed} geometry={geometries[i]} position={layer.position}>
          <meshStandardMaterial vertexColors flatShading roughness={0.95} />
        </mesh>
      ))}
    </>
  );
}

/** Moves the camera with the pointer and the first screen of scroll, so the ridges slide against each other. */
function CameraRig({ enabled }: { enabled: boolean }) {
  const camera = useThree((state) => state.camera);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useMemo(() => new THREE.Vector3(0, 0.3, -22), []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  useFrame((_, delta) => {
    if (enabled) {
      const scroll = THREE.MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1);
      const ease = 1 - Math.exp(-delta * 3);
      camera.position.x += (pointer.current.x * 1.1 - camera.position.x) * ease;
      camera.position.y += (1.2 - pointer.current.y * 0.4 + scroll * 3 - camera.position.y) * ease;
      camera.position.z += (10 - scroll * 4 - camera.position.z) * ease;
    }
    camera.lookAt(target);
  });

  return null;
}

function FloatingLotus({ animate }: { animate: boolean }) {
  const portrait = useThree((state) => state.viewport.aspect < 1);
  return (
    <group position={portrait ? [0.9, 2.2, 1] : [3.5, 2, 0]} scale={portrait ? 0.42 : 0.72} rotation-x={0.7}>
      <Float enabled={animate} speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
        <Lotus animate={animate} />
      </Float>
    </group>
  );
}

type HeroSceneProps = {
  theme: Theme;
  /** False while the hero is scrolled out of view, so the GPU can rest. */
  active: boolean;
  reducedMotion: boolean;
};

export default function HeroScene({ theme, active, reducedMotion }: HeroSceneProps) {
  const palette = PALETTES[theme];
  const animate = !reducedMotion;
  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 40, near: 0.1, far: 140, position: [0, 1.2, 10] }}
    >
      <fog attach="fog" args={[palette.fog, 20, 100]} />
      <ambientLight intensity={palette.ambient} />
      <hemisphereLight args={[palette.light, palette.front, 0.6]} />
      <directionalLight color={palette.light} intensity={palette.lightIntensity} position={[-14, 12, 6]} />

      <mesh position={[-13, 12, -60]}>
        <circleGeometry args={[theme === "dark" ? 2.2 : 3.4, 48]} />
        <meshBasicMaterial color={palette.sun} fog={false} transparent opacity={theme === "dark" ? 0.9 : 0.75} />
      </mesh>

      {theme === "dark" && <Stars radius={90} depth={30} count={1400} factor={3} fade speed={animate ? 0.6 : 0} />}

      <Mountains palette={palette} />
      <FloatingLotus animate={animate} />

      <Sparkles
        count={70}
        scale={[26, 9, 14]}
        position={[0, 2.5, -2]}
        size={2.4}
        speed={animate ? 0.25 : 0}
        opacity={theme === "dark" ? 0.7 : 0.55}
        color={theme === "dark" ? "#f3c6d5" : "#ffffff"}
      />

      <CameraRig enabled={animate} />
    </Canvas>
  );
}
