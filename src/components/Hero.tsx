import { site } from "../content/site";
import { ParallaxComponent } from "./ui/parallax-scrolling";

// The Dhotrey photo cut into three depth layers (see public/images/README.md).
const DHOTREY_LAYERS = {
  back: "/images/dhotrey-layer-back.webp",
  middle: "/images/dhotrey-layer-middle.webp",
  front: "/images/dhotrey-layer-front.webp",
};

export function Hero() {
  return (
    <ParallaxComponent
      id="top"
      title="Dhotrey"
      titleGraphicSrc="/images/DHOTREY.svg"
      images={DHOTREY_LAYERS}
      className="parallax--padma"
      titleMode="reveal"
    >
      {/* The photo carries the hero on its own. The page still needs a heading, and the mist a strip to settle in. */}
      <h1 className="sr-only">{site.hero.headline}</h1>
      <div aria-hidden className="h-12 md:h-16" />
    </ParallaxComponent>
  );
}
