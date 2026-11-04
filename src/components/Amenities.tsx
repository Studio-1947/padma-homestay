import type { Icon } from "@phosphor-icons/react";
import { BinocularsIcon, CampfireIcon, JeepIcon, PersonSimpleHikeIcon, ShowerIcon } from "@phosphor-icons/react";
import { site, type Amenity } from "../content/site";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const ICONS: Record<Amenity["id"], Icon> = {
  hotWater: ShowerIcon,
  campfire: CampfireIcon,
  trekking: PersonSimpleHikeIcon,
  sightseeing: BinocularsIcon,
  pickup: JeepIcon,
};

/** Five facilities as a row of cards: icon on top, the detail at the bottom. */
export function Amenities() {
  const { amenities } = site;

  return (
    <section id="amenities" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <SectionIntro headline={amenities.headline} body={amenities.body} />

      {/* One column on phones, two from sm (the fifth card spans both), five from lg. */}
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-4 lg:grid-cols-5">
        {amenities.items.map((item, i) => {
          const IconFor = ICONS[item.id];
          return (
            <li key={item.id} className="sm:last:col-span-2 lg:last:col-span-1">
              <Reveal delay={i * 0.06} className="h-full">
                {/* Icon beside the text on phones, above it from sm. */}
                <article className="group flex h-full items-start gap-5 rounded-[24px] bg-surface-2 p-5 sm:flex-col sm:gap-12 sm:p-6 md:p-7">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-surface text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-ink">
                    <IconFor size={28} weight="duotone" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
