/**
 * All site copy and facts live here.
 *
 * Everything marked SAMPLE is placeholder data. Replace it with the real
 * details, then set `isSample` to false to hide the dev-only reminder ribbon.
 */

export type Room = {
  id: string;
  name: string;
  summary: string;
  sleeps: number;
  bed: string;
  pricePerNight: number;
  image: string;
};

export type Amenity = {
  id: "meals" | "terrace" | "hotWater" | "wifi" | "walks";
  title: string;
  body: string;
};

export type Moment = {
  time: string;
  body: string;
};

export const site = {
  isSample: true,

  name: "Padma Homestay",
  region: "Dhotrey, West Bengal",
  address: "Dhotrey, West Bengal 734221, India",
  mapsUrl: "https://www.google.com/maps?q=27.049883,88.113692",
  phoneDisplay: "+91 7047078852", // SAMPLE
  phoneHref: "tel:+917047078852", // SAMPLE
  email: "hello@example.com", // SAMPLE
  /** WhatsApp number in international format, digits only. SAMPLE */
  whatsappNumber: "917047078852",
  currency: "INR",

  hero: {
    eyebrow: "Family-run homestay in Dhotrey, West Bengal",
    headline: "Wake up above the clouds.",
    subtext:
      "Three quiet rooms, home-cooked meals and a terrace that faces the snow line. Come for a weekend, stay a week.",
  },

  view: {
    headline: "The ridge changes every hour.",
    body: "Clear peaks at dawn, cloud by noon, lamps across the valley at night. Every room looks out on it.",
  },

  rooms: {
    headline: "Three rooms, one view.",
    body: "Each room has its own bathroom, thick blankets and a window onto the mountains.",
    // SAMPLE: names, capacity and prices are placeholders
    items: [
      {
        id: "lotus",
        name: "Lotus Room",
        summary: "The largest room, with a private balcony and the widest view of the range.",
        sleeps: 3,
        bed: "King bed and a single",
        pricePerNight: 3600,
        image: "room-1",
      },
      {
        id: "pine",
        name: "Pine Room",
        summary: "A warm wood-panelled double facing the forest.",
        sleeps: 2,
        bed: "Queen bed",
        pricePerNight: 2800,
        image: "room-2",
      },
      {
        id: "terrace",
        name: "Terrace Room",
        summary: "A cosy twin that opens straight onto the shared terrace.",
        sleeps: 2,
        bed: "Two singles",
        pricePerNight: 2400,
        image: "room-3",
      },
    ] satisfies Room[],
  },

  stay: {
    headline: "Looked after like family.",
    body: "It is our home too, so the small things are taken care of.",
    // SAMPLE: confirm each amenity is really offered
    items: [
      {
        id: "meals",
        title: "Home-cooked meals",
        body: "Breakfast and dinner from our kitchen, with vegetables from the garden.",
      },
      {
        id: "terrace",
        title: "A terrace under the flags",
        body: "Tea, a blanket and the whole range in front of you.",
      },
      {
        id: "hotWater",
        title: "Hot water and heaters",
        body: "Hot showers all day and a room heater for cold nights.",
      },
      {
        id: "wifi",
        title: "Wi-Fi that works",
        body: "Good enough for calls, with a desk if you need one.",
      },
      {
        id: "walks",
        title: "Walks with your host",
        body: "Village paths, forest trails and the sunrise point, at your pace.",
      },
    ] satisfies Amenity[],
  },

  day: {
    headline: "A day at Padma.",
    body: "There is no schedule. This is just how most days go.",
    moments: [
      { time: "Sunrise", body: "Tea on the terrace while the peaks turn gold." },
      { time: "Morning", body: "A walk through the village and the pine forest with your host." },
      { time: "Afternoon", body: "Lunch from the kitchen garden, then a book in the sun." },
      { time: "Evening", body: "Dinner together, a fire, and a sky full of stars." },
    ] satisfies Moment[],
  },

  booking: {
    headline: "Ask about your dates.",
    body: "Tell us when you would like to come and we will reply on WhatsApp.",
  },
} as const;

export const navLinks = [
  { href: "#rooms", label: "Rooms" },
  { href: "#stay", label: "The stay" },
  { href: "#day", label: "A day here" },
  { href: "#booking", label: "Contact" },
] as const;

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
