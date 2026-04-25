import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

// ─── BENTO TILT ───────────────────────────────────────────────────────────────
const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef();

  const handleMouseMove = (e) => {
    if (!itemRef.current) return;
    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - left) / width;
    const relativeY = (e.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 22;
    const tiltY = (relativeX - 0.5) * -22;
    setTransformStyle(
      `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.97,0.97,0.97)`
    );
  };

  const handleMouseLeave = () => setTransformStyle("");

  return (
    <div
      className={className}
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.12s ease-out" }}
    >
      {children}
    </div>
  );
};

// ─── BENTO CARD ───────────────────────────────────────────────────────────────
const BentoCard = ({ src, title, description, tag }) => {
  return (
    <div className="relative size-full overflow-hidden">
      {/* video background */}
      <video
        src={src}
        loop
        muted
        autoPlay
        playsInline
        preload="none"          // lazy — loads only when in viewport
        className="absolute left-0 top-0 size-full object-cover object-center"
      />

      {/* dark gradient overlay for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* top-right tag */}
      {tag && (
        <div
          className="absolute right-4 top-4 z-10 text-[9px] uppercase tracking-[0.35em]"
          style={{
            color: "rgba(167,139,250,0.7)",
            fontFamily: "monospace",
          }}
        >
          {tag}
        </div>
      )}

      {/* bottom-left scan line accent */}
      <div
        className="absolute bottom-0 left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)",
        }}
      />

      {/* content */}
      <div className="relative z-10 flex size-full flex-col justify-end p-5 text-blue-50">
        <h1 className="bento-title special-font">{title}</h1>
        {description && (
          <p className="mt-2 max-w-64 text-xs leading-relaxed text-blue-100/75 md:text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = () => {
  const ref = useRef(null);

  useEffect(() => {
    gsap.from(ref.current.children, {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
      },
    });
  }, []);

  return (
    <div ref={ref} className="px-5 py-32">
      {/* eyebrow */}
      <div className="mb-3 flex items-center gap-3">
        <span
          className="h-px w-10"
          style={{
            background: "linear-gradient(90deg, transparent, #7c3aed)",
          }}
        />
        <span
          className="text-[9px] uppercase tracking-[0.4em]"
          style={{ color: "#7c3aed", fontFamily: "monospace" }}
        >
          FEATURE INDEX // v2.0
        </span>
      </div>

      <p className="font-circular text-lg font-semibold text-blue-50">
        Enter Into Meta Gamic Layer
      </p>
      <p className="mt-3 max-w-md font-circular text-base leading-relaxed text-blue-50/70">
        Immerse yourself in a rich and ever-expanding universe, where a vibrant
        array of products converge into an interconnected overlay experience on
        your world.
      </p>
    </div>
  );
};

// ─── FEATURES ─────────────────────────────────────────────────────────────────
const Features = () => {
  const gridRef = useRef(null);

  // stagger-reveal bento cards on scroll
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".bento-reveal");
    gsap.from(cards, {
      y: 50,
      opacity: 0,
      scale: 0.96,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 82%",
      },
    });
  }, []);

  return (
    <section className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <SectionHeader />

        {/* ── HERO BENTO — full-width feature card ── */}
        <BentoTilt className="bento-reveal border-hsla relative mb-7 h-96 w-full
          overflow-hidden rounded-2xl md:h-[65vh]"
          style={{
            boxShadow: "0 0 0 1px rgba(139,92,246,0.15), 0 32px 80px rgba(0,0,0,0.6)",
          }}
        >
          <BentoCard
            src="videos/feature-1.mp4"
            tag="FEATURED // 01"
            title={<>radi<b>n</b>t</>}
            description="A cross-platform metagame app, creating a whole new view on gaming
              as a whole — turning your activities on web2 & web3 games into a rewarding
              adventure. #MetaJoyStick"
          />
        </BentoTilt>

        {/* ── GRID ── */}
        <div
          ref={gridRef}
          className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7"
        >
          {/* Zigma — tall left card */}
          <BentoTilt className="bento-reveal bento-tilt_1 row-span-1 md:col-span-1
            md:row-span-2 overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.12)" }}
          >
            <BentoCard
              src="/videos/feature-2.mp4"
              tag="NFT // 02"
              title={<>Zig<b>m</b>a</>}
              description="An anime and gaming inspired NFT collection — the IP primed for expansion."
            />
          </BentoTilt>

          {/* Nexus */}
          <BentoTilt className="bento-reveal bento-tilt_1 row-span-1 ms-32
            overflow-hidden rounded-2xl md:col-span-1 md:ms-0"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.12)" }}
          >
            <BentoCard
              src="/videos/feature-3.mp4"
              tag="SOCIAL // 03"
              title={<>n<b>e</b>xus</>}
              description="MetaJoyStick — a gaming social hub adding a new dimension of play
                to social interaction for web2 & web3 communities."
            />
          </BentoTilt>

          {/* Azul */}
          <BentoTilt className="bento-reveal bento-tilt_1 me-14 overflow-hidden
            rounded-2xl md:col-span-1 md:me-0 mix-blend-difference"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.12)" }}
          >
            <BentoCard
              src="/videos/feature-4.mp4"
              tag="AI // 04"
              title={<>az<b>u</b>l</>}
              description="A cross-world AI Agent elevating and enhancing your gameplay
                experience to be more fun and productive."
            />
          </BentoTilt>

          {/* Coming soon */}
          <div className="bento-reveal bento-tilt_2">
            <BentoTilt
              className="flex size-full flex-col justify-between overflow-hidden
              rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)",
                boxShadow:
                  "0 0 0 1px rgba(139,92,246,0.3), 0 0 40px rgba(109,40,217,0.25)",
              }}
            >
              {/* grid texture overlay */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10">
                <span
                  className="mb-3 block text-[8px] uppercase tracking-[0.4em]"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}
                >
                  COMING SOON
                </span>
                <h1 className="bento-title special-font max-w-64 text-white">
                  <b>m</b>ore coming soo<b>n</b>
                </h1>
              </div>
              <TiLocationArrow
                className="relative z-10 m-5 self-end scale-[4] text-white/80
                md:scale-[5]"
              />
            </BentoTilt>
          </div>

          {/* Feature 5 video */}
          <BentoTilt className="bento-reveal bento-tilt_2 overflow-hidden rounded-2xl"
            style={{ boxShadow: "0 0 0 1px rgba(139,92,246,0.12)" }}
          >
            <video
              src="videos/feature-5.mp4"
              loop
              muted
              autoPlay
              playsInline
              preload="none"
              className="size-full object-cover object-center"
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;