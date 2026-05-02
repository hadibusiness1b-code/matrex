import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="w-full py-8 mt-12 bg-black flex flex-col items-center justify-center relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none" />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-2 z-10"
      >
        <span className="text-zinc-600 font-bold tracking-widest text-xs uppercase flex items-center gap-2">
          تم التطوير بواسطة
          <div className="relative group mx-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-orbitron font-black text-sm tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] transition-all">
              HADI HASAN
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
          / هادي حسن
        </span>
      </motion.div>
    </footer>
  );
}
