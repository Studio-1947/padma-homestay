import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { ParallaxView } from "./components/ParallaxView";
import { Rooms } from "./components/Rooms";
import { Stay } from "./components/Stay";
import { Day } from "./components/Day";
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
        <ParallaxView />
        <Rooms />
        <Stay />
        <Day />
        <Booking />
      </main>
      <Footer />
      <SampleRibbon />
    </>
  );
}
