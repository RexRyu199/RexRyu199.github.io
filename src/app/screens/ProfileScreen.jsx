import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Code2, ArrowUpRight } from "lucide-react";

const CONTACT_LINKS = [
  {
    label: "Correo",
    value: "renecraftermine@gmail.com",
    href: "mailto:renecraftermine@gmail.com",
    icon: Mail,
  },
  {
    label: "Repositorio",
    value: "github.com/RexRyu199",
    href: "https://github.com/RexRyu199",
    icon: Code2,
  },
];

const TAGS = [
  "Full Stack",
  "Hardware / IoT",
  "Ciberseguridad",
  "UX/UI",
  "Arquitectura de Software",
];

export function ProfileScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-16 relative pointer-events-auto overflow-y-auto">

      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-primary hover:text-blue-700 transition-colors font-bold tracking-widest uppercase bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm"
        >
          <ArrowLeft size={20} /> Volver
        </button>
      </div>

      <div className="flex flex-col gap-8 ml-0 md:ml-60 mt-20 md:mt-2 max-w-3xl">

        <motion.div
          className="glass p-6 rounded-2xl border-primary/20 flex flex-col gap-1 w-fit"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground">René Montaño</h1>
          <div className="text-primary font-mono bg-primary/10 px-3 py-1 rounded-md inline-block w-fit text-sm mt-2 font-bold tracking-wide">
            Full Stack & IoT Engineer
          </div>
          <p className="mt-4 text-muted-foreground max-w-md">
            Soy René Montaño Gaspar. Desarrollo Full Stack con integración de hardware, ciberseguridad aplicada e interfaces
            modernas — no me quedo solo en la programación web. Me gusta conectar aplicaciones móviles, APIs y bases
            de datos con sensores, microcontroladores y dispositivos físicos reales, entregando soluciones completas
            de extremo a extremo. Si tienes un proyecto, una vacante o simple curiosidad técnica, este es el canal
            directo para hablar conmigo.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono font-bold tracking-wide px-3 py-1 rounded-full border border-primary/30 text-primary bg-primary/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, staggerChildren: 0.08 }}
        >
          <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground font-mono">
            Contacto
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            {CONTACT_LINKS.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass p-4 rounded-2xl border-primary/20 flex items-center gap-3 hover:border-primary hover:-translate-y-1 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon size={20} strokeWidth={1.5} className="text-primary" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      {link.label}
                    </span>
                    <span className="text-sm font-bold text-foreground truncate">
                      {link.value}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="ml-auto text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                  />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}