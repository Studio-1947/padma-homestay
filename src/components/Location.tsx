import { AirplaneTiltIcon, ArrowUpRightIcon, CarProfileIcon, TrainIcon } from "@phosphor-icons/react";
import { site, type Route } from "../content/site";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const ROUTE_ICON: Record<Route["id"], typeof AirplaneTiltIcon> = {
  air: AirplaneTiltIcon,
  rail: TrainIcon,
  road: CarProfileIcon,
};

const MAP_EMBED = "https://maps.google.com/maps?q=27.049883,88.113692&z=11&output=embed";

/** The map on one side, the three usual ways up on the other. Stacks with the map first on phones. */
export function Location() {
  return (
    <section id="getting-here" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
        <Reveal className="order-2 md:order-1">
          <div className="overflow-hidden rounded-[20px] border border-line bg-surface-2">
            <iframe
              title={`Map showing ${site.name} in ${site.region}`}
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full md:aspect-auto md:h-[34rem] dark:[filter:invert(0.9)_hue-rotate(180deg)]"
            />
          </div>
        </Reveal>

        <div className="order-1 md:order-2">
          <SectionIntro headline={site.location.headline} body={site.location.body} />

          <ul className="mt-10 space-y-7">
            {site.location.routes.map((route, i) => {
              const Icon = ROUTE_ICON[route.id];
              return (
                <li key={route.id}>
                  <Reveal delay={i * 0.06} className="grid grid-cols-[2.75rem_1fr] gap-4">
                    <span className="grid size-11 place-items-center rounded-full bg-surface-2 text-accent">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <span className="font-display text-lg font-semibold tracking-tight">{route.title}</span>
                        <span className="text-sm font-medium">{route.time}</span>
                      </p>
                      <p className="mt-0.5 text-sm text-muted">{route.from}</p>
                      <p className="mt-2 leading-relaxed text-muted">{route.body}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>

          <Reveal delay={0.2}>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 font-medium transition-colors hover:bg-ink/5 active:scale-[0.98]"
            >
              Open in Google Maps
              <ArrowUpRightIcon size={18} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
