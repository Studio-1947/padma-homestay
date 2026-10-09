import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

// The Dhotrey photo cut into three depth layers (see public/images/README.md).
const DHOTREY_LAYERS = {
  back: "/images/dhotrey-layer-back.webp",
  middle: "/images/dhotrey-layer-middle.webp",
  front: "/images/dhotrey-layer-front.webp",
};

export default function ParallaxDemo() {
  return (
    <ParallaxComponent title="Dhotrey" images={DHOTREY_LAYERS} className="parallax--padma" titleMode="reveal" />
  );
}
