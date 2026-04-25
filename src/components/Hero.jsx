import { useRef, useState, useEffect, useCallback } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const CDN_BASE = import.meta.env.VITE_VIDEO_CDN_BASE ?? "/videos";
const totalVideos = 4;

const IS_MOBILE =
  typeof window !== "undefined" &&
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

// FIX 1: Remove the -mobile.mp4 variant — those files likely don't exist,
// causing a 404 that silently stalls loading on mobile. Use one mp4 path only.
const getVideoAssets = (index) => ({
  webm: `${CDN_BASE}/hero-${index}.webm`,
  mp4: `${CDN_BASE}/hero-${index}.mp4`,
  poster: `${CDN_BASE}/hero-${index}-poster.jpg`,
});

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
const Hero = ({ onReady }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [prevIndex, setPrevIndex] = useState(null);
  const [hasClicked, setHasClicked] = useState(false);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [miniReady, setMiniReady] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const readyFired = useRef(false);

  const nextVideoRef = useRef(null);
  const currentVideoRef = useRef(null);
  const outgoingBgRef = useRef(null);
  const rippleRef = useRef(null);

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1;

  // ── Video load counter ────────────────────────────────────────────────────
  const handleVideoLoad = useCallback(() => {
    setLoadedVideos((prev) => prev + 1);
  }, []);

  // FIX 2: Don't gate onReady on loadedVideos count — on mobile, the second
  // video (mini preview) may never load. Fire onReady as soon as the BG video
  // (the only critical one) is ready, with a fallback timeout so the page
  // never stays stuck if videos are slow.
  useEffect(() => {
    if (loadedVideos >= 1 && !readyFired.current) {
      readyFired.current = true;
      onReady?.();
    }
  }, [loadedVideos, onReady]);

  // FIX 3: Guaranteed fallback — if no video fires onLoadedData within 4s
  // (e.g. slow connection, browser autoplay restrictions), unblock the page.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!readyFired.current) {
        readyFired.current = true;
        onReady?.();
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [onReady]);

  // ── Welcome popup ─────────────────────────────────────────────────────────
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) setShowWelcomePopup(true);
  }, []);

  const handleClosePopup = () => {
    setShowWelcomePopup(false);
    localStorage.setItem("hasVisitedBefore", "true");
  };

  // ── Mini preview: mobile loads after BG, desktop loads on hover ───────────
  useEffect(() => {
    if (IS_MOBILE && loadedVideos >= 1) {
      const t = setTimeout(() => setMiniReady(true), 2000);
      return () => clearTimeout(t);
    }
  }, [loadedVideos]);

  const handleMiniVideoHover = () => {
    if (!miniReady) setMiniReady(true);
  };

  // ── Click / tap: transition ───────────────────────────────────────────────
  const handleMiniVideoClick = () => {
    setPrevIndex(currentIndex);
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
    setMiniReady(false);
  };

  // ── GSAP: warp + crossfade ────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!hasClicked) return;
      const tl = gsap.timeline();

      gsap.set("#next-video", { visibility: "visible", opacity: 1 });

      if (rippleRef.current) {
        gsap.set(rippleRef.current, {
          scale: 0,
          opacity: 0.8,
          display: "block",
        });
        tl.to(
          rippleRef.current,
          { scale: 5, opacity: 0, duration: 0.85, ease: "power2.out" },
          0
        );
      }

      tl.to(
        "#next-video",
        {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power3.inOut",
          onStart: () => nextVideoRef.current?.play(),
        },
        0
      );

      tl.from(
        "#current-video",
        {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.4,
          ease: "elastic.out(1, 0.65)",
        },
        0
      );

      if (outgoingBgRef.current) {
        tl.to(
          outgoingBgRef.current,
          {
            opacity: 0,
            duration: 0.75,
            ease: "power1.inOut",
            onComplete: () => setPrevIndex(null),
          },
          0.15
        );
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  // ── GSAP: scroll clip-path ────────────────────────────────────────────────
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
      borderRadius: "0 0 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  // ── Asset helpers ─────────────────────────────────────────────────────────
  const bgAssets = getVideoAssets(currentIndex);
  const nextAssets = getVideoAssets(currentIndex);
  const miniAssets = getVideoAssets(upcomingVideoIndex);
  const prevAssets = prevIndex ? getVideoAssets(prevIndex) : null;

  return (
    <div id="lobby" className="relative h-dvh w-screen overflow-x-hidden">
      {/* ── Main frame ── */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black"
      >
        {/* ── Welcome popup ── */}
        {showWelcomePopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="bg-blue-50 rounded-lg p-8 max-w-md mx-4">
              <h2 className="text-4xl font-special text-violet-700 font-family-zentry mb-4">
                welcome!
              </h2>
              <p className="mb-6 font-robert-regular">
                Toggle the audio wave icon at the top right corner or on Desktop
                the Icon after contact in the navbar to play our theme song!
              </p>
              <button
                onClick={handleClosePopup}
                className="bg-violet-500 text-white px-6 py-2 rounded-4xl hover:bg-violet-700"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Outgoing BG — fades out, prevents white gap */}
        {prevAssets && (
          <video
            ref={outgoingBgRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={prevAssets.poster}
            className="absolute left-0 top-0 size-full object-cover object-center"
            style={{ zIndex: 0 }}
          >
            {/* FIX 4: On mobile, skip webm — it adds a request that can race
                with mp4 and cause stalls on low-bandwidth connections. */}
            {!IS_MOBILE && (
              <source src={prevAssets.webm} type="video/webm" />
            )}
            <source src={prevAssets.mp4} type="video/mp4" />
          </video>
        )}

        {/* Incoming BG — always playing underneath */}
        <video
          key={`bg-${currentIndex}`}
          autoPlay
          loop
          muted
          playsInline
          // FIX 5: Use "auto" on mobile too — "metadata" means the browser
          // downloads just enough to show dimensions/duration. Combined with
          // autoPlay, many mobile browsers won't start playing reliably.
          // "auto" lets the browser download and play as aggressively as it wants.
          preload="auto"
          poster={bgAssets.poster}
          className="absolute left-0 top-0 size-full object-cover object-center"
          style={{ zIndex: 1 }}
          onLoadedData={handleVideoLoad}
          // FIX 6: Also listen for canplay — fires earlier than loadedData
          // on slow connections and is enough to know the video will play.
          onCanPlay={handleVideoLoad}
        >
          {!IS_MOBILE && <source src={bgAssets.webm} type="video/webm" />}
          <source src={bgAssets.mp4} type="video/mp4" />
        </video>

        {/* Ripple burst overlay */}
        <div
          ref={rippleRef}
          className="absolute-center absolute pointer-events-none"
          style={{
            zIndex: 55,
            display: "none",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(139,92,246,0.18) 50%, transparent 72%)",
            boxShadow: "0 0 80px 30px rgba(139,92,246,0.25)",
          }}
        />

        {/* ── Mini preview thumbnail ── */}
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer rounded-3xl overflow-hidden">
            <div
              onMouseEnter={handleMiniVideoHover}
              onClick={handleMiniVideoClick}
              className="origin-center scale-50 opacity-0 transition-all duration-500
                         ease-in hover:scale-100 hover:opacity-100"
            >
              {/* FIX 7: Don't put src directly on <video> AND use <source> children —
                  pick one pattern. We use <source> children only (the correct pattern),
                  and control loading via the key prop so React remounts the element
                  when miniReady flips, triggering a fresh load. */}
              <video
                key={miniReady ? "mini-ready" : "mini-poster"}
                ref={currentVideoRef}
                id="current-video"
                loop
                muted
                playsInline
                autoPlay={miniReady}
                preload={miniReady ? "auto" : "none"}
                poster={miniAssets.poster}
                className="size-64 origin-center scale-150 object-cover object-center"
                onLoadedData={handleVideoLoad}
              >
                {miniReady && (
                  <>
                    {!IS_MOBILE && (
                      <source src={miniAssets.webm} type="video/webm" />
                    )}
                    <source src={miniAssets.mp4} type="video/mp4" />
                  </>
                )}
              </video>
            </div>
          </div>

          {/* Portal video — expands to fullscreen on click */}
          <video
            key={currentIndex}
            ref={nextVideoRef}
            id="next-video"
            loop
            muted
            playsInline
            preload="auto"
            poster={nextAssets.poster}
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          >
            {!IS_MOBILE && <source src={nextAssets.webm} type="video/webm" />}
            <source src={nextAssets.mp4} type="video/mp4" />
          </video>
        </div>

        {/* Text / CTA */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>a</b>meic
        </h1>
        <div className="absolute left-0 top-0 size-full z-40">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              Redefi<b>n</b><b>e</b>
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Meta Gamic Space <br />
              Unleash your Gaming potential with MetaJoyStick.
            </p>
            <Button
              id="watch-trailer"
              title="Watch Trailer"
              leftIcon={<TiLocationArrow />}
              containerClass="!bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>

      {/* Shadow headings behind the frame */}
      <h1 className="special-font hero-heading absolute top-0 left-0 text-black z-0 mt-24 px-5 sm:px-10">
        Redefi<b>n</b><b>e</b>
      </h1>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>a</b>meic
      </h1>
    </div>
  );
};

export default Hero;