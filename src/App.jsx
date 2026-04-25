import { useState, useCallback } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Story from "./components/Story";

const App = () => {
  // Hero calls onAppReady() once its critical videos have loaded.
  // Until then we show the global spinner over the whole page.
  const [appReady, setAppReady] = useState(false);

  const handleAppReady = useCallback(() => {
    setAppReady(true);
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">

      {/* ── Global loading spinner ── */}
      {!appReady && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center
                        bg-violet-50 transition-opacity duration-500">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      {/* Pass the ready-callback down to Hero */}
      <Navbar />
      <Hero onReady={handleAppReady} />
      <About />
      <Features />
      <Story />
      <Contact />
      <Footer />
    </main>
  );
};

export default App;