import { site } from "../content/site";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

export function Day() {
  return (
    <section id="day" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
      {/* The photo and heading stay pinned on desktop while the day scrolls past. */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-6xl">
              {site.day.headline}
            </h2>
            <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-muted">{site.day.body}</p>
            <Photo
              name="day"
              alt="Morning tea on the terrace"
              width={1100}
              height={800}
              className="mt-10 aspect-[11/8] w-full rounded-[20px] object-cover"
            />
          </Reveal>
        </div>

        <ol className="md:pt-[30vh]">
          {site.day.moments.map((moment) => (
            <li key={moment.time} className="py-10 md:py-[14vh]">
              <Reveal>
                <p className="font-display text-xl font-medium text-accent">{moment.time}</p>
                <p className="mt-3 max-w-[20ch] font-display text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
                  {moment.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
