import { site } from "../content/site";
import { Reveal } from "./Reveal";

/** First thing under the photo: who we are in one breath, then the facts people look for. */
export function Intro() {
  return (
    <section id="welcome" className="mx-auto max-w-[1400px] px-4 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12">
      <h2 className="sr-only">About {site.name}</h2>
      <Reveal>
        <p className="max-w-[30ch] font-display text-3xl font-medium leading-[1.2] tracking-tight md:text-[2.75rem]">
          {site.intro.statement}
        </p>
      </Reveal>

      {/* Two by two on phones, one row of four from md. */}
      <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-8 md:mt-16 md:grid-cols-4">
        {site.intro.facts.map((fact, i) => (
          <Reveal key={fact.label} delay={i * 0.06}>
            <dt className="text-sm text-muted">{fact.label}</dt>
            <dd className="mt-1.5 font-display text-3xl font-semibold tracking-tight md:text-4xl">{fact.value}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
