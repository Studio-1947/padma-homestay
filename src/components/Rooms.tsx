import type { PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowRightIcon, BedIcon, UsersIcon } from "@phosphor-icons/react";
import { formatPrice, site, type Room } from "../content/site";
import { chooseRoom } from "../lib/booking";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

/** Card that tilts toward the pointer while its photo shifts the other way, for a sense of depth. */
function RoomCard({ room, featured }: { room: Room; featured: boolean }) {
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), SPRING);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-5, 5]), SPRING);
  const imageX = useSpring(useTransform(pointerX, [-0.5, 0.5], [14, -14]), SPRING);
  const imageY = useSpring(useTransform(pointerY, [-0.5, 0.5], [14, -14]), SPRING);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.article
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface-2"
    >
      <div className={`overflow-hidden ${featured ? "min-h-64 flex-1" : "aspect-[16/9]"}`}>
        <motion.div className="size-full" style={reduce ? undefined : { x: imageX, y: imageY, scale: 1.1 }}>
          <Photo
            name={room.image}
            alt={`${room.name} at ${site.name}`}
            width={featured ? 1400 : 1000}
            height={featured ? 1100 : 600}
            className="size-full object-cover"
          />
        </motion.div>
      </div>

      {/* The featured photo takes the spare height; on the smaller cards the text does, so their links line up. */}
      <div className={`flex flex-col p-6 md:p-7 ${featured ? "" : "flex-1"}`}>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={`font-display font-semibold tracking-tight ${featured ? "text-3xl" : "text-2xl"}`}>
            {room.name}
          </h3>
          <p className="shrink-0 text-sm text-muted">
            <span className="text-lg font-medium text-ink">{formatPrice(room.pricePerNight)}</span> a night
          </p>
        </div>
        <p className="mt-2 max-w-[52ch] leading-relaxed text-muted">{room.summary}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-5">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li className="flex items-center gap-2">
              <UsersIcon size={18} className="text-accent" />
              Sleeps {room.sleeps}
            </li>
            <li className="flex items-center gap-2">
              <BedIcon size={18} className="text-accent" />
              {room.bed}
            </li>
          </ul>
          <a
            href="#booking"
            onClick={() => chooseRoom(room.name)}
            className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-accent"
          >
            Check availability
            <ArrowRightIcon size={16} className="transition-transform group-hover/link:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function Rooms() {
  const [featured, ...others] = site.rooms.items;

  return (
    <section id="rooms" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <SectionIntro headline={site.rooms.headline} body={site.rooms.body} />

      {/* One large room beside two stacked rooms. Collapses to a single column below md. */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-[1.35fr_1fr] md:grid-rows-2">
        <Reveal className="md:row-span-2">
          <RoomCard room={featured} featured />
        </Reveal>
        {others.map((room, i) => (
          <Reveal key={room.id} delay={0.08 * (i + 1)}>
            <RoomCard room={room} featured={false} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
