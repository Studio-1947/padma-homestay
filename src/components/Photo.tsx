import { useState } from "react";

type PhotoProps = {
  /** File name without extension, loaded from /public/images/{name}.{format}. */
  name: string;
  format?: "jpg" | "jpeg" | "png" | "webp";
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
};

/**
 * Stand-in photos (picsum.photos ids) picked to look like the hills, so the page reads
 * right before the real photos arrive. A slot not listed here gets a random one.
 */
const PLACEHOLDER_ID: Record<string, number> = {
};

function placeholder(name: string, width: number, height: number) {
  const id = PLACEHOLDER_ID[name];
  return id === undefined
    ? `https://picsum.photos/seed/padma-${name}/${width}/${height}`
    : `https://picsum.photos/id/${id}/${width}/${height}`;
}

/**
 * Loads a real photo from /public/images. Until that file exists it falls
 * back to a placeholder, so every slot is filled during development.
 */
export function Photo({ name, format = "jpg", alt, width, height, className, eager = false }: PhotoProps) {
  const [missing, setMissing] = useState(false);
  const src = missing ? placeholder(name, width, height) : `/images/${name}.${format}`;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setMissing(true)}
      className={className}
    />
  );
}
