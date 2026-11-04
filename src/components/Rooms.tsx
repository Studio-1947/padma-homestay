import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, BedIcon, CheckIcon, MountainsIcon, UsersIcon } from "@phosphor-icons/react";
import { formatPrice, site, type Room, type RoomType } from "../content/site";
import { chooseRoom } from "../lib/booking";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const types = site.rooms.types;

function describe(room: Room) {
  const parts = [room.floor, room.view ? "with a view" : null].filter(Boolean).join(", ");
  return parts ? parts[0].toUpperCase() + parts.slice(1) : "Standard room";
}

function priceRange(type: RoomType) {
  const prices = type.rooms.map((room) => room.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return low === high ? formatPrice(low) : `${formatPrice(low)} to ${formatPrice(high)}`;
}

/** One room size: a big photo with every room of that size as thumbnails, beside the facts that matter for booking. */
function TypePanel({ type }: { type: RoomType }) {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const room = type.rooms[selected];
  const views = type.rooms.filter((r) => r.view).length;

  return (
    <div className="grid gap-8 md:grid-cols-[1.55fr_1fr] md:gap-12">
      <div>
        <div className="relative overflow-hidden rounded-[20px] bg-surface-2">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={room.image}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Photo
                name={`rooms/${room.image}`}
                format="webp"
                alt={`${type.name.replace(/s$/, "")}: ${describe(room).toLowerCase()}`}
                width={2000}
                height={1000}
                className="aspect-[2/1] w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="font-medium">{describe(room)}</span>
          <span className="text-muted">
            <span className="font-medium text-ink">{formatPrice(room.price)}</span> per guest, a night
          </span>
        </p>

        {/* Every room of this size; horizontal scroll on phones, wraps on larger screens. */}
        <div
          role="group"
          aria-label={`${type.name}, choose a room to see it`}
          className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden"
        >
          {type.rooms.map((r, i) => (
            <button
              key={r.n}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={i === selected}
              aria-label={describe(r)}
              className={`relative shrink-0 overflow-hidden rounded-[12px] transition-[opacity,box-shadow] ${
                i === selected ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Photo
                name={`rooms/${r.image}`}
                format="webp"
                alt=""
                width={2000}
                height={1000}
                className="h-14 w-28 object-cover md:h-16 md:w-32"
              />
              {r.view && (
                <span className="absolute bottom-1 right-1 grid size-6 place-items-center rounded-full bg-[#08101c]/60 text-[#f6f8f7]">
                  <MountainsIcon size={14} weight="fill" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{type.name}</h3>
        <p className="mt-2 text-muted">
          {type.rooms.length} rooms{views > 0 && `, ${views} with a view of the range`}.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
          <div>
            <dt className="flex items-center gap-2 text-sm text-muted">
              <BedIcon size={18} className="text-accent" />
              Beds
            </dt>
            <dd className="mt-1 font-medium">{type.beds}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-sm text-muted">
              <UsersIcon size={18} className="text-accent" />
              Minimum
            </dt>
            <dd className="mt-1 font-medium">{type.minGuests} guests</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-muted">Per guest, a night</dt>
            <dd className="mt-1 font-display text-3xl font-semibold tracking-tight">{priceRange(type)}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-line pt-6">
          <p className="text-sm text-muted">Included</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {site.rooms.included.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm">
                <CheckIcon size={14} weight="bold" className="text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="#booking"
          onClick={() => chooseRoom(type.name)}
          className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-accent px-7 font-medium text-accent-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] md:mt-auto"
        >
          Check availability
          <ArrowRightIcon size={18} weight="bold" />
        </a>
      </div>
    </div>
  );
}

export function Rooms() {
  const [active, setActive] = useState<RoomType["id"]>("triple");
  const type = types.find((t) => t.id === active)!;

  return (
    <section id="rooms" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <SectionIntro headline={site.rooms.headline} body={site.rooms.body} />

      <Reveal className="mt-10 md:mt-12">
        <div role="tablist" aria-label="Room sizes" className="inline-flex rounded-full border border-line p-1">
          {types.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={t.id === active}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={`relative rounded-full px-4 py-2.5 text-sm font-medium transition-colors md:px-6 ${
                t.id === active ? "text-surface" : "text-muted hover:text-ink"
              }`}
            >
              {t.id === active && (
                <motion.span layoutId="room-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <span className="relative">
                {t.name.replace(" rooms", "")}
                <span className="ml-1.5 opacity-60">{t.rooms.length}</span>
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-8 md:mt-10">
        <div role="tabpanel" id={`panel-${type.id}`} aria-labelledby={`tab-${type.id}`}>
          {/* Keyed so each size opens on its first room. */}
          <TypePanel key={type.id} type={type} />
        </div>
      </Reveal>
    </section>
  );
}
