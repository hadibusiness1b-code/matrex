import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Settings as SettingsIcon, Gamepad2, Star } from 'lucide-react';
import { Rates, RateCategory } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: Rates;
  onSave: (newRates: Rates) => void;
}

export function SettingsModal({ isOpen, onClose, rates, onSave }: SettingsModalProps) {
  const [tempRates, setTempRates] = useState<Rates>(rates);
  const [activeTab, setActiveTab] = useState<'regular' | 'vip'>('regular');

  useEffect(() => {
    setTempRates(rates);
  }, [rates]);

  const handleSave = () => {
    onSave(tempRates);
    onClose();
  };

  const handleRateChange = (category: 'regular' | 'vip', num: string, value: string) => {
    setTempRates({
      ...tempRates,
      [category]: {
        ...tempRates[category],
        [num]: Number(value)
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-black/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden"
          >
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-2 border border-red-500/30 bg-red-500/10 rounded-xl">
                  <SettingsIcon className="w-6 h-6 text-red-500" />
                </div>
                <h2 className="text-xl font-black tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">إعدادات التسعيرة</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-4 pb-0 relative z-10 gap-2">
               <button 
                  onClick={() => setActiveTab('regular')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'regular' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                    : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
                  }`}
               >
                 <Gamepad2 className="w-4 h-4" /> العادي
               </button>
               <button 
                  onClick={() => setActiveTab('vip')}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'vip' 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                    : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
                  }`}
               >
                 <Star className="w-4 h-4" /> الـ VIP
               </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 relative z-10">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-white font-bold tracking-widest text-sm uppercase">سعر الساعة</span>
                    <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">({num} لاعب)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      value={tempRates[activeTab][num as keyof RateCategory]}
                      onChange={(e) => handleRateChange(activeTab, String(num), e.target.value)}
                      className="w-24 bg-black/50 border border-white/10 rounded-lg text-white px-3 py-2 font-orbitron font-bold text-center focus:outline-none focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
                    />
                    <span className="text-xs text-red-500 font-bold font-cairo">ل.س</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 relative z-10">
              <button 
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-blue-600 text-white font-bold uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95"
              >
                <Save className="w-5 h-5" />
                حفظ التغييرات
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
