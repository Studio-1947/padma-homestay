/**
 * All site copy and facts live here.
 *
 * Everything marked SAMPLE is placeholder data. Replace it with the real
 * details, then set `isSample` to false to hide the dev-only reminder ribbon.
 */

/** One of the 13 rooms, as listed on the old site (padmahomestay.com/rooms.php). */
export type Room = {
  /** The room's number in the old site's list. */
  n: number;
  floor: "Ground floor" | "First floor" | null;
  view: boolean;
  /** Per guest, per night, with all meals. */
  price: number;
  /** File in /public/images/rooms (webp), upscaled from the old site's photos. */
  image: string;
};

export type RoomType = {
  id: "double" | "triple" | "four";
  name: string;
  beds: string;
  minGuests: number;
  rooms: Room[];
};

export type MenuItem = { name: string; contents: string; price: number; image: string; alt: string };

export type Amenity = {
  id: "hotWater" | "campfire" | "trekking" | "sightseeing" | "pickup";
  title: string;
  body: string;
};

/** A photo in /public/images/food (webp). */
export type FoodPhoto = { image: string; alt: string; width: number; height: number };

export type Dish = FoodPhoto & { name: string; note: string };

export type Fact = { label: string; value: string };

export type GalleryItem = {
  /** File name in /public/images (webp). */
  image: string;
  alt: string;
  width: number;
  height: number;
};

export type Place = { id: string; name: string; distance: string; body: string; image: string };

export type Route = { id: "air" | "rail" | "road"; title: string; from: string; time: string; body: string };

export type Question = { question: string; answer: string };

export const site = {
  isSample: true,

  name: "Padma Homestay",
  region: "Dhotrey, West Bengal",
  // From the old site's footer.
  address: "Dhotrey, P.O. Bansbotay, Lodhoma Pul Bazar, Darjeeling 734201",
  mapsUrl: "https://www.google.com/maps?q=27.049883,88.113692",
  phoneDisplay: "+91 70476 66726",
  phoneHref: "tel:+917047666726",
  /** The other numbers listed on the old site. */
  otherPhones: [
    { display: "+91 62950 45952", href: "tel:+916295045952" },
    { display: "+91 87688 73121", href: "tel:+918768873121" },
  ],
  // SAMPLE: the old site's email link is broken (it points to another homestay's address)
  email: "hello@example.com",
  /** WhatsApp number in international format, digits only. SAMPLE: assumed to be the first phone number */
  whatsappNumber: "917047666726",
  currency: "INR",

  hero: {
    eyebrow: "Family-run homestay in Dhotrey, West Bengal",
    headline: "Wake up above the clouds.",
    subtext:
      "Thirteen clean, warm rooms, five home-cooked meals a day and the Kanchenjunga range outside. Come for a weekend, stay a week.",
  },

  intro: {
    statement:
      "Padma is our family home in Dhotrey, a small village at the edge of Singalila National Park. We keep thirteen rooms for guests, cook for them, and show them the trails we grew up on.",
    facts: [
      { label: "Altitude", value: "2,590 m" }, // SAMPLE: confirm
      { label: "Guest rooms", value: "13" },
      { label: "Meals a day", value: "5" },
      { label: "Per guest, all meals", value: "From ₹1,200" },
    ] satisfies Fact[],
  },

  view: {
    headline: "The ridge changes every hour.",
    body: "Clear peaks at dawn, fire on the snow at sunset, and more stars than you have ever seen. Every room looks out on it.",
    // One view through a day. Same framing in every photo, so they can fade into each other.
    phases: [
      {
        image: "ridge-morning",
        label: "Morning",
        time: "6 am",
        note: "First light turns the summits pink while the valley is still asleep.",
        alt: "A Land Rover and two tents on a grassy ridge at sunrise, with the Kanchenjunga range behind",
      },
      {
        image: "ridge-evening",
        label: "Evening",
        time: "5 pm",
        note: "The sun drops behind Nepal and the whole range catches fire.",
        alt: "The same ridge at sunset, the sky orange and violet above the snow peaks",
      },
      {
        image: "ridge-night",
        label: "Night",
        time: "10 pm",
        note: "No town lights for miles, so the Milky Way comes all the way down to the snow.",
        alt: "The same ridge at night under a sky full of stars and the Milky Way",
      },
    ],
  },

  // From the old site (padmahomestay.com/rooms.php), 13 rooms in three sizes.
  rooms: {
    headline: "Thirteen rooms, three sizes.",
    body: "Rooms for two, three or four, all clean and well furnished, with hot water. Prices are per guest and include every meal.",
    /** What every room's price covers. */
    included: ["Hot water", "Bed tea", "Breakfast", "Lunch", "Evening snacks", "Dinner"],
    // SAMPLE: the old site gives "Rs.1200/-(Min. 3 Person)". Read here as per guest, per night, with meals. Confirm.
    types: [
      {
        id: "double",
        name: "Double rooms",
        beds: "One double bed",
        minGuests: 2,
        rooms: [
          { n: 4, floor: "First floor", view: true, price: 1500, image: "5" },
          { n: 7, floor: "First floor", view: false, price: 1200, image: "8" },
          { n: 10, floor: "First floor", view: false, price: 1200, image: "10" },
        ],
      },
      {
        id: "triple",
        name: "Triple rooms",
        beds: "Three beds",
        minGuests: 3,
        rooms: [
          { n: 1, floor: null, view: true, price: 1500, image: "1" },
          { n: 6, floor: null, view: true, price: 1200, image: "7" },
          { n: 2, floor: null, view: false, price: 1200, image: "2" },
          { n: 3, floor: null, view: false, price: 1200, image: "4" },
          { n: 5, floor: null, view: false, price: 1200, image: "6" },
          { n: 11, floor: "Ground floor", view: false, price: 1200, image: "11" },
          { n: 12, floor: null, view: false, price: 1200, image: "12" },
        ],
      },
      {
        id: "four",
        name: "Four-bed rooms",
        beds: "Four beds",
        minGuests: 4,
        rooms: [
          { n: 9, floor: "First floor", view: false, price: 1200, image: "9" },
          { n: 13, floor: "Ground floor", view: false, price: 1200, image: "13" },
          // The old site reuses room 3's photo here; 3.jpg (unused there) is assumed to be this room.
          { n: 8, floor: "Ground floor", view: false, price: 1200, image: "3" },
        ],
      },
    ] satisfies RoomType[],
  },

  // The facilities listed on the old site. SAMPLE: the one-line descriptions are new, check them.
  amenities: {
    headline: "The essentials, sorted.",
    body: "Warm water, a fire at night, and help getting to the hills and back.",
    items: [
      { id: "hotWater", title: "Hot water", body: "Hot water in every room, whatever the weather outside." },
      { id: "campfire", title: "Campfire", body: "A fire outside on cold evenings, under more stars than you have seen." },
      { id: "trekking", title: "Trekking", body: "Help planning treks to Tonglu, Tumling and Sandakphu on the Singalila trail." },
      { id: "sightseeing", title: "Local sightseeing", body: "Day trips to the viewpoints, monasteries and villages around Dhotrey." },
      { id: "pickup", title: "Pickup and drop", body: "A car from Bagdogra, NJP, Darjeeling or Maneybhanjang, and back again." },
    ] satisfies Amenity[],
  },

  // From the old site's "Our Fooding" list.
  food: {
    headline: "From our kitchen.",
    body: "Everything is cooked at home. Stay on the package and every meal is covered, or order from the menu as you go.",
    package: {
      title: "The full-board package",
      body: "Bed tea, breakfast, lunch, evening snacks and dinner, every day of your stay.",
      price: "₹1,200 to ₹1,500 per guest, per night, room included",
    },
    // Photos from the homestay, upscaled 2x; originals in assets-src/food.
    spread: {
      image: "food/spread",
      alt: "Lunch from above: rice on brass plates, dal, chicken curry, vegetables, papad, salad and pickles",
      width: 2720,
      height: 2040,
    } satisfies FoodPhoto,
    kitchen: {
      image: "food/kitchen",
      alt: "The kitchen counter, lined with copper pots, kettles and steel chafing dishes",
      width: 764,
      height: 1020,
    } satisfies FoodPhoto,
    dishes: [
      { name: "Momo", note: "Steamed, with tomato chutney", image: "food/momo", alt: "A pot of steamed momos with a bowl of red chutney", width: 764, height: 1020 },
      { name: "Thukpa", note: "Noodles in broth, topped with chicken", image: "food/thukpa", alt: "Five bowls of noodles topped with shredded chicken", width: 764, height: 1020 },
      { name: "Pakora and tea", note: "The evening snack", image: "food/pakora", alt: "Two cups of milk tea beside a basket of onion pakoras and ketchup", width: 574, height: 1020 },
      { name: "Rice and curry", note: "Lunch on the long table", image: "food/bhat", alt: "Plates of rice with curries and dal on a wooden table", width: 764, height: 1020 },
    ] satisfies Dish[],
    menu: [
      {
        name: "Breakfast",
        contents: "Puri, sabji, egg or omelette, tea",
        price: 100,
        image: "food/breakfast",
        alt: "Puris with potato sabji, an omelette and a cup of milk tea",
      },
      {
        name: "Veg thali",
        contents: "Rice or roti, shag, dal, bhaji, sabji, salad, papad",
        price: 120,
        image: "food/veg-thali",
        alt: "A steel thali with rice, roti, papad, greens, dal, potato and mixed vegetables",
      },
      {
        name: "Egg thali",
        contents: "Rice or roti, shag, dal, bhaji, egg, salad, papad",
        price: 140,
        image: "food/egg-thali",
        alt: "A steel thali with rice, roti, papad, greens, dal, potato and egg curry",
      },
      {
        name: "Chicken thali",
        contents: "Rice or roti, shag, dal, bhaji, chicken, salad, papad",
        price: 180,
        image: "food/chicken-thali",
        alt: "A steel thali with rice, roti, papad, greens, dal, potato and chicken curry",
      },
    ] satisfies MenuItem[],
  },

  gallery: {
    headline: "A look around.",
    body: "The house, the rooms, the kitchen and the hills around them.",
    // Photos of the homestay, upscaled 2x; originals in assets-src/property.
    // Order matters: the grid alternates tall portraits with 2x2 landscapes.
    items: [
      { image: "property/property5", alt: "The homestay lit up at night, against a deep blue sky", width: 764, height: 1020 },
      { image: "property/property1", alt: "Prayer flags on the balcony, with the snow range above the clouds", width: 1360, height: 1020 },
      { image: "property/property7", alt: "A glass of black tea on the railing, the Kanchenjunga range behind it", width: 764, height: 1020 },
      { image: "property/property4", alt: "A wood-panelled room with a woven lamp and cane chairs by the window", width: 1348, height: 1020 },
      { image: "property/property", alt: "The house at dusk, fairy lights along the steps up to it", width: 1354, height: 1020 },
      { image: "property/property3", alt: "A bright room with three beds, a patterned tile floor and windows on two sides", width: 764, height: 1020 },
      { image: "property/property2", alt: "The dining room, with carved wooden tables and the kitchen counter behind", width: 1183, height: 665 },
      { image: "property/property6", alt: "A cup of tea held up to the morning view of the snow peaks and pine forest", width: 764, height: 1020 },
    ] satisfies GalleryItem[],
  },

  reviews: {
    headline: "What guests say.",
    body: "Straight from our Google reviews. Every rating is counted, including the hard ones.",
    // The reviews themselves are in reviews.json, built from assets-src/reviews by `npm run reviews`.
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
          "Yes. The room price is per guest and covers bed tea, breakfast, lunch, evening snacks and dinner. If you would rather order as you go, breakfast is ₹100 and a thali is ₹120 to ₹180.",
      },
      {
        question: "Is there a minimum number of guests?",
        answer:
          "Each room is priced for its full size: two guests in a double, three in a triple and four in a four-bed room.",
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
  { href: "#amenities", label: "Amenities" },
  { href: "#food", label: "Food" },
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
