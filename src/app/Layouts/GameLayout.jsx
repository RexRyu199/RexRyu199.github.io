import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { AronaGuide } from "../components/AronaGuide";

export function GameLayout() {
  const location = useLocation();

  // Motion Values: no provocan renders de React, Framer Motion las anima
  // directamente en el hilo de composición.
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorScaleTarget = useMotionValue(1);

  const cursorX = useSpring(mouseX, { stiffness: 700, damping: 35, mass: 0.3 });
  const cursorY = useSpring(mouseY, { stiffness: 700, damping: 35, mass: 0.3 });
  const cursorScale = useSpring(cursorScaleTarget, { stiffness: 700, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 20);
      mouseY.set(e.clientY - 20);
    };

    // Antes: setIsClicking(true/false) -> re-render de todo GameLayout (Outlet incluido).
    // Ahora: solo actualiza un motion value, sin pasar por React.
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
  }, [mouseX, mouseY, cursorScaleTarget]);

  const isIntroOrLoading =
    location.pathname === "/" || location.pathname === "/loading";

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background bg-dots font-sans cursor-none">

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

      {/* Cursor: ahora x, y y scale son 100% motion values, cero renders de React */}
      <motion.div
        className="fixed top-0 left-0 z-[100] pointer-events-none w-10 h-10 rounded-full border-4 border-yellow-400/60 bg-yellow-400/20 backdrop-blur-[1px] flex items-center justify-center will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
        }}
      >
        <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
      </motion.div>

    </div>
  );
}