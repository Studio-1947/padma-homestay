import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Theme } from "../lib/theme";

const PHOTO = "/images/dhotrey.png";
// Depth map generated from the photo with Depth Anything V2 (white = near, black = far).
const DEPTH = "/images/dhotrey-depth.png";

/** How far the nearest pixels slide, as a fraction of the image, at full pointer deflection. */
const POINTER_STRENGTH = 0.022;
const SCROLL_STRENGTH = 0.03;
/** Zoom in slightly so shifted pixels never reveal the image edge. */
const EDGE_MARGIN = 0.93;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uImage;
  uniform sampler2D uDepth;
  uniform vec2 uOffset;
  uniform vec2 uCover;
  uniform float uNight;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;

    // Slide each pixel by its depth. A few refinement steps keep tree edges from smearing.
    vec2 shifted = uv;
    for (int i = 0; i < 3; i++) {
      float depth = texture2D(uDepth, shifted).r;
      shifted = uv + uOffset * (depth - 0.25);
    }

    vec3 color = texture2D(uImage, shifted).rgb;

    // Day-for-night grade for the dark theme: desaturate, cool and dim.
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    vec3 night = mix(vec3(luma), color, 0.35) * vec3(0.2, 0.27, 0.42);
    color = mix(color, night, uNight);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

function DepthPhoto({ theme, animate }: { theme: Theme; animate: boolean }) {
  const [image, depth] = useTexture([PHOTO, DEPTH], (textures) => {
    textures[0].colorSpace = THREE.SRGBColorSpace;
    textures[1].colorSpace = THREE.NoColorSpace;
  });
  const size = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const pointer = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uImage: { value: image },
      uDepth: { value: depth },
      uOffset: { value: new THREE.Vector2() },
      uCover: { value: new THREE.Vector2(1, 1) },
      uNight: { value: 0 },
    }),
    [image, depth],
  );

  const material = useRef<THREE.ShaderMaterial>(null);

  // Re-render once when the theme or viewport changes, even while the frame loop is idle.
  useEffect(() => invalidate(), [theme, size, invalidate]);

  useEffect(() => {
    if (!animate) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  useFrame((_, delta) => {
    const live = material.current?.uniforms;
    if (!live) return;

    // "object-fit: cover" for the photo, whatever the viewport shape.
    const photo = image.image as { width: number; height: number };
    const viewAspect = size.width / size.height;
    const photoAspect = photo.width / photo.height;
    (live.uCover.value as THREE.Vector2)
      .set(Math.min(1, viewAspect / photoAspect), Math.min(1, photoAspect / viewAspect))
      .multiplyScalar(EDGE_MARGIN);
    live.uNight.value = theme === "dark" ? 1 : 0;

    if (!animate) return;
    const scroll = THREE.MathUtils.clamp(window.scrollY / window.innerHeight, 0, 1);
    const ease = 1 - Math.exp(-delta * 4);
    const offset = live.uOffset.value as THREE.Vector2;
    offset.x += (pointer.current.x * POINTER_STRENGTH - offset.x) * ease;
    offset.y += (-pointer.current.y * POINTER_STRENGTH * 0.6 + scroll * SCROLL_STRENGTH - offset.y) * ease;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} depthTest={false} />
    </mesh>
  );
}

type PhotoDepthSceneProps = {
  theme: Theme;
  /** False while the hero is scrolled out of view, so the GPU can rest. */
  active: boolean;
  reducedMotion: boolean;
};

/** The Dhotrey photo pushed into relief with a depth map, so near trees move against the far peaks. */
export default function PhotoDepthScene({ theme, active, reducedMotion }: PhotoDepthSceneProps) {
  const frameloop = reducedMotion ? "demand" : active ? "always" : "never";
  return (
    <Canvas flat frameloop={frameloop} dpr={[1, 1.75]} gl={{ antialias: false, powerPreference: "high-performance" }}>
      <DepthPhoto theme={theme} animate={!reducedMotion} />
    </Canvas>
  );
}
