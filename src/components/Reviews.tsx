import { lazy, Suspense } from "react";
import { site } from "../content/site";
import { SectionIntro } from "./SectionIntro";

// 155 reviews are about 80 KB of text, so they load in their own chunk, not with the first paint.
const ReviewsWall = lazy(() => import("./ReviewsWall"));

export function Reviews() {
  return (
    <section id="reviews" className="bg-surface-2">
      <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <SectionIntro headline={site.reviews.headline} body={site.reviews.body} />
        <Suspense fallback={<div className="mt-12 min-h-[40rem] md:mt-14" />}>
          <ReviewsWall />
        </Suspense>
      </div>
    </section>
  );
}
