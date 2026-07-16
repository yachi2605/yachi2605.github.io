import { useEffect, useRef, useState, lazy, Suspense } from "react";
import "./App.css";
import "./index.css";
import Lenis from "lenis";
import { Toaster } from "sonner";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import Manifesto from "./sections/Manifesto";
import Marquee from "./sections/Marquee";
import Projects from "./sections/Projects";
import Timeline from "./sections/Timeline";
import Skills from "./sections/Skills";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import Terminal from "./overlays/Terminal";
import CommandPalette from "./overlays/CommandPalette";
import CustomCursor from "./components/CustomCursor";
import { AchievementProvider } from "./context/Achievements";
import { canRenderWebGL } from "./three/capability";
import { initWebglPointer } from "./three/state";

// Lazy-load the Three.js bundle so hero text + CTAs paint and are interactive
// before the WebGL layer finishes loading.
const WebGLBackground = lazy(() => import("./three/WebGLBackground"));

function App() {
  const [termOpen, setTermOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [enable3D, setEnable3D] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      lerp: 0.09,
    });
    lenisRef.current = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const cleanup = initWebglPointer();
    // Defer the capability check + heavy bundle a tick past first paint.
    const id = setTimeout(() => setEnable3D(canRenderWebGL()), 0);
    return () => {
      clearTimeout(id);
      cleanup();
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      // Cmd/Ctrl + K opens palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      // Backtick opens terminal (ignore in inputs)
      if (
        e.key === "`" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        setTermOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setTermOpen(false);
        setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -60 });
    } else if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AchievementProvider>
      <div className="min-h-screen text-white relative">
        {enable3D && (
          <Suspense fallback={null}>
            <WebGLBackground />
          </Suspense>
        )}
        <CustomCursor />
        <div className="relative z-10">
          <Nav
            onOpenPalette={() => setPaletteOpen(true)}
            onOpenTerminal={() => setTermOpen(true)}
            jumpTo={jumpTo}
          />
          <Hero jumpTo={jumpTo} />
          <Projects />
          <Manifesto />
          <Marquee />
          <Timeline />
          <Skills />
          <Contact />
          <Footer onOpenTerminal={() => setTermOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />
        </div>

        <Terminal open={termOpen} setOpen={setTermOpen} jumpTo={jumpTo} />
        <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} jumpTo={jumpTo} />

        {/* Floating triggers */}
        <button
          data-testid="terminal-open-btn"
          onClick={() => setTermOpen(true)}
          className="fixed bottom-6 right-6 z-40 font-mono text-[11px] tracking-wider uppercase text-[#4ADE80] border border-white/10 bg-[#14172a] px-3 py-2 hover:border-[#5B73FF] transition-colors duration-300"
        >
          <span className="text-white/40 mr-2">$</span>terminal
          <span className="ml-2 text-white/30 hidden md:inline">` </span>
        </button>

        <Toaster
          theme="dark"
          position="bottom-left"
          toastOptions={{
            style: {
              background: "#14172a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "12px",
            },
          }}
        />
      </div>
    </AchievementProvider>
  );
}

export default App;
