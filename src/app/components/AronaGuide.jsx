import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

// Nuevo: además de "ancho de pantalla", ahora también vigilamos la ALTURA.
// Antes, si la ventana se hacía corta (celular en horizontal, ventana de
// escritorio achicada), Arona seguía usando la misma escala grande de
// "intro" pensada para pantallas altas, y terminaba tapando casi todo.
function useViewportHeight() {
  const [height, setHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  useEffect(() => {
    const handler = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    return () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }, []);

  return height;
}

export function AronaGuide() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const viewportHeight = useViewportHeight();
  const isShort = viewportHeight < 560; // pantalla corta: celular en horizontal, ventana chica

  const [dialogue, setDialogue] = useState("");
  const [isIntro, setIsIntro] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const [emotion, setEmotion] = useState("normal");
  const [isTalking, setIsTalking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  const [bubbleVisible, setBubbleVisible] = useState(true);
  const autoHideRef = useRef(null);

  // Tamaño y escala ahora escalonados en 3 niveles (desktop / móvil / móvil
  // + pantalla corta) en vez de solo 2, así nunca se queda "grande" cuando
  // el espacio vertical disponible se reduce.
  const AVATAR_PX = isMobile ? (isShort ? 44 : 56) : 80;
  const INTRO_SCALE = isMobile ? (isShort ? 1.6 : 2.3) : 3.5;
  const introHalf = (AVATAR_PX * INTRO_SCALE) / 2;

  const bubblePos = isIntro
    ? { x: isMobile ? (isShort ? 44 : 64) : 120, y: isMobile ? (isShort ? -120 : -168) : -290 }
    : { x: isMobile ? 12 : 20, y: isMobile ? (isShort ? -50 : -64) : -90 };

  useEffect(() => {
    if (!dialogue) return;

    setIsTalking(true);
    setMouthOpen(true);

    const talkInterval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 200);

    const duration = Math.min(Math.max(dialogue.length * 50, 1500), 4000);

    const stopTimeout = setTimeout(() => {
      clearInterval(talkInterval);
      setIsTalking(false);
      setMouthOpen(false);
    }, duration);

    return () => {
      clearInterval(talkInterval);
      clearTimeout(stopTimeout);
    };
  }, [dialogue]);

  useEffect(() => {
    if (!isMobile || !dialogue) return;

    setBubbleVisible(true);
    if (autoHideRef.current) clearTimeout(autoHideRef.current);

    const talkDuration = Math.min(Math.max(dialogue.length * 50, 1500), 4000);
    const hideAfter = talkDuration + 1200;

    autoHideRef.current = setTimeout(() => {
      setBubbleVisible(false);
    }, hideAfter);

    return () => clearTimeout(autoHideRef.current);
  }, [dialogue, isMobile]);

  useEffect(() => {
    if (location.pathname === "/home" || location.pathname === "/") {
      setIsIntro(true);
      setEmotion("normal");
      setDialogue("¡Hola! Soy Arona. ¡Bienvenido al portafolio de René! ¿En qué te puedo ayudar hoy?");
    }
    else if (location.pathname === "/profile") {
      setIsIntro(false);
      setEmotion("surprised");
      setDialogue("¡René es increible !");
    }
    else if (location.pathname === "/technologies") {
      setIsIntro(false);
      setEmotion("surprised");
      setDialogue("Procesando stack tecnológico... ¡Wow! React, Node.js, Raspberry Pi, y hasta pentesting. ¡Excelente arsenal!");
    }
    else if (location.pathname === "/projects") {
      setIsIntro(false);
      setEmotion("smug");
      setDialogue("Todos los repositorios y sistemas están listos para tu inspección. Ese Sistema Biométrico luce muy seguro.");
    }
    else {
      setIsIntro(false);
      setEmotion("normal");
      setDialogue("Explorando el sistema... Usa el menú de navegación si quieres ver otra sección.");
    }
  }, [location.pathname]);

  const handleAronaClick = () => {
    const reactions = [
      { text: "¡Jajaja! ¡Haces cosquillas!", emotion: "blushing" },
      { text: "¿Estás buscando algo específico? Te recomiendo visitar la sección de Proyectos.", emotion: "normal" },
      { text: "Procesando bases de datos... ¡Todo seguro! Si quieres contactar a René, ve a la sección de Perfil.", emotion: "smug" },
      { text: "Puedes usar el dock de abajo en cualquier momento para moverte entre las páginas.", emotion: "normal" },
      { text: "¿Ya tomaste agua hoy?", emotion: "blushing" },
      { text: "¡Cargando el sistema Shittim Chest! Todos los módulos están listos para tu inspección.", emotion: "surprised" },
      { text: "Zzz... Leche de fresa...", emotion: "sleep" },
      { text: "Hehehe...", emotion: "sleep" },
      { text: "¿Dónde estará Plana?", emotion: "surprised" },
      { text: "Psst... toca el ícono de 'Tecnologías' si quieres ver el inventario completo de herramientas.", emotion: "smug" },
      { text: "Cada proyecto tiene su propio reporte, solo dale clic a la tarjeta para abrirlo.", emotion: "normal" },
      { text: "Si te pierdes, siempre puedes volver aquí tocando el logo Shittim Chest.", emotion: "normal" },
      { text: "¿Sabías que este portafolio también funciona con teclado? Prueba usar Tab y Enter.", emotion: "surprised" },
      { text: "René programa hasta con Raspberry Pi. ¿Qué te parece?", emotion: "smug" },
    ];

    const currentReaction = reactions[clickCount % reactions.length];

    setEmotion(currentReaction.emotion);
    setDialogue(currentReaction.text);
    setBubbleVisible(true);
    setClickCount(prev => prev + 1);
  };

  const getAronaImage = () => {
    switch (emotion) {
      case "blushing":
        return isTalking && mouthOpen ? "/aronaSonrojaHabla.png" : "/aronaSonroja.png";
      case "smug":
        return "/aronaSmug.png";
      case "surprised":
        return "/aronasorprendida.png";
      case "sleep":
        return "/aronaDormida.png";
      case "normal":
      default:
        return isTalking && mouthOpen ? "/aronaHablando.png" : "/arona.png";
    }
  };

  const showBubble = Boolean(dialogue) && (!isMobile || bubbleVisible);

  return (
    <div
      // bottom-3 / left-2 ahora respetan env(safe-area-inset-*), y en
      // pantallas cortas se acercan aún más a la esquina para robar el
      // mínimo espacio posible.
      className={`fixed z-50 flex items-end pointer-events-none ${
        isMobile
          ? `bottom-[max(0.6rem,env(safe-area-inset-bottom))] left-[max(0.5rem,env(safe-area-inset-left))]`
          : "bottom-8 left-8"
      }`}
    >
      <motion.div
        className="relative pointer-events-none"
        initial={false}
        animate={{
          // vh -> dvh: mismo motivo que en GameLayout, para que el cálculo
          // de centrado use la altura real visible en móvil, no la altura
          // "fantasma" que incluye la barra de direcciones del navegador.
          x: isIntro ? `calc(50vw - ${introHalf}px)` : "0px",
          y: isIntro ? `calc(-46dvh + ${introHalf}px)` : "0px",
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15, mass: 1 }}
      >

        <AnimatePresence>
          {showBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: bubblePos.x,
                y: bubblePos.y,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              onClick={() => isMobile && setBubbleVisible(false)}
              className={`absolute bottom-0 left-0 bg-white text-foreground px-4 py-3 rounded-2xl shadow-xl text-sm border border-blue-200 pointer-events-auto origin-bottom-left max-w-[70vw] ${
                isMobile ? "w-40 text-[11px] leading-snug px-3 py-2 cursor-pointer" : "w-60"
              }`}
            >
              <p className="font-medium text-slate-700 leading-tight">{dialogue}</p>
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-blue-200"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="pointer-events-auto cursor-pointer origin-bottom-left"
          animate={{ scale: isIntro ? INTRO_SCALE : 1 }}
          whileHover={{ scale: isIntro ? INTRO_SCALE + 0.1 : 1.1, y: -5 }}
          whileTap={{ scale: isIntro ? INTRO_SCALE - 0.1 : 0.95 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          onClick={handleAronaClick}
        >
          <img
            src={getAronaImage()}
            alt="Guía Arona"
            style={{ width: !isMobile ? 80 : AVATAR_PX, height: !isMobile ? 80 : AVATAR_PX }}
            className="object-contain drop-shadow-xl pointer-events-none select-none"
            draggable="false"
          />
        </motion.div>

      </motion.div>
    </div>
  );
}