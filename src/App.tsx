import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Intro } from "./components/Intro";
import { ParallaxView } from "./components/ParallaxView";
import { Rooms } from "./components/Rooms";
import { Amenities } from "./components/Amenities";
import { Food } from "./components/Food";
import { Gallery } from "./components/Gallery";
import { Reviews } from "./components/Reviews";
import { Nearby } from "./components/Nearby";
import { Location } from "./components/Location";
import { Faq } from "./components/Faq";
import { Booking } from "./components/Booking";
import { Footer } from "./components/Footer";
import { SampleRibbon } from "./components/SampleRibbon";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <ParallaxView />
        <Rooms />
        <Amenities />
        <Food />
        <Gallery />
        <Reviews />
        <Nearby />
        <Location />
        <Faq />
        <Booking />
      </main>
      <Footer />
      <SampleRibbon />
    </>
  );
}
