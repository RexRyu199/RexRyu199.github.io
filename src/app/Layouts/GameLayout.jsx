import { Outlet, useLocation } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { AronaGuide } from "../components/AronaGuide";

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(
    typeof window !== "undefined" ? window.matchMedia("(pointer: coarse)").matches : false
  );

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const handler = (e) => setIsTouch(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isTouch;
}

let rippleIdCounter = 0;

export function GameLayout() {
  const location = useLocation();
  const isTouch = useIsTouchDevice();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorScaleTarget = useMotionValue(1);

  const cursorX = useSpring(mouseX, { stiffness: 700, damping: 35, mass: 0.3 });
  const cursorY = useSpring(mouseY, { stiffness: 700, damping: 35, mass: 0.3 });
  const cursorScale = useSpring(cursorScaleTarget, { stiffness: 700, damping: 30 });

  const [ripples, setRipples] = useState([]);
  const rippleTimeouts = useRef(new Map());

  const spawnRipple = useCallback((x, y) => {
    const id = ++rippleIdCounter;
    setRipples((prev) => [...prev, { id, x, y }]);

    const timeoutId = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
      rippleTimeouts.current.delete(id);
    }, 500);

    rippleTimeouts.current.set(id, timeoutId);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 20);
      mouseY.set(e.clientY - 20);
    };

    const handleMouseDown = () => cursorScaleTarget.set(0.8);
    const handleMouseUp = () => cursorScaleTarget.set(1);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTouch, mouseX, mouseY, cursorScaleTarget]);

  useEffect(() => {
    if (!isTouch) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (touch) spawnRipple(touch.clientX, touch.clientY);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [isTouch, spawnRipple]);

  useEffect(() => {
    return () => {
      rippleTimeouts.current.forEach(clearTimeout);
      rippleTimeouts.current.clear();
    };
  }, []);

  const isIntroOrLoading =
    location.pathname === "/" || location.pathname === "/loading";

  return (
    // w-screen -> w-full: evita desbordes horizontales sutiles en móvil.
    // h-screen -> h-[100dvh]: "dvh" se ajusta a la altura REAL visible del
    // navegador móvil (sin la barra de direcciones), a diferencia de "vh"
    // que incluye espacio que en realidad no se ve. Esto es lo que causaba
    // que la página pareciera más grande que la pantalla y que el scroll
    // no llegara hasta el final: el contenedor raíz medía más de lo visible
    // y tenía overflow-hidden, atrapando ese sobrante fuera de alcance.
    <div className="relative w-full h-[100dvh] overflow-hidden bg-background bg-dots font-sans">
      <div
        className={`absolute inset-0 ${isTouch ? "" : "cursor-none"}`}
      >
        {/* Fondo */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/40 blur-[150px] rounded-full" />
        </div>

        {/* Contenido */}
        <div className="relative z-10 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        {!isIntroOrLoading && (
          <AronaGuide currentLocation={location.pathname} />
        )}

        {!isTouch && (
          <motion.div
            className="fixed top-0 left-0 z-[100] pointer-events-none w-10 h-10 rounded-full border-4 border-yellow-400/60 bg-yellow-400/20 backdrop-blur-[1px] flex items-center justify-center will-change-transform"
            style={{ x: cursorX, y: cursorY, scale: cursorScale }}
          >
            <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
          </motion.div>
        )}

        {isTouch && (
          <div className="fixed inset-0 z-[100] pointer-events-none">
            <AnimatePresence>
              {ripples.map((ripple) => (
                <motion.div
                  key={ripple.id}
                  className="absolute w-10 h-10 rounded-full border-2 border-cyan-400/70 bg-cyan-400/20"
                  style={{ left: ripple.x - 20, top: ripple.y - 20 }}
                  initial={{ scale: 0.4, opacity: 0.9 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}