import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Plus, Receipt, User, Users, Play, Square, Coffee, Clock } from 'lucide-react';
import { Station, Order, Rates, InventoryItem, DebtAccount } from '../types';

interface StationCardProps {
  key?: string | number;
  station: Station;
  rates: Rates;
  inventory: InventoryItem[];
  debts: DebtAccount[];
  onStartSession: (id: number, playersCount: number) => void;
  onEndSession: (id: number) => void;
  onAddOrder: (id: number, order: Omit<Order, 'id'>) => void;
  onClearSession: (id: number) => void;
  onClearSessionToDebt: (id: number, accountId: string, amount: number) => void;
}

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function StationCard({ station, rates, inventory, debts, onStartSession, onEndSession, onAddOrder, onClearSession, onClearSessionToDebt }: StationCardProps) {
  const [playersSelection, setPlayersSelection] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderPrice, setNewOrderPrice] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');

  // Update timer strictly every second when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (station.status === 'playing') {
      interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    }
    return () => clearInterval(interval);
  }, [station.status]);

  const handleStart = () => {
    onStartSession(station.id, playersSelection);
  };

  const handleAddOrder = () => {
    if (selectedItemId) {
      const item = inventory.find(i => i.id === selectedItemId);
      if (item && item.stock > 0) {
        onAddOrder(station.id, {
          name: item.name,
          price: item.price,
          itemId: item.id,
          quantity: 1
        });
        setSelectedItemId('');
      } else {
        alert('الكمية غير متوفرة في المخزون');
      }
    } else if (newOrderName.trim() && newOrderPrice.trim() && !isNaN(Number(newOrderPrice))) {
      onAddOrder(station.id, {
        name: newOrderName.trim(),
        price: Number(newOrderPrice)
      });
      setNewOrderName('');
      setNewOrderPrice('');
    }
  };

  const calculatePlayCost = () => {
    if (!station.startTime) return 0;
    const end = station.endTime || currentTime;
    const durationHours = (end - station.startTime) / (1000 * 60 * 60);
    const categoryRates = station.type ? rates[station.type] : rates.ps4;
    const rate = categoryRates[station.playersCount as keyof typeof categoryRates] || 0;
    return Math.floor(durationHours * rate);
  };

  const exactPlayCost = Math.round(calculatePlayCost());
  const calculateTotalOrders = () => station.orders.reduce((acc, order) => acc + order.price, 0);

  return (
    <motion.div 
      layout
      className={`relative flex flex-col w-full bg-black/60 backdrop-blur-xl rounded-2xl transition-all duration-300 overflow-hidden border ${
        (station.type === 'ps5' || station.type === 'fortnite') ? 'h-[560px] md:h-[600px] border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 'h-[520px]'
      } ${
        station.status === 'available' ? ((station.type === 'ps5' || station.type === 'fortnite') ? 'border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:border-blue-400' : 'border-white/10 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]') :
        station.status === 'playing' ? 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' :
        'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]'
      }`}
    >
      {/* Background gradients for active states and VIP */}
      {(station.type === 'ps5' || station.type === 'fortnite') && station.status === 'available' && (
         <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-red-500/5 pointer-events-none" />
      )}
      {(station.type === 'ps5' || station.type === 'fortnite') && (
        <>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-red-600/10 rounded-full blur-[80px]" />
        </>
      )}
      {station.status === 'playing' && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      )}
      {station.status === 'billing' && (
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div className={`px-6 py-5 flex items-center justify-between border-b ${
        station.status === 'available' ? 'border-white/5' :
        station.status === 'playing' ? 'border-blue-500/20' :
        'border-red-500/20'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${
            (station.type === 'ps5' || station.type === 'fortnite') && station.status === 'available' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] animate-pulse' :
            station.status === 'available' ? 'bg-white/5 text-zinc-400' :
            station.status === 'playing' ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse' :
            'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          }`}>
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h2 className={`font-orbitron font-black uppercase tracking-widest ${(station.type === 'ps5' || station.type === 'fortnite') ? 'text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400'}`}>
              {station.name}
            </h2>
            {station.type === 'ps5' && <span className="text-xs font-bold text-red-400 uppercase tracking-widest -mt-1">VIP Edition</span>}
            {station.type === 'fortnite' && <span className="text-xs font-bold text-purple-400 uppercase tracking-widest -mt-1">Fortnite Edition</span>}
          </div>
        </div>
        <div className={`px-4 py-1.5 text-xs font-bold tracking-widest rounded-full uppercase border ${
          station.status === 'available' ? 'text-zinc-400 border-white/10 bg-white/5' :
          station.status === 'playing' ? 'text-blue-400 border-blue-500/50 bg-blue-500/10' :
          'text-red-400 border-red-500/50 bg-red-500/10'
        }`}>
          {station.status === 'available' && 'متاح'}
          {station.status === 'playing' && 'قيد اللعب'}
          {station.status === 'billing' && 'الحساب'}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 flex flex-col overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {station.status === 'available' && (
            <motion.div 
              key="available"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              <div className="text-center w-full">
                <p className="text-zinc-500 mb-4 text-sm tracking-widest uppercase">حدد عدد اللاعبين</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white/5 p-2 rounded-2xl border border-white/5 w-full">
                  {[1, 2, 3, 4].filter(num => station.type !== 'fortnite' || num <= 2).map(num => (
                    <button
                      key={num}
                      onClick={() => setPlayersSelection(num)}
                      className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        playersSelection === num 
                          ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                          : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      }`}
                    >
                      {num > 2 ? <Users className="w-6 h-6 mb-2" /> : <User className="w-6 h-6 mb-2" />}
                      <span className="text-sm font-bold">{num}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleStart}
                className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold tracking-widest uppercase overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-opacity duration-300 group-hover:opacity-80" />
                <div className="absolute inset-0 border border-white/20 rounded-xl" />
                <Play className="w-5 h-5 fill-current relative z-10 text-white" />
                <span className="relative z-10 text-white">بدء الجلسة</span>
              </button>
            </motion.div>
          )}

          {station.status === 'playing' && (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-full gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-500/20 backdrop-blur-md">
                  <p className="text-blue-400/60 text-xs mb-1 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    الوقت
                  </p>
                  <p className="font-orbitron font-black text-2xl tracking-wider text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    {formatDuration(currentTime - (station.startTime || currentTime))}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                  <p className="text-zinc-500 text-xs mb-1 font-bold uppercase tracking-widest">التكلفة (ل.س)</p>
                  <p className="font-bold text-2xl text-white tracking-widest">{exactPlayCost}</p>
                </div>
              </div>

              <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10 overflow-y-auto custom-scrollbar flex flex-col">
                <h4 className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest mb-3 font-bold border-b border-white/10 pb-2">
                  <Coffee className="w-4 h-4" /> 
                  قائمة الطلبات
                </h4>
                {station.orders.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">لا توجد طلبات</div>
                ) : (
                  <ul className="space-y-2">
                    {station.orders.map((o, i) => (
                      <li key={i} className="flex justify-between text-sm bg-black/40 p-3 rounded-lg border border-white/5 items-center">
                        <span className="text-zinc-200">{o.name}</span>
                        <span className="font-bold text-blue-400">{o.price} ل.س</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {inventory && inventory.length > 0 && (
                  <div className="flex gap-2 bg-black/40 p-2 rounded-xl border border-white/10 backdrop-blur-md">
                    <select 
                      value={selectedItemId}
                      onChange={e => setSelectedItemId(e.target.value)}
                      className="flex-1 bg-transparent text-white px-3 py-2 text-sm focus:outline-none appearance-none"
                    >
                      <option value="" className="text-black">-- اختيار من المخزون --</option>
                      {inventory.map(item => (
                        <option key={item.id} value={item.id} disabled={item.stock === 0} className="text-black">
                          {item.name} - {item.price} ل.س (المتبقي: {item.stock})
                        </option>
                      ))}
                    </select>
                    <button 
                      onClick={handleAddOrder}
                      disabled={!selectedItemId}
                      className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 px-4 rounded-lg transition-colors border border-emerald-500/30 flex items-center justify-center disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2 bg-black/40 p-2 rounded-xl border border-white/10 backdrop-blur-md">
                  <input 
                    type="text" 
                    placeholder="طلب مخصص" 
                    value={newOrderName}
                    onChange={(e) => setNewOrderName(e.target.value)}
                    className="flex-1 bg-transparent text-white px-3 py-2 text-sm focus:outline-none placeholder:text-zinc-600"
                  />
                  <div className="w-px bg-white/10 my-1" />
                  <input 
                    type="number" 
                    placeholder="السعر" 
                    value={newOrderPrice}
                    onChange={(e) => setNewOrderPrice(e.target.value)}
                    className="w-24 bg-transparent text-white px-3 py-2 text-sm focus:outline-none placeholder:text-zinc-600 font-orbitron"
                  />
                  <button 
                    onClick={handleAddOrder}
                    disabled={!newOrderName.trim() || !newOrderPrice.trim()}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-4 rounded-lg transition-colors border border-blue-500/30 flex items-center justify-center disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => onEndSession(station.id)}
                className="group relative w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold tracking-widest uppercase overflow-hidden mt-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 transition-opacity duration-300 group-hover:opacity-80" />
                <div className="absolute inset-0 border border-white/20 rounded-xl" />
                <Square className="w-5 h-5 fill-current relative z-10 text-white" />
                <span className="relative z-10 text-white">إنهاء الجلسة</span>
              </button>
            </motion.div>
          )}

          {station.status === 'billing' && (
            <motion.div 
              key="billing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full gap-4"
            >
              <div className="bg-black/40 p-6 rounded-2xl border border-red-500/30 flex-1 flex flex-col relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="text-center pb-6 border-b border-white/10 mb-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-red-400" />
                  </div>
                  <h3 className="font-bold text-xl text-white mb-1 uppercase tracking-widest">فاتورة الحساب</h3>
                  <p className="text-red-400/80 text-sm font-orbitron tracking-widest">{formatDuration((station.endTime || 0) - (station.startTime || 0))}</p>
                </div>
                
                <div className="flex-1 relative z-10 overflow-y-auto custom-scrollbar pr-2 pb-2 space-y-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-lg"
                  >
                     <span className="text-zinc-400">تكلفة اللعب ({station.playersCount} لاعب)</span>
                     <span className="font-bold text-white font-orbitron">{exactPlayCost} <span className="text-xs text-zinc-500 font-cairo">ل.س</span></span>
                  </motion.div>
                  
                  {station.orders.length > 0 && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-white/5 border-dashed">
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-2"
                      >
                        الطلبات الإضافية
                      </motion.p>
                      
                      {station.orders.map((order, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + (idx * 0.1) }}
                          className="flex justify-between items-center text-sm bg-black/40 border border-white/5 p-3 rounded-lg"
                        >
                          <span className="text-zinc-300">{order.name}</span>
                          <span className="font-bold text-white font-orbitron">{order.price} <span className="text-xs text-zinc-500 font-cairo">ل.س</span></span>
                        </motion.div>
                      ))}
                      
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + (station.orders.length * 0.1) }}
                        className="flex justify-between items-center text-sm bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg mt-3"
                      >
                        <span className="text-blue-400 font-bold border-none">إجمالي الطلبات ({station.orders.length})</span>
                        <span className="font-bold text-blue-400 font-orbitron">{calculateTotalOrders()} <span className="text-xs font-cairo">ل.س</span></span>
                      </motion.div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-red-500/30 flex justify-between items-center relative z-10">
                   <span className="font-bold text-red-500 text-lg uppercase tracking-widest">المجموع الكلي</span>
                   <span className="font-black text-3xl text-white font-orbitron drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                     {exactPlayCost + calculateTotalOrders()} 
                     <span className="text-sm font-bold text-red-500 ml-2 font-cairo">ل.س</span>
                   </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => onClearSession(station.id)}
                  className="group relative w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold tracking-widest uppercase overflow-hidden border border-blue-500/30 hover:border-blue-500/60 transition-all bg-blue-500/10 hover:bg-blue-500/20"
                >
                  <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">تصفير الجهاز (دفع نقدي)</span>
                  <Receipt className="w-5 h-5 text-blue-400" />
                </button>

                {debts && debts.length > 0 && (
                  <div className="flex gap-2">
                    <select
                      className="flex-1 bg-black/40 border border-purple-500/30 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500/50"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                           onClearSessionToDebt(station.id, val, exactPlayCost + calculateTotalOrders());
                           e.target.value = "";
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled className="text-black">تسجيل بالدين لفرد...</option>
                      {debts.map(acc => (
                        <option key={acc.id} value={acc.id} className="text-black">{acc.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
