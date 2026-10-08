import * as THREE from "three";

function hash(x: number, y: number, seed: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, seed: number): number {
  let amplitude = 0.5;
  let frequency = 1;
  let total = 0;
  for (let i = 0; i < 4; i++) {
    total += amplitude * valueNoise(x * frequency, y * frequency, seed);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return total;
}

export type RidgeOptions = {
  seed: number;
  width: number;
  depth: number;
  height: number;
  /** Lower values give broader, calmer hills. */
  frequency: number;
  base: THREE.ColorRepresentation;
  /** Snow colour, or null for a ridge below the snow line. */
  snow: THREE.ColorRepresentation | null;
  /** Fraction of the ridge height where snow starts (0-1). */
  snowLine?: number;
};

/** A low-poly mountain ridge: a strip of terrain that rises to a crest along its length. */
export function createRidgeGeometry(options: RidgeOptions): THREE.BufferGeometry {
  const { seed, width, depth, height, frequency, base, snow, snowLine = 0.55 } = options;
  const segmentsX = Math.round(width / 1.4);
  const segmentsZ = 14;
  const geometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
  geometry.rotateX(-Math.PI / 2);

  const position = geometry.attributes.position as THREE.BufferAttribute;
  const colors = new Float32Array(position.count * 3);
  const baseColor = new THREE.Color(base);
  const snowColor = snow ? new THREE.Color(snow) : null;
  const color = new THREE.Color();

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    // 0 at the front and back edges, 1 along the crest.
    const crest = Math.sin(Math.PI * (z / depth + 0.5));
    const n = fbm(x * frequency + 100, z * frequency + 100, seed);
    const h = Math.pow(n, 1.6) * 2.4 * crest * height;
    position.setY(i, h);

    color.copy(baseColor);
    if (snowColor) {
      const t = THREE.MathUtils.smoothstep(h / height, snowLine, snowLine + 0.2);
      color.lerp(snowColor, t);
    }
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}
