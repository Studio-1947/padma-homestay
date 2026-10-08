import type { PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Bed, Users } from "@phosphor-icons/react";
import { formatPrice, site, type Room } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

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

      <div className="p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className={`font-display font-semibold tracking-tight ${featured ? "text-3xl" : "text-2xl"}`}>
            {room.name}
          </h3>
          <p className="shrink-0 text-sm text-muted">
            <span className="text-lg font-medium text-ink">{formatPrice(room.pricePerNight)}</span> a night
          </p>
        </div>
        <p className="mt-2 max-w-[52ch] leading-relaxed text-muted">{room.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Users size={18} className="text-accent" />
            Sleeps {room.sleeps}
          </li>
          <li className="flex items-center gap-2">
            <Bed size={18} className="text-accent" />
            {room.bed}
          </li>
        </ul>
      </div>
    </motion.article>
  );
}

export function Rooms() {
  const [featured, ...others] = site.rooms.items;

  return (
    <section id="rooms" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
      <Reveal>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
          {site.rooms.headline}
        </h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-muted">{site.rooms.body}</p>
      </Reveal>

      {/* One large room beside two stacked rooms. Collapses to a single column below md. */}
      <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:grid-cols-[1.35fr_1fr] md:grid-rows-2">
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
