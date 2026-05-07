import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, PackageOpen, Tag, DollarSign, History, ArrowDown, ArrowUp } from 'lucide-react';
import { InventoryItem, InventoryTransaction } from '../types';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  transactions: InventoryTransaction[];
  onSaveInventory: (inv: InventoryItem[]) => void;
  onSaveTransactions: (txs: InventoryTransaction[]) => void;
}

export function InventoryModal({ isOpen, onClose, inventory, transactions, onSaveInventory, onSaveTransactions }: InventoryModalProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'logs'>('items');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('مشروبات باردة');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemStock, setNewItemStock] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice || !newItemStock) return;
    
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substring(7),
      name: newItemName,
      category: newItemCategory,
      price: Number(newItemPrice),
      stock: Number(newItemStock)
    };
    
    onSaveInventory([...inventory, newItem]);
    
    const newTx: InventoryTransaction = {
      id: Math.random().toString(36).substring(7),
      itemId: newItem.id,
      itemName: newItem.name,
      type: 'in',
      quantity: Number(newItemStock),
      totalPrice: 0,
      timestamp: Date.now()
    };
    onSaveTransactions([...transactions, newTx]);

    setNewItemName('');
    setNewItemPrice('');
    setNewItemStock('');
  };

  const handleUpdateStock = (itemId: string, qty: number, type: 'in' | 'out') => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const newStock = type === 'in' ? item.stock + qty : item.stock - qty;
    
    const updatedInv = inventory.map(i => 
      i.id === itemId ? { ...i, stock: newStock } : i
    );
    onSaveInventory(updatedInv);

    const newTx: InventoryTransaction = {
      id: Math.random().toString(36).substring(7),
      itemId: item.id,
      itemName: item.name,
      type,
      quantity: qty,
      totalPrice: type === 'out' ? qty * item.price : 0,
      timestamp: Date.now()
    };
    onSaveTransactions([...transactions, newTx]);
  };

  if (!isOpen) return null;

  const categories = ['مشروبات باردة', 'مشروبات ساخنة', 'بسكويت', 'أخرى'];

  const selectedDateObj = new Date(selectedDate);
  
  const incomeSelectedDay = transactions
    .filter(t => t.type === 'out' && new Date(t.timestamp).toDateString() === selectedDateObj.toDateString())
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const incomeSelectedMonth = transactions
    .filter(t => t.type === 'out' && new Date(t.timestamp).getMonth() === selectedDateObj.getMonth() && new Date(t.timestamp).getFullYear() === selectedDateObj.getFullYear())
    .reduce((sum, t) => sum + t.totalPrice, 0);

  const filteredTransactions = transactions.filter(t => new Date(t.timestamp).toDateString() === selectedDateObj.toDateString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
        dir="rtl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
               <PackageOpen className="w-5 h-5 text-white" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white tracking-widest uppercase">المخزون والجرد</h2>
             </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex p-4 border-b border-white/5 gap-4">
          <button 
            onClick={() => setActiveTab('items')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === 'items' 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            <PackageOpen className="w-4 h-4" /> الأصناف والمخزون
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === 'logs' 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
              : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            <History className="w-4 h-4" /> سجل الحركات والمبيعات
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {activeTab === 'items' && (
            <div className="space-y-8">
              {/* Add New Item */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" /> إضافة صنف جديد
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="اسم الصنف"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-w-0 flex-1 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-w-0 flex-1 text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    placeholder="السعر (ل.س)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-w-0 flex-1 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="الكمية"
                      value={newItemStock}
                      onChange={(e) => setNewItemStock(e.target.value)}
                      className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-w-0 flex-1 w-full text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button
                      onClick={handleAddItem}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl transition-colors shrink-0 flex items-center justify-center font-bold"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </div>

              {/* Inventory List */}
              <div className="space-y-4">
                <h3 className="text-white font-bold tracking-widest uppercase flex items-center gap-2">
                  <PackageOpen className="w-4 h-4 text-emerald-400" /> الأصناف الحالية
                </h3>
                {inventory.length === 0 ? (
                  <div className="text-center p-8 text-zinc-500">لا يوجد أصناف في المخزون</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inventory.map(item => (
                      <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-white text-lg">{item.name}</div>
                            <div className="text-xs text-zinc-400 mt-1">{item.category}</div>
                          </div>
                          <div className="bg-black/50 px-3 py-1 rounded-full text-emerald-400 font-mono font-bold text-sm">
                            {item.price.toLocaleString()} ل.س
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                          <div className="text-zinc-300">
                            الكمية: <span className="font-bold font-mono text-white text-lg">{item.stock}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const qty = window.prompt(`سحب كمية من ${item.name}:`);
                                if (qty && !isNaN(Number(qty))) handleUpdateStock(item.id, Number(qty), 'out');
                              }}
                              className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30 transition-colors"
                              title="سحب (مبيع)"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const qty = window.prompt(`إضافة كمية إلى ${item.name}:`);
                                if (qty && !isNaN(Number(qty))) handleUpdateStock(item.id, Number(qty), 'in');
                              }}
                              className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-colors"
                              title="إضافة (جرد جديد)"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              {/* Date Selection */}
              <div className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                     <History className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold tracking-widest uppercase">السجل حسب اليوم</h3>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-blue-500/50"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 p-6 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
                  <div className="text-emerald-400/80 text-xs font-bold tracking-widest uppercase mb-2">مبيعات اليوم المحدد</div>
                  <div className="text-3xl font-orbitron font-bold text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{incomeSelectedDay.toLocaleString()} <span className="text-sm font-cairo">ل.س</span></div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 p-6 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-blue-500/20 transition-colors" />
                  <div className="text-blue-400/80 text-xs font-bold tracking-widest uppercase mb-2">مبيعات الشهر المحدد</div>
                  <div className="text-3xl font-orbitron font-bold text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">{incomeSelectedMonth.toLocaleString()} <span className="text-sm font-cairo">ل.س</span></div>
                </div>
              </div>

              <div className="bg-black/50 rounded-2xl border border-white/5 overflow-hidden">
                <table className="w-full text-right">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-zinc-400 text-sm font-bold tracking-widest uppercase">
                      <th className="p-4">الوقت</th>
                      <th className="p-4">النوع</th>
                      <th className="p-4">الصنف</th>
                      <th className="p-4">الكمية</th>
                      <th className="p-4">القيمة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredTransactions.slice().reverse().map(tx => (
                      <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 whitespace-nowrap text-zinc-400">
                          {new Date(tx.timestamp).toLocaleTimeString('ar-SY')}
                        </td>
                        <td className="p-4">
                          {tx.type === 'in' ? (
                           <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs font-bold">إدخال مخزون</span>
                          ) : (
                           <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md text-xs font-bold">مبيع / سحب</span>
                          )}
                        </td>
                        <td className="p-4 font-bold text-white">{tx.itemName}</td>
                        <td className="p-4 font-orbitron font-bold text-white">{tx.quantity}</td>
                        <td className="p-4 font-orbitron font-bold text-emerald-400">
                          {tx.totalPrice > 0 ? `${tx.totalPrice.toLocaleString()} ل.س` : '-'}
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-500">لا يوجد حركات في هذا اليوم</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
