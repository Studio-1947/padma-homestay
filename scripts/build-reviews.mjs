// Turns the scraped Google reviews (assets-src/reviews/*.csv) into src/content/reviews.json.
// Run with: npm run reviews
//
// The scrape keeps Google's extra labels on the end of many reviews ("Trip type  Vacation",
// "Rooms: 5", "Translated by Google"...). This strips them, keeps the Rooms/Service/Location
// scores as numbers, and turns "2 years ago" into a date that will not go stale.
import { readFileSync, writeFileSync } from "node:fs";

const SOURCE = "assets-src/reviews/padma_homestay_reviews.csv";
const OUT = "src/content/reviews.json";
// The day the reviews were scraped; "a month ago" is counted back from here.
const SCRAPED = new Date(2026, 10, 4);

/** Minimal CSV parser: quoted fields, doubled quotes, commas and newlines inside quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") row.push(field), (field = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += c;
  }
  if (field || row.length) row.push(field), rows.push(row);
  const [head, ...body] = rows.filter((r) => r.some(Boolean));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

// Google's labels. Everything from the first one onward is metadata, not the guest's words.
const LABELS = [
  "Trip type", "Travel group", "Rooms: ?\\d?", "Service: \\d", "Location: \\d", "Hotel highlights",
  "Nearby activities", "Food & drinks", "Safety", "Walkability", "Bed comfort", "Room view",
  "Room type", "Event type", "Noteworthy details", "Home type", "Translated by Google",
];
const LABEL_RE = new RegExp(`(?:^|\\s{2})(?:${LABELS.join("|")})(?:…|\\s|$)`);

function clean(raw) {
  let text = raw.replace(/[-]/g, ""); // icon-font characters
  const translated = text.includes("Translated by Google");
  const scores = {};
  for (const key of ["Rooms", "Service", "Location"]) {
    const m = text.match(new RegExp(`${key}: (\\d)`));
    if (m) scores[key.toLowerCase()] = Number(m[1]);
  }
  const cut = text.search(LABEL_RE);
  if (cut >= 0) text = text.slice(0, cut);
  text = text
    .replace(/(\s{2}(\d+:\d\d|\+\d+))+\s*$/g, "") // video length and "+14 photos" markers
    .replace(/\|/g, "\n") // Tripadvisor line breaks
    .replace(/ {2,}/g, "\n") // Google line breaks
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    // A double space mid-sentence is not a paragraph: rejoin when the next line starts lower case.
    .reduce((lines, line) => {
      if (lines.length && /^[a-z]/.test(line) && !/[.!?…:]$/.test(lines.at(-1))) lines[lines.length - 1] += ` ${line}`;
      else lines.push(line);
      return lines;
    }, [])
    .filter((line, i, all) => !(i === all.length - 1 && /^\d+$/.test(line))) // a stray list number at the end
    .join("\n")
    .trim();
  text = text.replace(/^NEW\s+/, ""); // Google's badge on recent reviews
  // "… More" is Google's collapsed-review link: the scrape only has the first part.
  if (/\s(…\s*)?More$/.test(text)) text = text.replace(/\s*(…\s*)?More$/, "").replace(/[\s.,]*$/, "") + "…";
  const truncated = text.endsWith("…");
  return { text, translated, truncated, scores };
}

/** "a month ago", "3 years ago" -> "2026-10" style year-month, counted back from SCRAPED. */
function toMonth(ago) {
  const m = ago.match(/^(a|an|\d+) (day|week|month|year)s? ago$/);
  const d = new Date(SCRAPED);
  if (m) {
    const n = m[1] === "a" || m[1] === "an" ? 1 : Number(m[1]);
    if (m[2] === "year") d.setFullYear(d.getFullYear() - n);
    if (m[2] === "month") d.setMonth(d.getMonth() - n);
    if (m[2] === "week") d.setDate(d.getDate() - 7 * n);
    if (m[2] === "day") d.setDate(d.getDate() - n);
  }
  const precise = !m || m[2] !== "year";
  return { month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, precise };
}

// What a review talks about, for the filter chips. Plain keyword matching.
const TOPICS = {
  hosts: /\b(host|hosts|hospitality|hospitable|family|didi|di\b|padma ?di|owner|caring|warm|welcom|homely|like home)/i,
  food: /\b(food|meal|cook|momo|dinner|lunch|breakfast|thali|tasty|delicious|tea)\b/i,
  views: /\b(view|views|kanchen|kanchan|kunchan|sleeping buddha|sunrise|sunset|peak|range|mountain)/i,
  trek: /\b(trek|trekking|tonglu|tumling|sandakphu|singalila|trail|hike)\b/i,
};

const rows = parseCsv(readFileSync(SOURCE, "utf8"));
const ratings = rows.map((r) => Number(r.Rating)).filter((n) => n >= 1 && n <= 5);

const reviews = rows
  .map((r, order) => {
    const { text, translated, truncated, scores } = clean(r.ReviewText);
    const { month, precise } = toMonth(r.DateAgo.trim());
    return {
      name: r.Name.trim(),
      rating: Number(r.Rating),
      source: r.Source.trim(),
      month,
      precise,
      text,
      translated,
      truncated,
      scores,
      // Google serves the avatar at any size; ask for one sharp enough for a 40px circle on retina.
      avatar: r.ImageURL.replace(/=w\d+-h\d+/, "=w96-h96"),
      topics: Object.entries(TOPICS).filter(([, re]) => re.test(text)).map(([t]) => t),
      order,
    };
  })
  .filter((r) => r.text.length >= 12);

const avg = (xs) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);
const allScores = rows.map((r) => clean(r.ReviewText).scores);

const data = {
  scraped: "2026-11-04",
  count: ratings.length,
  average: avg(ratings),
  breakdown: [5, 4, 3, 2, 1].map((stars) => ({ stars, count: ratings.filter((n) => n === stars).length })),
  scores: {
    rooms: avg(allScores.map((s) => s.rooms).filter(Boolean)),
    service: avg(allScores.map((s) => s.service).filter(Boolean)),
    location: avg(allScores.map((s) => s.location).filter(Boolean)),
  },
  reviews,
};

writeFileSync(OUT, JSON.stringify(data) + "\n");
console.log(`${data.count} ratings (avg ${data.average}), ${reviews.length} with text -> ${OUT}`);
console.log("scores", data.scores, "topics", Object.fromEntries(Object.keys(TOPICS).map((t) => [t, reviews.filter((r) => r.topics.includes(t)).length])));
