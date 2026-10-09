import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./parallax-scrolling.css";

gsap.registerPlugin(ScrollTrigger);

// How far each layer travels while the header scrolls out. Higher = feels further away.
const LAYER_TRAVEL = [
  { layer: "1", yPercent: 70 },
  { layer: "2", yPercent: 55 },
  { layer: "3", yPercent: 40 },
  { layer: "4", yPercent: 6 },
];

/**
 * Title travel in "reveal" mode, in percent of the viewport height. It begins close to
 * the skyline, then clears the middle layer early in the scroll.
 */
const TITLE_REVEAL = { from: 16, to: -36 };

const DEFAULT_IMAGES = {
  back: "https://cdn.21st.dev/assets/mirror/a4/a43f4eae3459c461345ee676f12d6e1ddca65e8a5279a5af00d475b17ff83aea.webp",
  middle: "https://cdn.21st.dev/assets/mirror/50/50ca6a0d36d2780bfcb469d6db7eaec0be7e0d2961ba69a63d2a1473b040338d.webp",
  front: "https://cdn.21st.dev/assets/mirror/e1/e1c8137b5f971c3b3ec1a0f9e79b9c17018767005f844a10082b890472afecfb.webp",
};

type ParallaxComponentProps = {
  title?: string;
  /** Layer images from furthest to nearest. */
  images?: { back: string; middle: string; front: string };
  /** Lenis smooth scrolling for the whole page while this component is mounted. */
  smoothScroll?: boolean;
  /**
   * "between" (default): the title sits between the middle and front layers.
   * "reveal": the title starts hidden behind the middle layer and rises out of it on scroll.
   */
  titleMode?: "between" | "reveal";
  /** Extra class on the root, for example a theme that overrides the --parallax-* properties. */
  className?: string;
};

export function ParallaxComponent({
  title = "Parallax",
  images = DEFAULT_IMAGES,
  smoothScroll = true,
  titleMode = "between",
  className,
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Layout effect, so the title is already in its hidden start position on the first paint.
  useLayoutEffect(() => {
    const root = parallaxRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // gsap.context scopes the selectors and lets cleanup revert only the animations made here.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-parallax-layers]",
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0,
        },
      });

      LAYER_TRAVEL.forEach(({ layer, yPercent }, idx) => {
        const target = `[data-parallax-layer="${layer}"]`;
        const position = idx === 0 ? undefined : "<";
        if (layer === "3" && titleMode === "reveal") {
          tl.fromTo(
            target,
            { yPercent: TITLE_REVEAL.from },
            { yPercent: TITLE_REVEAL.to, duration: 0.32, ease: "none" },
            position,
          );
        } else {
          tl.to(target, { yPercent, ease: "none" }, position);
        }
      });
    }, root);

    let lenis: Lenis | undefined;
    const raf = (time: number) => lenis?.raf(time * 1000);
    if (smoothScroll) {
      lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, [smoothScroll, titleMode]);

  const titleLayer = (
    <div data-parallax-layer="3" className="parallax__layer-title">
      <h2 className="parallax__title">{title}</h2>
    </div>
  );

  return (
    <div className={className ? `parallax ${className}` : "parallax"} ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers">
            <img src={images.back} loading="eager" width="800" data-parallax-layer="1" alt="" className="parallax__layer-img" />
            {titleMode === "reveal" && titleLayer}
            <img src={images.middle} loading="eager" width="800" data-parallax-layer="2" alt="" className="parallax__layer-img" />
            {titleMode === "between" && titleLayer}
            <img src={images.front} loading="eager" width="800" data-parallax-layer="4" alt="" className="parallax__layer-img" />
          </div>
          <img src="/fog.svg" alt="" aria-hidden="true" className="parallax__fog" />
          <img src="/fog.svg" alt="" aria-hidden="true" className="parallax__fog parallax__fog--dense" />
        </div>
      </section>
      <section className="parallax__content" aria-hidden="true" />
    </div>
  );
}
