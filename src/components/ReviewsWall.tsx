import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon, StarIcon } from "@phosphor-icons/react";
import data from "../content/reviews.json";
import { site } from "../content/site";

type ReviewData = (typeof data.reviews)[number];

const TOPICS = [
  { id: "all", label: "All" },
  { id: "hosts", label: "The hosts" },
  { id: "food", label: "Food" },
  { id: "views", label: "Views" },
  { id: "trek", label: "Trekking" },
] as const;
type Topic = (typeof TOPICS)[number]["id"];

const PAGE = 6;
const LONG = 360; // characters before a review is clamped behind "Read more"

// Best and newest first; reviews cut short by the scrape go to the back.
const sorted = [...data.reviews].sort(
  (a, b) => Number(a.truncated) - Number(b.truncated) || b.rating - a.rating || b.month.localeCompare(a.month),
);

const monthName = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });
function when(review: ReviewData) {
  const [year, month] = review.month.split("-").map(Number);
  return review.precise ? monthName.format(new Date(year, month - 1)) : String(year);
}

/** Google's four-colour "G", kept in its brand colours in both themes. */
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" width={18} height={18} aria-hidden className="shrink-0">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/** Five stars with the fill clipped to the rating, so 4.6 shows as four and a bit. */
function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const row = (weight: "fill" | "regular") =>
    Array.from({ length: 5 }, (_, i) => <StarIcon key={i} size={size} weight={weight} className="shrink-0" />);
  return (
    <span className="relative inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
      <span className="flex text-line">{row("fill")}</span>
      <span className="absolute inset-y-0 left-0 flex overflow-hidden text-[#e3a008]" style={{ width: `${(value / 5) * 100}%` }}>
        {row("fill")}
      </span>
    </span>
  );
}

function Avatar({ review }: { review: ReviewData }) {
  const [failed, setFailed] = useState(false);
  const initial = review.name.trim()[0]?.toUpperCase() ?? "?";
  if (failed || !review.avatar)
    return (
      <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/15 font-medium text-accent">
        {initial}
      </span>
    );
  return (
    <img
      src={review.avatar}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-10 shrink-0 rounded-full bg-surface-2 object-cover"
    />
  );
}

function ReviewCard({ review }: { review: ReviewData }) {
  const [open, setOpen] = useState(false);
  const long = review.text.length > LONG;

  return (
    <article className="mb-4 break-inside-avoid rounded-[20px] bg-surface p-6 md:p-7">
      <header className="flex items-center gap-3">
        <Avatar review={review} />
        <div className="min-w-0">
          <p className="truncate font-medium">{review.name}</p>
          <p className="text-sm text-muted">
            {when(review)} on {review.source}
          </p>
        </div>
      </header>
      <div className="mt-4">
        <Stars value={review.rating} />
      </div>
      <div className={`mt-3 space-y-3 leading-relaxed ${long && !open ? "line-clamp-6" : ""}`}>
        {review.text.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 text-sm font-medium text-accent hover:underline"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
      {review.translated && <p className="mt-3 text-xs text-muted">Translated by Google</p>}
    </article>
  );
}

export default function ReviewsWall() {
  const reduce = useReducedMotion();
  const [topic, setTopic] = useState<Topic>("all");
  const [shown, setShown] = useState(PAGE);

  const list = useMemo(() => (topic === "all" ? sorted : sorted.filter((r) => (r.topics as string[]).includes(topic))), [topic]);
  const count = (id: Topic) => (id === "all" ? sorted.length : sorted.filter((r) => (r.topics as string[]).includes(id)).length);
  const max = Math.max(...data.breakdown.map((b) => b.count));

  return (
    <div className="mt-12 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
      {/* The overall score; sticks beside the cards on large screens. */}
      <aside className="lg:col-span-4">
        <div className="rounded-[24px] bg-surface p-6 md:p-8 lg:sticky lg:top-28">
          <div className="flex items-end gap-4">
            <p className="font-display text-7xl font-semibold leading-none tracking-tighter tabular-nums">{data.average}</p>
            <div className="pb-1">
              <Stars value={data.average} size={20} />
              <p className="mt-1 text-sm text-muted">{data.count} Google reviews</p>
            </div>
          </div>

          <ul className="mt-8 space-y-2" aria-label="Ratings by stars">
            {data.breakdown.map((b) => (
              <li key={b.stars} className="grid grid-cols-[1.5rem_1fr_2.5rem] items-center gap-3 text-sm">
                <span className="tabular-nums text-muted">{b.stars}★</span>
                <span className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <span className="block h-full rounded-full bg-[#e3a008]" style={{ width: `${(b.count / max) * 100}%` }} />
                </span>
                <span className="text-right tabular-nums text-muted">{b.count}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
            {(
              [
                ["Rooms", data.scores.rooms],
                ["Service", data.scores.service],
                ["Location", data.scores.location],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="font-display text-2xl font-semibold tabular-nums tracking-tight">{value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-line font-medium transition-colors hover:border-ink"
          >
            <GoogleG />
            See us on Google Maps
            <ArrowUpRightIcon size={16} />
          </a>
        </div>
      </aside>

      <div className="lg:col-span-8">
        <div role="tablist" aria-label="Filter reviews by topic" className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={t.id === topic}
              onClick={() => {
                setTopic(t.id);
                setShown(PAGE);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                t.id === topic ? "bg-ink text-surface" : "bg-surface text-muted hover:text-ink"
              }`}
            >
              {t.label}
              <span className="ml-1.5 opacity-60">{count(t.id)}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-6 columns-1 gap-4 md:columns-2">
          <AnimatePresence initial={false}>
            {list.slice(0, shown).map((review) => (
              <motion.div
                key={`${topic}-${review.order}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted" aria-live="polite">
            Showing {Math.min(shown, list.length)} of {list.length}
          </p>
          {shown < list.length && (
            <button
              type="button"
              onClick={() => setShown((n) => n + PAGE)}
              className="h-11 rounded-full bg-ink px-6 font-medium text-surface transition-transform active:scale-[0.98]"
            >
              Show more reviews
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
