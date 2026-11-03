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

export type Fact = { label: string; value: string };

export type GalleryItem = {
  /** File name in /public/images (jpg). Until it exists a placeholder fills the slot. */
  image: string;
  alt: string;
  width: number;
  height: number;
};

export type Review = { quote: string; name: string; from: string; stayed: string };

export type Place = { id: string; name: string; distance: string; body: string; image: string };

export type Route = { id: "air" | "rail" | "road"; title: string; from: string; time: string; body: string };

export type Question = { question: string; answer: string };

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

  intro: {
    statement:
      "Padma is our family home in Dhotrey, a small village at the edge of Singalila National Park. We keep three rooms for guests, cook for them, and show them the trails we grew up on.",
    // SAMPLE: confirm each figure
    facts: [
      { label: "Altitude", value: "2,590 m" },
      { label: "Guest rooms", value: "3" },
      { label: "From Bagdogra airport", value: "About 4 hrs" },
      { label: "Kanchenjunga view", value: "Every room" },
    ] satisfies Fact[],
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

  gallery: {
    headline: "A look around.",
    body: "The house, the rooms, the kitchen and the hills around them.",
    // SAMPLE: placeholder slots, replace with real photos (see public/images/README.md)
    items: [
      { image: "gallery-1", alt: "The house from the garden path", width: 1200, height: 1500 },
      { image: "gallery-2", alt: "Morning light on the Kanchenjunga range", width: 1600, height: 1067 },
      { image: "gallery-3", alt: "Momos being folded in the kitchen", width: 1200, height: 1200 },
      { image: "gallery-4", alt: "Rhododendrons along the forest trail", width: 1200, height: 1600 },
      { image: "gallery-5", alt: "The terrace at dusk", width: 1600, height: 1067 },
      { image: "gallery-6", alt: "A guest room made up for the night", width: 1200, height: 1500 },
      { image: "gallery-7", alt: "Prayer flags above the village", width: 1600, height: 1067 },
    ] satisfies GalleryItem[],
  },

  reviews: {
    headline: "What guests say.",
    // SAMPLE: replace with real reviews, with the guests' permission
    items: [
      {
        quote:
          "We came for two nights and stayed five. Waking up to Kanchenjunga from bed is something we still talk about.",
        name: "Ananya Sen",
        from: "Kolkata",
        stayed: "Stayed in March",
      },
      {
        quote:
          "The food alone is worth the drive. Dinner felt like eating with family, and they packed us lunch for the Tonglu walk.",
        name: "Rohan and Meera Iyer",
        from: "Bengaluru",
        stayed: "Stayed in November",
      },
      {
        quote:
          "Quiet, warm and spotless. Our host walked us to the sunrise point before dawn and had tea waiting when we got back.",
        name: "Karma Bhutia",
        from: "Gangtok",
        stayed: "Stayed in December",
      },
    ] satisfies Review[],
  },

  nearby: {
    headline: "Around Dhotrey.",
    body: "Dhotrey sits on the trail into Singalila National Park, so the walking starts at the door.",
    // SAMPLE: confirm distances and times
    items: [
      {
        id: "tonglu",
        name: "Tonglu",
        distance: "3 to 4 hour walk",
        body: "A forest climb to a ridge-top village with a wide view of the Kanchenjunga range.",
        image: "nearby-tonglu",
      },
      {
        id: "singalila",
        name: "Singalila forest",
        distance: "From the park gate",
        body: "Oak, magnolia and rhododendron forest, home to red pandas and Himalayan birds.",
        image: "nearby-singalila",
      },
      {
        id: "sandakphu",
        name: "Sandakphu",
        distance: "3 day trek",
        body: "The highest point in West Bengal, with Everest and Kanchenjunga in the same view.",
        image: "nearby-sandakphu",
      },
      {
        id: "tumling",
        name: "Tumling",
        distance: "On from Tonglu",
        body: "A few homes on the Nepal border, with tea stops and very big skies.",
        image: "nearby-tumling",
      },
      {
        id: "maneybhanjang",
        name: "Maneybhanjang",
        distance: "45 minute drive",
        body: "The old trekking town below us, with its Land Rovers, monastery and market.",
        image: "nearby-maneybhanjang",
      },
    ] satisfies Place[],
  },

  location: {
    headline: "Getting here.",
    body: "We can arrange a car from the airport, the station or Darjeeling. Just tell us when you land.",
    // SAMPLE: confirm travel times
    routes: [
      {
        id: "air",
        title: "By air",
        from: "Bagdogra airport (IXB)",
        time: "About 4 hours",
        body: "By car via Mirik and Maneybhanjang.",
      },
      {
        id: "rail",
        title: "By train",
        from: "New Jalpaiguri (NJP)",
        time: "About 4 hours",
        body: "By car, on the same road as the airport.",
      },
      {
        id: "road",
        title: "From Darjeeling",
        from: "Darjeeling town",
        time: "About 2 hours",
        body: "Via Ghoom and Sukhiapokhri to Maneybhanjang, then up the hill.",
      },
    ] satisfies Route[],
  },

  faq: {
    headline: "Before you come.",
    // SAMPLE: confirm every answer
    items: [
      {
        question: "What are the check-in and check-out times?",
        answer:
          "Check-in is from 12 noon and check-out is by 10 am. If you arrive early, leave your bags with us and have tea while the room is made up.",
      },
      {
        question: "When is the best time to visit?",
        answer:
          "October to December for the clearest mountain views, and March to May for the rhododendrons. June to September brings cloud, rain and very few visitors.",
      },
      {
        question: "How cold does it get?",
        answer:
          "Nights drop close to freezing from December to February. Rooms have heaters and heavy blankets, but bring a warm jacket in any season.",
      },
      {
        question: "Is there mobile signal and Wi-Fi?",
        answer:
          "Jio and Airtel work in most of the house, and the Wi-Fi is fine for calls. Power cuts happen now and then, and we keep backup lights.",
      },
      {
        question: "Are meals included?",
        answer:
          "Breakfast and dinner are included. Lunch and packed lunches for treks are available on request. Food is mostly vegetarian, with chicken on request.",
      },
      {
        question: "Can you arrange treks and transport?",
        answer:
          "Yes. We book cars from Bagdogra, NJP or Darjeeling, and arrange guides and permits for Tonglu and Sandakphu.",
      },
      {
        question: "How do I pay?",
        answer: "UPI, bank transfer or cash. We ask for a small advance to hold your dates.",
      },
    ] satisfies Question[],
  },

  booking: {
    headline: "Ask about your dates.",
    body: "Tell us when you would like to come and we will reply on WhatsApp, usually within a few hours.",
  },
} as const;

export const navLinks = [
  { href: "#rooms", label: "Rooms" },
  { href: "#stay", label: "The stay" },
  { href: "#gallery", label: "Gallery" },
  { href: "#getting-here", label: "Getting here" },
  { href: "#faq", label: "FAQ" },
] as const;

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
