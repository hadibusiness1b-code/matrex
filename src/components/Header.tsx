import { Settings, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenLogs: () => void;
}

export function Header({ onOpenSettings, onOpenLogs }: HeaderProps) {
  return (
    <header className="relative flex flex-col md:flex-row items-center justify-between p-6 overflow-hidden bg-black/40 backdrop-blur-2xl border-b border-white/5 z-40 gap-6 md:gap-0">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex flex-col md:flex-row items-center gap-4 z-10 w-full md:w-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative px-8 py-2 overflow-hidden group transition-all duration-500 cursor-pointer"
        >
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-red-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <h1 className="font-orbitron font-black text-5xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.2)] group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-500 uppercase">
            MATREX
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md"
        >
          <p className="text-zinc-300 font-bold tracking-widest text-xs uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">نظام إدارة الصالة</p>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 z-10 w-full md:w-auto justify-center">
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
