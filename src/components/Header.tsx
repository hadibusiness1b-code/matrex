import { Settings, Clock, PackageSearch, Sword, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenLogs: () => void;
  onOpenInventory: () => void;
  onOpenDebts: () => void;
}

export function Header({ onOpenSettings, onOpenLogs, onOpenInventory, onOpenDebts }: HeaderProps) {
  return (
    <header className="relative flex flex-col md:flex-row items-center justify-between p-6 overflow-hidden bg-black/40 backdrop-blur-2xl border-b border-white/5 z-40 gap-6 md:gap-0">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex flex-col md:flex-row items-center gap-4 z-10 w-full md:w-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative px-8 py-2 overflow-visible group transition-all duration-500 cursor-pointer"
        >
          <div className="flex items-center justify-center transform -skew-x-[15deg] group-hover:scale-110 transition-transform duration-500" dir="ltr">
            <h1 className="font-orbitron font-black text-5xl md:text-6xl tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] uppercase">
              MA
            </h1>
            
            <div className="relative mx-1 w-10 md:w-14 h-12 md:h-16 flex items-center justify-center">
               <Sword className="absolute w-12 md:w-16 h-12 md:h-16 text-white drop-shadow-[0_0_20px_rgba(255,255,255,1)] transform -rotate-45 group-hover:rotate-[315deg] group-hover:text-cyan-400 transition-all duration-700 z-10" strokeWidth={2.5} />
               <div className="absolute inset-0 bg-white/20 blur-xl rounded-full" />
               {/* Slash effect on hover */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[2px] bg-cyan-400 opacity-0 group-hover:opacity-100 rotate-[-45deg] scale-0 group-hover:scale-100 transition-all duration-300 delay-100 shadow-[0_0_15px_rgba(34,211,238,1)] z-20 pointer-events-none" />
            </div>

            <h1 className="font-orbitron font-black text-5xl md:text-6xl tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] uppercase">
              REX
            </h1>
          </div>
          
          <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-red-500 via-white to-blue-500 group-hover:w-full transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 bg-gradient-to-r from-black/60 to-black/30 px-6 py-2 border-y border-white/5 rounded-xl relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-white/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" />
          <p className="text-zinc-100 font-bold tracking-[0.2em] text-sm uppercase drop-shadow-lg">
            نظام إدارة الصالة
          </p>
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse delay-75" />
        </motion.div>
      </div>

      <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenDebts}
          className="relative flex items-center gap-2 px-6 py-2.5 font-bold tracking-widest text-sm uppercase text-purple-400 bg-purple-500/10 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 overflow-hidden group rounded-md"
        >
          <div className="absolute inset-0 bg-purple-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <Users className="w-4 h-4 relative z-10" />
          <span className="relative z-10 text-white">الديون</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenInventory}
          className="relative flex items-center gap-2 px-6 py-2.5 font-bold tracking-widest text-sm uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 overflow-hidden group rounded-md"
        >
          <div className="absolute inset-0 bg-emerald-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <PackageSearch className="w-4 h-4 relative z-10" />
          <span className="relative z-10 text-white">المخزون</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenLogs}
          className="relative flex items-center gap-2 px-6 py-2.5 font-bold tracking-widest text-sm uppercase text-blue-400 bg-blue-500/10 border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 overflow-hidden group rounded-md"
        >
          <div className="absolute inset-0 bg-blue-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <Clock className="w-4 h-4 relative z-10" />
          <span className="relative z-10 text-white">السجل</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="relative flex items-center gap-2 px-6 py-2.5 font-bold tracking-widest text-sm uppercase text-red-400 bg-red-500/10 border border-red-500/30 hover:border-red-400 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 overflow-hidden group rounded-md"
        >
          <div className="absolute inset-0 bg-red-400/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <Settings className="w-4 h-4 relative z-10" />
          <span className="relative z-10 text-white">الإعدادات</span>
        </motion.button>
      </div>
    </header>
  );
}
