import { site } from "../content/site";

/** Development-only reminder that rooms, prices and contact details are still placeholders. */
export function SampleRibbon() {
  if (!import.meta.env.DEV || !site.isSample) return null;
  return (
    <p className="fixed bottom-3 left-3 z-50 rounded-full bg-ink px-3 py-1.5 text-xs text-surface">
      Sample content. Edit src/content/site.ts
    </p>
  );
}
