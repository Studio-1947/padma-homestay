import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PlusIcon } from "@phosphor-icons/react";
import { site, type Question } from "../content/site";
import { Reveal } from "./Reveal";
import { SectionIntro } from "./SectionIntro";

function Item({ item, open, onToggle }: { item: Question; open: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-medium tracking-tight md:py-6 md:text-xl"
        >
          {item.question}
          <PlusIcon
            size={20}
            className={`shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[62ch] pb-6 leading-relaxed text-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
      <div className="max-w-3xl md:ml-[12vw]">
        <SectionIntro headline={site.faq.headline} />
        <Reveal className="mt-8 border-t border-line md:mt-10">
          {site.faq.items.map((item, i) => (
            <Item key={item.question} item={item} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
