import { CookingPotIcon } from "@phosphor-icons/react";
import { formatPrice, site, type FoodPhoto } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

const zoom =
  "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]";

function FoodImage({
  photo,
  className = "",
}: {
  photo: FoodPhoto;
  className?: string;
}) {
  return (
    <Photo
      name={photo.image}
      format="webp"
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      className={`size-full object-cover ${zoom} ${className}`}
    />
  );
}

/**
 * The kitchen: the lunch spread carries the full-board package, the kitchen shelf sits beside it,
 * four dishes follow as a strip, and the à la carte prices close it as a board.
 */
export function Food() {
  const { food } = site;

  return (
    <section
      id="food"
      className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28"
    >
      <SectionIntro headline={food.headline} body={food.body} />

      <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12 md:gap-4">
        <Reveal className="md:col-span-8">
          <article className="group relative isolate h-full min-h-[30rem] overflow-hidden rounded-[24px] bg-surface-2 md:min-h-[38rem]">
            <div className="absolute inset-0 -z-20">
              <FoodImage photo={food.spread} />
            </div>
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1210]/90 via-[#0b1210]/35 to-transparent"
            />
            <div className="flex h-full flex-col justify-end p-6 text-[#f1f4f2] md:p-10">
              <div className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
                <div>
                  <CookingPotIcon size={28} className="mb-4" />
                  <h3 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                    {food.package.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] leading-relaxed text-[#f1f4f2]/85">
                    {food.package.body}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-[#f1f4f2] px-4 py-2 text-sm font-medium text-[#0b1210] md:max-w-[20ch] md:rounded-[16px] md:px-5 md:py-3 md:text-base">
                  {food.package.price}
                </p>
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-4">
          <figure className="group relative h-full min-h-[22rem] overflow-hidden rounded-[24px] bg-surface-2">
            <div className="absolute inset-0">
              <FoodImage photo={food.kitchen} className="object-[50%_40%]" />
            </div>
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-[#0b1210]/60 px-3.5 py-1.5 text-sm font-medium text-[#f1f4f2] backdrop-blur-md">
              The kitchen, where it all starts
            </figcaption>
          </figure>
        </Reveal>
      </div>

      {/* Dishes: two up on phones, one row of four from md. */}
      <ul className="mt-3 grid grid-cols-2 gap-3 md:mt-4 md:grid-cols-4 md:gap-4">
        {food.dishes.map((dish, i) => (
          <li key={dish.name}>
            <Reveal delay={0.05 * i}>
              <figure className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-surface-2">
                  <FoodImage photo={dish} />
                </div>
                <figcaption className="mt-3 px-1">
                  <p className="font-display text-lg font-semibold tracking-tight md:text-xl">
                    {dish.name}
                  </p>
                  <p className="text-sm text-muted">{dish.note}</p>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.06} className="mt-12 md:mt-16">
        <div className="rounded-[24px] border border-line bg-surface-2 p-5 sm:p-6 md:p-10">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Or order as you go
            </h3>
            <p className="text-sm text-muted">Per plate, cooked to order</p>
          </div>
          {/* Phones: compact rows (thumbnail, name, price). From sm: photo cards. */}
          <ul className="mt-6 grid divide-y divide-line sm:mt-8 sm:grid-cols-2 sm:gap-6 sm:divide-y-0 lg:grid-cols-4 lg:gap-5">
            {food.menu.map((item) => (
              <li key={item.name} className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:flex-col sm:items-stretch sm:gap-0 sm:py-0">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-[14px] bg-surface sm:aspect-[4/3] sm:size-auto sm:rounded-[16px]">
                  <Photo
                    name={item.image}
                    format="webp"
                    alt={item.alt}
                    width={1200}
                    height={800}
                    className={`size-full object-cover ${zoom}`}
                  />
                  <p className="absolute right-3 top-3 hidden rounded-full sm:block bg-surface/90 px-3 py-1 font-display text-lg font-semibold tabular-nums tracking-tight text-accent backdrop-blur-md">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3 sm:mt-4">
                    <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                      {item.name}
                    </p>
                    <p className="font-display text-lg font-semibold tabular-nums tracking-tight text-accent sm:hidden">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.contents}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
