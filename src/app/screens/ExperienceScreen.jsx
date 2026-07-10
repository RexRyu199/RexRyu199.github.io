import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, GraduationCap, Database, Code2, Server, Cpu, ShieldCheck, Fingerprint } from "lucide-react";

const LOG_ENTRIES = [
  {
    tag: "FORMACIÓN",
    icon: GraduationCap,
    gradient: "from-sky-400 to-blue-600",
    title: "Fundamentos de programación",
    desc: "Base sólida en lógica, estructuras de datos y resolución de problemas — el punto de partida de todo lo demás.",
  },
  {
    tag: "BACKEND",
    icon: Database,
    gradient: "from-emerald-400 to-teal-600",
    title: "Persistencia y arquitectura de datos",
    desc: "Primeros CRUD funcionales, seguidos de relaciones complejas, stored procedures y aggregations en NoSQL.",
  },
  {
    tag: "FRONTEND",
    icon: Code2,
    gradient: "from-fuchsia-400 to-pink-600",
    title: "Interfaces modernas con React",
    desc: "El salto de páginas estáticas a interfaces dinámicas, con estado, componentes reutilizables y UX real.",
  },
  {
    tag: "BACKEND",
    icon: Server,
    gradient: "from-amber-400 to-orange-600",
    title: "APIs propias con Node.js",
    desc: "Construcción de servicios REST, autenticación segura con JWT y arquitectura orientada a eventos.",
  },
  {
    tag: "HARDWARE",
    icon: Cpu,
    gradient: "from-violet-400 to-purple-600",
    title: "Hardware en producción",
    desc: "Raspberry Pi, GPIO, UART y comunicación serial — la frontera entre software y el mundo físico.",
  },
  {
    tag: "SEGURIDAD",
    icon: ShieldCheck,
    gradient: "from-red-400 to-rose-600",
    title: "Seguridad aplicada",
    desc: "SSDLC, estándares OWASP y auditoría con herramientas profesionales como Burp Suite y Nmap.",
  },
  {
    tag: "PROYECTO INSIGNIA",
    icon: Fingerprint,
    gradient: "from-cyan-400 to-blue-700",
    title: "Sistema Biométrico de Control de Acceso",
    desc: "Donde todo converge: app móvil, API, Raspberry Pi, sensor de huellas y base de datos, integrados de punta a punta.",
  },
];

export function ExperienceScreen() {
  const navigate = useNavigate();

  return (
    <div className="items-end w-full h-full flex flex-col p-8 md:p-16 relative pointer-events-auto overflow-y-auto">

      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors font-bold tracking-widest uppercase bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} /> Volver
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ml-0 md:ml-32 mt-20 md:mt-2 mb-8"
      >
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-4 flex-wrap">
          Bitácora <span className="text-primary text-xl font-mono bg-primary/10 px-3 py-1 rounded-md md:mr-250">/// EXPERIENCIA</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          No es una línea de tiempo estricta — son los hitos técnicos que más definen cómo trabajo hoy.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl md:mr-25">
        {LOG_ENTRIES.map((entry, index) => {
          const Icon = entry.icon;
          return (
            <motion.div
              key={entry.title}
              className="glass rounded-2xl p-6 border-primary/20 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.07, type: "spring", stiffness: 140, damping: 18 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${entry.gradient} flex items-center justify-center shadow-md`}>
                  <Icon size={22} className="text-white" strokeWidth={1.75} />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase">
                  {entry.tag}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-1.5">{entry.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}