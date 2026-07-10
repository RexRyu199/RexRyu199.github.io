import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { Terminal } from "lucide-react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/home"), 1000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 2;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [navigate]);

  const getTerminalLines = (p) => {
    const lines = [];
    if (p >= 0) lines.push("> init_system --profile 'René Montaño'");
    if (p >= 10) lines.push("[OK] Sistema operativo Shittim Chest inicializado.");
    if (p >= 15) lines.push("[OK] Arona saludando...");
    if (p >= 30) lines.push("> nmap -sV system_core --iot-scan");
    if (p >= 45) lines.push("[OK] Conexión establecida.");
    if (p >= 60) lines.push("> check_vulnerabilities --ssdlc");
    if (p >= 75) lines.push("[OK] Bases de datos relacionales y NoSQL sincronizadas.");
    if (p >= 90) lines.push("> mount_ui --framer-motion");
    if (p >= 100) lines.push("[OK] Sistema listo. Acceso autorizado.");
    return lines;
  };

  const visibleLines = getTerminalLines(progress);

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-between p-8 md:p-16 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl flex-1 z-10 flex flex-col justify-end pb-8 pt-4">
        <div className="glass rounded-3xl p-6 md:p-10 shadow-2xl border-primary/20 bg-black/80 w-full h-full min-h-[50vh] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bg-zinc-900 px-6 py-3 flex items-center gap-2 border-b border-zinc-800">
            <Terminal size={18} className="text-zinc-400" />
            <span className="text-sm text-zinc-400 font-mono tracking-widest uppercase">boot_sequence.sh</span>
          </div>

          <div className="mt-12 flex flex-col gap-3 font-mono text-sm md:text-lg overflow-y-auto">
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={line?.startsWith(">") ? "text-primary font-bold mt-2" : "text-green-400 ml-4 md:ml-6"}
              >
                {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-3 h-5 md:w-4 md:h-6 bg-primary inline-block ml-4 md:ml-6 mt-2"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl z-10 flex flex-col gap-4 pointer-events-none mt-4">
        <div className="flex justify-between items-end text-primary font-mono font-bold">
          <div className="text-2xl md:text-3xl tracking-widest flex items-center gap-2">
            <span>CARGANDO SISTEMA</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ...
            </motion.span>
          </div>
          <div className="text-xl md:text-3xl">{Math.min(progress, 100)}%</div>
        </div>

        <div className="w-full h-4 md:h-5 bg-primary/20 rounded-full overflow-hidden border border-primary/30 p-[2px]">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-[#5cd6ff] rounded-full relative"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ type: "tween", ease: "circOut", duration: 0.2 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30 rounded-t-full" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}