import { useState } from "react";

type PhotoProps = {
  /** File name without extension, loaded from /public/images/{name}.{format}. */
  name: string;
  format?: "jpg" | "jpeg" | "png";
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
};

/**
 * Loads a real photo from /public/images. Until that file exists it falls
 * back to a seeded placeholder, so every slot is filled during development.
 */
export function Photo({ name, format = "jpg", alt, width, height, className, eager = false }: PhotoProps) {
  const [missing, setMissing] = useState(false);
  const src = missing
    ? `https://picsum.photos/seed/padma-${name}/${width}/${height}`
    : `/images/${name}.${format}`;

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
