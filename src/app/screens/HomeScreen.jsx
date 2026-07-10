import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { User, FolderKanban, Clock, Cpu, Wifi, BatteryFull } from "lucide-react";

const APPS = [
  { id: "profile", label: "Perfil", icon: User, path: "/profile", gradient: "from-sky-400 to-blue-600", glow: "shadow-blue-500/40" },
  { id: "projects", label: "Proyectos", icon: FolderKanban, path: "/projects", gradient: "from-amber-400 to-orange-600", glow: "shadow-orange-500/40", badge: "8" },
  { id: "technologies", label: "Tecnologías", icon: Cpu, path: "/technologies", gradient: "from-emerald-400 to-teal-600", glow: "shadow-emerald-500/40" },
  { id: "experience", label: "Experiencia", icon: Clock, path: "/experience", gradient: "from-fuchsia-400 to-pink-600", glow: "shadow-pink-500/40" },
];

const STATS = [
  { label: "Experiencia", value: "3+ Años", color: "text-blue-500" },
  { label: "Proyectos", value: "8+", color: "text-yellow-500" },
];

const SYSTEM_MODULES = [
  { label: "Frontend" },
  { label: "Backend" },
  { label: "Hardware / IoT" },
  { label: "Seguridad" },
];

function useLiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 15000);
    return () => clearInterval(id);
  }, []);

  return time;
}

export function HomeScreen() {
  const navigate = useNavigate();
  const time = useLiveClock();

  return (
    // Antes no tenía overflow-y-auto: si el contenido (barra + widgets + dock)
    // no cabía en pantallas cortas, simplemente se recortaba sin forma de
    // hacer scroll para verlo. También agregué padding-bottom con
    // env(safe-area-inset-bottom) para que el dock no quede pegado al borde
    // físico en teléfonos con "home indicator" (iPhone sin botón).
    <div className="w-full h-full flex flex-col justify-between pt-6 pb-[calc(2rem+env(safe-area-inset-bottom))] px-6 md:px-12 relative pointer-events-auto overflow-y-auto">

      <motion.div
        className="w-full flex justify-between items-center flex-shrink-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 glass px-4 py-1.5 rounded-full border-primary/20">
          <span className="font-mono font-black text-sm tracking-widest text-primary">Shittim Chest</span>
        </div>

        <div className="flex items-center gap-3 glass px-4 py-1.5 rounded-full border-primary/20">
          <span className="font-mono font-bold text-sm text-foreground tabular-nums">{time}</span>
          <Wifi size={16} className="text-foreground/70" />
          <BatteryFull size={16} className="text-foreground/70" />
        </div>
      </motion.div>

      <motion.div
        className="w-full flex flex-col sm:flex-row justify-between items-start gap-4 mt-4 flex-shrink-0"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="glass p-6 rounded-2xl border-primary/20 max-w-sm flex flex-col gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Estado del Sistema
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operativo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {SYSTEM_MODULES.map((mod) => (
              <div key={mod.label} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-foreground/80">{mod.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="glass px-4 py-3 rounded-xl flex flex-col items-center justify-center border-primary/20 min-w-[100px]"
            >
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</span>
              <span className={`font-mono font-black text-lg ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* min-h en vez de flex-1 puro: dentro de un contenedor con scroll,
          flex-1 podía colapsar a 0 si el contenido no alcanza a llenar la
          pantalla; con un mínimo, sigue dando aire pero cede ante el scroll
          cuando el contenido de arriba/abajo necesita más espacio. */}
      <div className="flex-1 min-h-6" />

      <motion.div
        className="w-full flex justify-center flex-shrink-0"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex gap-5 md:gap-7 glass px-5 py-4 rounded-[32px] border-primary/20">
          {APPS.map((app, index) => {
            const Icon = app.icon;
            return (
              <motion.button
                key={app.id}
                onClick={() => navigate(app.path)}
                className="flex flex-col items-center gap-1.5 group"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.06 }}
              >
                <motion.div
                  className={`relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-[20px] bg-gradient-to-br ${app.gradient} shadow-lg ${app.glow} flex items-center justify-center`}
                  whileHover={{ y: -6, scale: 1.05 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon size={30} strokeWidth={1.75} className="text-white drop-shadow-sm" />

                  {app.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white/80 shadow-sm">
                      {app.badge}
                    </span>
                  )}

                  <div className="absolute inset-0 rounded-[20px] bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
                </motion.div>

                <span className="text-[11px] md:text-xs font-bold text-foreground/80 group-hover:text-foreground transition-colors">
                  {app.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}