import { Reveal } from "./Reveal";

type SectionIntroProps = {
  headline: string;
  body?: string;
  className?: string;
};

/** The heading and short line that open each section, at one shared scale. */
export function SectionIntro({ headline, body, className }: SectionIntroProps) {
  return (
    <Reveal className={className}>
      <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tighter md:text-5xl">{headline}</h2>
      {body && <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">{body}</p>}
    </Reveal>
  );
}
