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
      overlay={
        // Only the logo rides on the photo, where the bar's logo will sit once the bar appears.
        <div className="px-4 pt-3 md:px-8">
          <div className="mx-auto flex h-14 max-w-[1400px] items-center pl-5">
            <a
              href="#top"
              className="inline-flex min-h-11 items-center font-display text-lg font-semibold tracking-tight text-[#f6f8f7] [text-shadow:0_1px_14px_rgb(8_16_28/0.45)]"
            >
              {site.name}
            </a>
          </div>
        </div>
      }
    >
      {/* The photo carries the hero on its own. The page still needs a heading, and the mist a strip to settle in. */}
      <h1 className="sr-only">{site.hero.headline}</h1>
      <div aria-hidden className="h-12 md:h-16" />
    </ParallaxComponent>
  );
}
