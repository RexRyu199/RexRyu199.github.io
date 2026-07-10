import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useMemo, memo } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Code2, X, TerminalSquare } from "lucide-react";

// Transiciones simplificadas para reducir la carga de renderizado
const LAYOUT_TRANSITION = { type: "spring", bounce: 0, duration: 0.4 };
const ENTER_TRANSITION = { duration: 0.3, ease: "easeOut" };

const PROJECTS = [
  {
    id: "biometric",
    name: "Sistema Biométrico de Control de Acceso",
    technologies: "React Native, Node.js, Raspberry Pi, MySQL",
    category: "Hardware & Full Stack",
    status: "Completado",
    image: "/projects/biometrics.png",
    description: "Solución integral que interconecta hardware y software a nivel de producción. El flujo de datos inicia en una App Móvil, pasa por una API en Node.js, llega a una Raspberry Pi que controla un sensor de huellas por comunicación serial, y finaliza registrando la validación en MySQL.",
    details: [
      "Flujo de Datos: App Móvil -> API Node.js -> Raspberry Pi -> Sensor de huellas -> Base de Datos MySQL.",
      "Desarrollo de scripts en Python para control del lector biométrico mediante GPIO y UART.",
      "Comunicación serial y automatización de procesos locales."
    ],
    bg: "bg-blue-500",
    codeSnippet: `// Hardware Integration Snapshot\nconst sensor = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 });\n\nsensor.on('data', async (data) => {\n  const fingerprintId = parseBiometricData(data);\n  const auth = await validateUserInDatabase(fingerprintId);\n  if (auth.success) unlockRelay();\n});`
  },
  {
    id: "fitness",
    name: "Gestión Fitness",
    technologies: "React, Vite, Tailwind CSS, Nginx, VPS Linux",
    category: "Web Frontend & VPS",
    status: "Completado",
    image:"/projects/fitness.png", 
    description: "Plataforma web construida con React, Vite y Tailwind CSS (JSX en todos los componentes), enfocada en rendimiento. Hago uso intensivo de funciones asíncronas y Promise.all para paralelizar llamadas y mantener una UX fluida. El sistema está desplegado en un servidor VPS Linux propio, con Nginx configurado como proxy inverso.",
    details: [
      "Componentes en React + JSX, con Vite como bundler y Tailwind CSS para el diseño.",
      "Uso intensivo de funciones asíncronas (async/await, Promise.all) para carga de datos en paralelo.",
      "Despliegue en VPS Linux propio, con Nginx como proxy inverso frente a la aplicación."
    ],
    link: "https://rene.utportfolio.cloud",
    bg: "bg-indigo-500",
    codeSnippet: `// Performance Optimization\nconst fetchData = async () => {\n  const result = await Promise.all([getWorkouts(), getNutrition()]);\n  setPerformanceState(result);\n};`
  },
  {
    id: "antojos",
    name: "AntojosExpress",
    technologies: "Loyverse POS, Impresora Térmica, Full Stack",
    category: "Sistemas Administrativos",
    status: "Completado",
    image: "/projects/antojos.png",
    description: "Sistema de control de inventario en tiempo real para un negocio de distribución de dulces, integrado con una impresora térmica portátil para generar tickets de venta al instante, todo utilizando Loyverse como base del punto de venta.",
    details: [
      "Validación de inventario en tiempo real integrada directamente en el botón de compra final.",
      "Integración con impresora térmica portátil para generar el ticket inmediatamente tras la venta.",
      "Todo el flujo construido sobre Loyverse POS."
    ],
    bg: "bg-green-500",
    codeSnippet: `// Purchase Button Validation Handler\nconst handleFinalPurchase = async (cart) => {\n  const isValid = await validateRealTimeInventory(cart);\n  if (!isValid) throw new Error("Stock mismatch detected!");\n  \n  await triggerThermalPrinter(cart);\n  await syncWithLoyverseAPI(cart);\n};`
  },
  {
    id: "tickethub",
    name: "TicketHub",
    technologies: "React, Firebase Auth, Realtime Database",
    category: "Web & Nube",
    status: "Completado",
    image: null,
    description: "Plataforma para la gestión y distribución de tickets. Se superaron desafíos de configuración modular en React, logrando una arquitectura orientada a eventos en tiempo real mediante la integración de servicios cloud de autenticación y bases de datos.",
    details: [
      "Integración de Firebase (Autenticación y Realtime Database).",
      "Arquitectura orientada a eventos en tiempo real.",
      "Configuración modular avanzada de componentes React."
    ],
    bg: "bg-purple-500",
    codeSnippet: `// Event-Driven Firebase Listener\nuseEffect(() => {\n  const ticketsRef = ref(db, 'active_tickets');\n  const unsubscribe = onValue(ticketsRef, (snapshot) => {\n    updateDashboardRealtime(snapshot.val());\n  });\n  return () => unsubscribe();\n}, []);`
  },
  {
    id: "crm_accesos",
    name: "CRM - RH Accesos",
    technologies: "Workflows, WhatsApp API, UX/UI",
    category: "Automatización",
    status: "Completado",
    image: "/projects/crm.png", 
    description: "Proyecto desarrollado para la empresa RH Accesos. Diseño de flujos de trabajo automatizados para atención al cliente y optimización de ventas de puertas de seguridad, con bots interactivos y conectores a través de la API oficial de WhatsApp Business.",
    details: [
      "Desarrollo de chatbots interactivos conectados a la API oficial de WhatsApp Business.",
      "Mantenimiento del sitio web rhaccesos.com.",
      "Optimización de UX/UI para flujos de comunicación con el cliente."
    ],
    link: "https://rhaccesos.com",
    bg: "bg-orange-500",
    codeSnippet: `// WA Business API Webhook\napp.post('/webhook', (req, res) => {\n  const message = req.body.entry[0].changes[0].value.messages[0];\n  if (message.text.body.includes('puerta de seguridad')) {\n    triggerSalesFunnelWorkflow(message.from);\n  }\n  res.sendStatus(200);\n});`
  },
  {
    id: "ciberseguridad",
    name: "CTF & Ciberseguridad",
    technologies: "Burp Suite, Nmap, Gobuster, SSDLC",
    category: "Seguridad Informática",
    status: "Completado",
    image: "/projects/ciberseguridad.png",
    description: "Resolución de entornos CTF (Capture The Flag). Prácticas de auditoría de software, descubrimiento de vulnerabilidades y documentación técnica de fallos usando metodologías estructuradas.",
    details: [
      "Auditoría de software y descubrimiento de vulnerabilidades.",
      "Documentación técnica bajo metodologías SSDLC.",
      "Uso de herramientas profesionales (Burp Suite, Nmap, OwaspZap)."
    ],
    bg: "bg-red-500",
    codeSnippet: `// Security Audit Workflow\nconst runVulnerabilityScan = async (target) => {\n  await nmapScan(target);\n  await gobusterDirBusting(target);\n  await reportFindings(owaspChecklist);\n};`
  }
];

// Componente optimizado estilo Widget de App
const ProjectCard = memo(function ProjectCard({ project, index, isDevMode, onSelect }) {
  return (
    <motion.div
      layoutId={`card-container-${project.id}`}
      onClick={() => onSelect(project.id)}
      className={`w-full aspect-square md:aspect-auto md:h-56 rounded-[2rem] p-5 md:p-6 cursor-pointer relative overflow-hidden shadow-lg group transition-colors duration-300 flex flex-col ${
        isDevMode ? 'bg-zinc-900 border border-zinc-700' : project.bg + ' hover:brightness-105'
      }`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...ENTER_TRANSITION, delay: index * 0.04 }}
      whileTap={{ scale: 0.96 }} // Efecto de pulsación ligero
    >
      {!isDevMode && <div className="absolute inset-0 bg-dots opacity-30 mix-blend-overlay pointer-events-none" />}

      {isDevMode ? (
        <div className="w-full h-full text-green-400 font-mono text-[10px] md:text-xs overflow-hidden">
          <span className="text-purple-400">const</span> <span className="text-blue-300">{project.id}</span> = <br/>
          <span className="text-yellow-300">"{project.name}"</span>;
          <br /><br />
          <span className="text-zinc-500">// {project.category}</span>
        </div>
      ) : (
        <>
          <div className="bg-white/20 p-3 rounded-2xl w-fit text-white backdrop-blur-md shadow-sm">
            <Code2 size={28} strokeWidth={1.5} />
          </div>
          
          <div className="mt-auto relative z-10 w-full">
            <motion.h2 layoutId={`card-title-${project.id}`} transition={{ layout: LAYOUT_TRANSITION }} className="text-lg md:text-xl font-bold text-white drop-shadow-sm leading-tight mb-1">
              {project.name}
            </motion.h2>
            <p className="text-[11px] md:text-xs font-semibold text-white/80 uppercase tracking-wider">
              {project.category}
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
});

export function ProjectsScreen() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(null);
  const [isDevMode, setIsDevMode] = useState(false);

  const selectedProject = useMemo(
    () => PROJECTS.find((p) => p.id === selectedId) ?? null,
    [selectedId]
  );

  const selectedTechList = useMemo(
    () => (selectedProject ? selectedProject.technologies.split(", ") : []),
    [selectedProject]
  );

  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const handleClose = useCallback(() => setSelectedId(null), []);
  const handleToggleDevMode = useCallback(() => setIsDevMode((v) => !v), []);
  const handleGoHome = useCallback(() => navigate("/home"), [navigate]);

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-16 relative pointer-events-auto">
      {/* Botones Superiores */}
      <div className="absolute top-6 md:top-8 left-6 md:left-8 right-6 md:right-8 flex justify-between items-center z-20">
        <button
          onClick={handleGoHome}
          className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors font-bold tracking-widest uppercase bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm text-sm"
        >
          <ArrowLeft size={18} /> Volver
        </button>

        <button
          onClick={handleToggleDevMode}
          className={`flex items-center gap-2 font-bold tracking-widest uppercase backdrop-blur-md px-4 py-2 rounded-full shadow-sm transition-all text-sm ${isDevMode ? 'bg-zinc-900 text-green-400 border border-green-500' : 'bg-white/50 text-slate-500 hover:text-slate-800'}`}
        >
          <TerminalSquare size={18} /> <span className="hidden md:inline">{isDevMode ? "Modo Dev" : "Vista Normal"}</span>
        </button>
      </div>

      {/* Título estilo App Store / SO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={ENTER_TRANSITION}
        className="ml-0 md:ml-32 mt-16 md:mt-2 mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
          Sistema <span className="text-primary text-lg font-mono bg-primary/10 px-3 py-1 rounded-lg">/// PROYECTOS</span>
        </h1>
      </motion.div>

      {/* Grid estilo OS (Tableta) */}
      <div className="flex-1 w-full max-w-7xl overflow-y-auto pb-32 px-4 md:pl-64 md:pr-12 scrollbar-hide">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isDevMode={isDevMode}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {/* Modal de Detalles */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-4 md:p-8"
            onClick={handleClose}
          >
            <motion.div
              layoutId={`card-container-${selectedProject.id}`}
              transition={LAYOUT_TRANSITION}
              className={`w-full max-w-3xl max-h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative ${isDevMode ? 'bg-zinc-900' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors z-20"
              >
                <X size={24} />
              </button>

              <motion.div className={`h-40 md:h-48 w-full relative overflow-hidden flex items-end px-6 md:px-8 shrink-0 ${!selectedProject.image ? (isDevMode ? 'bg-zinc-950 border-b border-zinc-800' : selectedProject.bg) : ''}`}>
                {selectedProject.image && !isDevMode && (
                  <>
                    <img src={selectedProject.image} alt={selectedProject.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  </>
                )}
                {!selectedProject.image && !isDevMode && <div className="absolute inset-0 bg-dots opacity-30 mix-blend-overlay pointer-events-none" />}
                
                <div className={`z-10 pb-6 ${isDevMode ? 'text-green-400' : 'text-white'} drop-shadow-md w-full`}>
                  <div className="font-mono font-bold text-xs mb-2 opacity-80 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                    {selectedProject.category}
                  </div>
                  <motion.h2 layoutId={`card-title-${selectedProject.id}`} transition={LAYOUT_TRANSITION} className="text-2xl md:text-3xl font-black leading-tight max-w-[90%]">
                    {selectedProject.name}
                  </motion.h2>
                </div>
              </motion.div>

              <div className="p-6 md:p-8 overflow-y-auto flex-1 flex flex-col gap-6">
                {isDevMode ? (
                  <div className="bg-zinc-950 p-6 rounded-2xl font-mono text-sm overflow-x-auto text-zinc-300">
                    <pre><code>{selectedProject.codeSnippet}</code></pre>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Tecnologías</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedTechList.map((tech) => (
                            <span key={tech} className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-xs font-bold font-mono border border-primary/10">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedProject.link && (
                        <a 
                          href={selectedProject.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
                        >
                          Abrir Sitio
                        </a>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mb-2">Resumen del Sistema</h3>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mb-2">Especificaciones</h3>
                      <ul className="list-disc list-inside text-slate-700 leading-relaxed space-y-1.5 ml-1 text-sm">
                        {selectedProject.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}