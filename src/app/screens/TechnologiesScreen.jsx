import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const STATS = [
  { name: "Desarrollo Móvil (React Native, Expo)", percentage: 90, color: "bg-cyan-400" },
  { name: "Desarrollo Web (React, Tailwind, JSX)", percentage: 95, color: "bg-blue-400" },
  { name: "Backend APIs (Node.js, Express, Flask)", percentage: 85, color: "bg-green-500" },
  { name: "Bases de Datos (MySQL, MongoDB)", percentage: 85, color: "bg-orange-500" },
  { name: "Integración IoT (Raspberry Pi, UART, GPIO)", percentage: 95, color: "bg-purple-500" },
  { name: "Desarrollo Seguro (Pentesting, SSDLC)", percentage: 80, color: "bg-red-500" },
  { name: "Despliegue (VPS, Nginx, Git Avanzado)", percentage: 85, color: "bg-yellow-500" }
];

export function TechnologiesScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-16 relative overflow-y-auto pointer-events-auto">
      <button
        onClick={() => navigate("/home")}
        className="absolute top-8 left-8 flex items-center gap-2 text-primary hover:text-blue-700 transition-colors z-20 font-bold tracking-widest uppercase bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        // ml-24 -> ml-0 md:ml-24: antes se aplicaba SIEMPRE, incluso en
        // teléfono, empujando el título 96px hacia la derecha sin margen
        // de sobra y provocando overflow horizontal. Ahora solo aplica en
        // escritorio, igual que en tus otras pantallas (ml-0 md:ml-32).
        className="ml-0 md:ml-24 mt-20 md:mt-2 mb-8 flex justify-between items-end"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-4 flex-wrap">
          Habilidades <span className="text-primary text-xl font-mono bg-primary/10 px-3 py-1 rounded-md">/// TECNOLOGÍAS</span>
        </h1>
      </motion.div>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
        {STATS.sort((a, b) => b.percentage - a.percentage).map((stat, index) => (
          <motion.div
            key={stat.name}
            className="glass rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-5 rounded-bl-full`} />

            <div className="flex justify-between items-center z-10">
              <h3 className="font-bold text-lg text-foreground tracking-wide">{stat.name}</h3>
              <div className="font-mono text-primary font-bold text-xl">
                {stat.percentage}%
              </div>
            </div>

            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden border border-slate-300 relative z-10 p-[2px]">
              <motion.div
                className={`h-full ${stat.color} rounded-full relative`}
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1, type: "spring" }}
              >
                 <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full" />
              </motion.div>
            </div>

            <div className="flex gap-1 z-10">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className={`h-2 flex-1 rounded-sm ${i < Math.floor(stat.percentage / 10) ? stat.color : "bg-slate-200"}`} />
               ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}