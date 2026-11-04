import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import { site } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const items = site.gallery.items;

const iconButton =
  "grid size-12 place-items-center rounded-full bg-[#f6f8f7]/12 text-[#f6f8f7] backdrop-blur-sm transition-colors hover:bg-[#f6f8f7]/25 active:scale-[0.96]";

/** A photo wall; any photo opens full screen, with arrow keys to move through the rest. */
export function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length));

  // The page behind a modal should not scroll.
  useEffect(() => {
    if (index === null) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [index]);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };

  const current = index === null ? null : items[index];

  return (
    <section id="gallery" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <SectionIntro headline={site.gallery.headline} body={site.gallery.body} />

      {/* Portraits are one column by two rows, landscapes two by two, so rows always end level.
          Two columns until lg, four from lg; row height tracks the column width. */}
      <div className="mt-12 grid grid-flow-dense auto-rows-[34vw] grid-cols-2 gap-3 md:mt-14 md:gap-4 lg:auto-rows-[min(17vw,240px)] lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal
            key={item.image}
            delay={(i % 4) * 0.06}
            className={item.height > item.width ? "row-span-2" : "col-span-2 row-span-2"}
          >
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Open photo: ${item.alt}`}
              className="group block size-full overflow-hidden rounded-[20px] bg-surface-2"
            >
              <Photo
                name={item.image}
                format="webp"
                alt={item.alt}
                width={item.width}
                height={item.height}
                className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setIndex(null)}
        onKeyDown={onKeyDown}
        // A click on the dimmed area (the dialog itself, not its content) closes it.
        onClick={(event) => event.target === event.currentTarget && close()}
        data-lenis-prevent
        className="m-0 size-full max-h-none max-w-none bg-transparent p-4 backdrop:bg-[#0b1210]/90 md:p-8"
      >
        {current && (
          <div className="flex size-full flex-col items-center justify-center gap-4" onClick={(e) => e.target === e.currentTarget && close()}>
            <figure className="flex min-h-0 flex-col items-center gap-3">
              <Photo
                key={current.image}
                name={current.image}
                format="webp"
                alt={current.alt}
                width={current.width}
                height={current.height}
                eager
                className="max-h-[78dvh] w-auto max-w-full rounded-[20px] object-contain"
              />
              <figcaption className="text-sm text-[#f6f8f7]/80">{current.alt}</figcaption>
            </figure>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={iconButton}>
                <ArrowLeftIcon size={20} />
              </button>
              <button type="button" onClick={close} aria-label="Close" className={iconButton}>
                <XIcon size={20} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className={iconButton}>
                <ArrowRightIcon size={20} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
