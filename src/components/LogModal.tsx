import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Trash2, Calendar, Target } from 'lucide-react';
import { SessionLog } from '../types';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SessionLog[];
  onClearLogs: () => void;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function LogModal({ isOpen, onClose, logs, onClearLogs }: LogModalProps) {
  const totalPlay = logs.reduce((acc, log) => acc + log.playCost, 0);
  const totalOrders = logs.reduce((acc, log) => acc + log.ordersCost, 0);
  const grandTotal = totalPlay + totalOrders;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="relative w-full max-w-5xl h-[85vh] flex flex-col bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="flex-none flex items-center justify-between p-6 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-2 border border-blue-500/30 bg-blue-500/10 rounded-xl">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">السجل اليومي</h2>
                  <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Daily Log</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Sticky Summaries */}
            <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-white/5 relative z-10">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />
                <p className="text-blue-400/80 text-xs font-bold uppercase mb-2 tracking-widest">إجمالي اللعب</p>
                <p className="font-black text-3xl text-white font-orbitron">{totalPlay} <span className="text-sm font-bold text-zinc-500 font-cairo">ل.س</span></p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden group hover:border-red-500/50 transition-colors">
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-red-500/10 to-transparent pointer-events-none" />
                <p className="text-red-400/80 text-xs font-bold uppercase mb-2 tracking-widest">إجمالي الطلبات</p>
                <p className="font-black text-3xl text-white font-orbitron">{totalOrders} <span className="text-sm font-bold text-zinc-500 font-cairo">ل.س</span></p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-red-500/20 to-transparent pointer-events-none" />
                <p className="text-red-400 text-xs font-bold uppercase mb-2 tracking-widest">الإجمالي الكلي</p>
                <p className="font-black text-4xl text-white font-orbitron drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">{grandTotal} <span className="text-base font-bold text-red-500 font-cairo">ل.س</span></p>
              </div>
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto p-6 relative z-10 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <div className="p-4 border border-white/5 rounded-full mb-4 bg-white/5">
                    <Calendar className="w-12 h-12 opacity-50" />
                  </div>
                  <p className="text-lg font-bold tracking-widest uppercase">لا توجد عمليات مسجلة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.slice().reverse().map((log) => (
                    <div key={log.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl hover:border-white/20 transition-all hover:bg-white/5 group">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                          <span className="font-orbitron font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">{log.stationName}</span>
                          <span className="text-xs px-3 py-1 font-bold tracking-widest uppercase border border-white/10 rounded-full text-zinc-300 bg-white/5">{log.playersCount} لاعب</span>
                        </div>
                        <div className="text-xs font-bold tracking-widest text-zinc-500 uppercase flex gap-4">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.startTime).toLocaleTimeString('ar-IQ')}</span>
                          <span className="flex items-center gap-1 text-zinc-400">إلى</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(log.endTime).toLocaleTimeString('ar-IQ')}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">مدة اللعب</p>
                          <p className="font-orbitron font-bold text-white text-lg tracking-wider">{formatDuration(log.durationMs)}</p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">الطلبات ({log.orders.length})</p>
                          <div className="text-zinc-300 truncate font-semibold">
                            {log.orders.length > 0 ? log.orders.map(o => o.name).join(', ') : '-'}
                          </div>
                        </div>
                        <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 sm:text-left">
                          <p className="text-blue-500/80 text-xs font-bold uppercase tracking-widest mb-1">التكلفة الكلية</p>
                          <p className="font-black text-blue-400 text-xl font-orbitron">{log.totalCost} <span className="text-xs text-blue-500 font-cairo">ل.س</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-none p-6 border-t border-white/5 relative z-10 flex justify-end">
              <button 
                onClick={onClearLogs}
                disabled={logs.length === 0}
                className="flex items-center justify-center gap-3 px-8 py-3 bg-red-500/10 text-red-500 font-bold uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white border border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Trash2 className="w-5 h-5 group-hover:animate-bounce" />
                مسح السجل
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
