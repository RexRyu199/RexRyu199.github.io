import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";

export function AronaGuide() {
  const location = useLocation();
  
  // Estados principales
  const [dialogue, setDialogue] = useState("");
  const [isIntro, setIsIntro] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  
  // Nuevos estados para la animación y emociones
  const [emotion, setEmotion] = useState("normal"); // "normal", "blushing", "smug", "surprised"
  const [isTalking, setIsTalking] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  // Efecto que controla la animación de hablar cada vez que cambia el diálogo
  useEffect(() => {
    if (!dialogue) return;

    setIsTalking(true);
    setMouthOpen(true);

    // Alternar la boca cada 200 milisegundos
    const talkInterval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 200);

    // Calcular cuánto tiempo debe hablar basado en la longitud del texto
    // (Aproximadamente 50ms por letra, mínimo 1.5s, máximo 4s)
    const duration = Math.min(Math.max(dialogue.length * 50, 1500), 4000);

    // Detener la animación de hablar después del tiempo calculado
    const stopTimeout = setTimeout(() => {
      clearInterval(talkInterval);
      setIsTalking(false);
      setMouthOpen(false); // Asegurarse de cerrar la boca al terminar
    }, duration);

    // Limpieza: si el diálogo cambia antes de que termine, resetea los contadores
    return () => {
      clearInterval(talkInterval);
      clearTimeout(stopTimeout);
    };
  }, [dialogue]);

  // Manejo de rutas y sus emociones iniciales
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
    // Convertimos el arreglo en objetos para asignar una emoción a cada frase
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
    setClickCount(prev => prev + 1);
  };

  // Función para determinar qué imagen renderizar
  const getAronaImage = () => {
    switch (emotion) {
      case "blushing":
        return isTalking && mouthOpen ? "/aronaSonrojaHabla.png" : "/aronaSonroja.png";
      case "smug":
        return "/aronaSmug.png"; // No tiene variante hablando
      case "surprised":
        return "/aronasorprendida.png"; // No tiene variante hablando
      case "sleep":
        return "/aronaDormida.png";
      case "normal":
      default:
        return isTalking && mouthOpen ? "/aronaHablando.png" : "/arona.png";
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50 flex items-end pointer-events-none">
      <motion.div
        className="relative pointer-events-none"
        initial={false}
        animate={{
          x: isIntro ? "calc(50vw - 172px)" : "0px",
          y: isIntro ? "calc(-46vh + 172px)" : "0px",
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15, mass: 1 }}
      >

        {/* Globo de Texto */}
        <AnimatePresence>
          {dialogue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: isIntro ? 120 : 20,
                y: isIntro ? -290 : -90
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="absolute bottom-0 left-0 bg-white text-foreground px-4 py-3 rounded-2xl shadow-xl w-60 text-sm border border-blue-200 pointer-events-auto origin-bottom-left"
            >
              <p className="font-medium text-slate-700 leading-tight">{dialogue}</p>
              <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-blue-200"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personaje */}
        <motion.div
          className="pointer-events-auto cursor-pointer origin-bottom-left"
          animate={{ scale: isIntro ? 3.5 : 1 }}
          whileHover={{ scale: isIntro ? 3.6 : 1.1, y: -5 }}
          whileTap={{ scale: isIntro ? 3.4 : 0.95 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          onClick={handleAronaClick}
        >
          {/* Aquí inyectamos la imagen dinámica */}
          <img
            src={getAronaImage()}
            alt="Guía Arona"
            className="w-20 h-20 object-contain drop-shadow-xl pointer-events-none select-none"
            draggable="false"
          />
        </motion.div>

      </motion.div>
    </div>
  );
}