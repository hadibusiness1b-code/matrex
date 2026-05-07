import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, UserPlus, FileText, ArrowDown, ArrowUp } from 'lucide-react';
import { DebtAccount, DebtTransaction } from '../types';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debts: DebtAccount[];
  transactions: DebtTransaction[];
  onSaveDebts: (debts: DebtAccount[]) => void;
  onSaveTransactions: (txs: DebtTransaction[]) => void;
}

export function DebtModal({ isOpen, onClose, debts, transactions, onSaveDebts, onSaveTransactions }: DebtModalProps) {
  const [activeTab, setActiveTab] = useState<'accounts' | 'logs'>('accounts');
  const [newAccountName, setNewAccountName] = useState('');
  
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxDesc, setNewTxDesc] = useState('');
  const [txMode, setTxMode] = useState<'none' | 'add' | 'pay'>('none');

  const handleAddAccount = () => {
    if (!newAccountName.trim()) return;
    
    const newAccount: DebtAccount = {
      id: Math.random().toString(36).substring(7),
      name: newAccountName.trim(),
      balance: 0
    };
    
    onSaveDebts([...debts, newAccount]);
    setNewAccountName('');
  };

  const handleAddDebtAmount = (accountId: string, amount: number, description: string) => {
    if (amount === 0) return;

    const account = debts.find(d => d.id === accountId);
    if (!account) return;

    const updatedDebts = debts.map(d =>
      d.id === accountId ? { ...d, balance: d.balance + amount } : d
    );
    onSaveDebts(updatedDebts);

    const newTx: DebtTransaction = {
      id: Math.random().toString(36).substring(7),
      accountId,
      amount,
      description,
      timestamp: Date.now()
    };
    onSaveTransactions([...transactions, newTx]);
    
    setNewTxAmount('');
    setTxMode('none');
    setNewTxDesc('');
  };

  if (!isOpen) return null;

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
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
               <Users className="w-5 h-5 text-white" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white tracking-widest uppercase">الديون والحسابات</h2>
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
            onClick={() => { setActiveTab('accounts'); setSelectedAccountId(null); }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === 'accounts' 
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
              : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" /> الحسابات
          </button>
          <button 
            onClick={() => { setActiveTab('logs'); setSelectedAccountId(null); }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
              activeTab === 'logs' 
              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
              : 'bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" /> سجل العمليات
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {activeTab === 'accounts' && !selectedAccountId && (
            <div className="space-y-8">
              {/* Add New Account */}
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <h3 className="text-white font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-400" /> إضافة حساب جديد
                </h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="اسم الشخص"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 min-w-0 flex-1 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    onClick={handleAddAccount}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl transition-colors shrink-0 flex items-center justify-center font-bold"
                  >
                    إضافة
                  </button>
                </div>
              </div>

              {/* Accounts List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {debts.map(account => (
                  <div key={account.id} className="bg-white/5 p-6 rounded-xl border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                    <div className="font-bold text-white text-xl z-10">{account.name}</div>
                    
                    <div className="mt-2 flex items-baseline gap-2 z-10">
                      <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest">الرصيد:</span>
                      <span className={`font-orbitron font-black text-2xl ${account.balance > 0 ? 'text-red-400' : account.balance < 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {Math.abs(account.balance).toLocaleString()}
                        <span className="text-sm font-cairo mr-1">{account.balance > 0 ? '(عليه)' : account.balance < 0 ? '(له)' : ''} ل.س</span>
                      </span>
                    </div>

                    <button 
                      onClick={() => setSelectedAccountId(account.id)}
                      className="mt-4 w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors z-10 flex items-center justify-center gap-2"
                    >
                      إدارة الحساب
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'accounts' && selectedAccountId && (
            <div className="space-y-6">
              {(() => {
                const account = debts.find(d => d.id === selectedAccountId);
                if (!account) return null;

                const accountTxs = transactions.filter(t => t.accountId === account.id).slice().reverse();

                return (
                  <>
                    <button 
                      onClick={() => setSelectedAccountId(null)}
                      className="text-purple-400 hover:text-purple-300 font-bold text-sm mb-4"
                    >
                      &rarr; العودة للحسابات
                    </button>

                    <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{account.name}</h3>
                        <div className="mt-2 text-zinc-400">
                          الرصيد الكلي: 
                          <span className={`mr-2 font-black font-orbitron text-xl ${account.balance > 0 ? 'text-red-400' : account.balance < 0 ? 'text-emerald-400' : 'text-white'}`}>
                            {account.balance > 0 ? `عليه ${account.balance.toLocaleString()}` : account.balance < 0 ? `له ${Math.abs(account.balance).toLocaleString()}` : '0'} ل.س
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {txMode === 'none' ? (
                          <>
                            <button
                              onClick={() => {
                                setTxMode('add');
                                setNewTxDesc('إضافة دين');
                              }}
                              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 border border-red-500/30 font-bold transition-colors"
                            >
                              تسجيل دين
                            </button>
                            <button
                              onClick={() => {
                                setTxMode('pay');
                                setNewTxDesc('دفعة من الحساب');
                              }}
                              className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 border border-emerald-500/30 font-bold transition-colors"
                            >
                              إضافة دفعة
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-2 bg-black/50 p-2 rounded-xl border border-white/10 items-center">
                            <input
                              type="number"
                              placeholder="المبلغ"
                              value={newTxAmount}
                              onChange={e => setNewTxAmount(e.target.value)}
                              className="bg-transparent border-b border-white/10 px-2 py-1 text-white outline-none w-24 focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="الوصف"
                              value={newTxDesc}
                              onChange={e => setNewTxDesc(e.target.value)}
                              className="bg-transparent border-b border-white/10 px-2 py-1 text-white outline-none w-32 focus:border-blue-500"
                            />
                            <button
                              onClick={() => {
                                const amt = Number(newTxAmount);
                                if (!isNaN(amt) && amt > 0) {
                                  handleAddDebtAmount(account.id, txMode === 'add' ? amt : -amt, newTxDesc);
                                }
                              }}
                              className={`px-3 py-1 rounded-lg font-bold text-sm ${txMode === 'add' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={() => { setTxMode('none'); setNewTxAmount(''); }}
                              className="px-3 py-1 text-zinc-400 hover:text-white"
                            >
                              إلغاء
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-black/50 rounded-2xl border border-white/5 overflow-hidden">
                      <table className="w-full text-right">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5 text-zinc-400 text-sm font-bold tracking-widest uppercase">
                            <th className="p-4">الوقت</th>
                            <th className="p-4">النوع</th>
                            <th className="p-4">المبلغ</th>
                            <th className="p-4">البيان/الوصف</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                          {accountTxs.map(tx => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 text-zinc-400">{new Date(tx.timestamp).toLocaleString('ar-SY')}</td>
                              <td className="p-4">
                                {tx.amount > 0 ? (
                                  <span className="text-red-400 font-bold">تسجيل دين</span>
                                ) : (
                                  <span className="text-emerald-400 font-bold">دفعة</span>
                                )}
                              </td>
                              <td className="p-4 font-orbitron font-bold">
                                {tx.amount > 0 
                                  ? <span className="text-red-400">+{tx.amount.toLocaleString()}</span> 
                                  : <span className="text-emerald-400">-{Math.abs(tx.amount).toLocaleString()}</span>
                                }
                              </td>
                              <td className="p-4 text-white">{tx.description}</td>
                            </tr>
                          ))}
                          {accountTxs.length === 0 && (
                            <tr><td colSpan={4} className="p-8 text-center text-zinc-500">لا يوجد حركات</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'logs' && (
             <div className="bg-black/50 rounded-2xl border border-white/5 overflow-hidden">
               <table className="w-full text-right">
                 <thead>
                   <tr className="border-b border-white/5 bg-white/5 text-zinc-400 text-sm font-bold tracking-widest uppercase">
                     <th className="p-4">الوقت</th>
                     <th className="p-4">النوع</th>
                     <th className="p-4">الحساب</th>
                     <th className="p-4">المبلغ</th>
                     <th className="p-4">الوصف</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 text-sm">
                   {transactions.slice().reverse().map(tx => {
                     const acc = debts.find(d => d.id === tx.accountId);
                     return (
                       <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                         <td className="p-4 whitespace-nowrap text-zinc-400">{new Date(tx.timestamp).toLocaleString('ar-SY')}</td>
                         <td className="p-4">
                           {tx.amount > 0 ? (
                             <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md text-xs font-bold">تسجيل دين</span>
                           ) : (
                             <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-xs font-bold">دفعة مدفوعة</span>
                           )}
                         </td>
                         <td className="p-4 font-bold text-white">{acc?.name || 'مجهول'}</td>
                         <td className="p-4 font-orbitron font-bold text-white">{Math.abs(tx.amount).toLocaleString()} ل.س</td>
                         <td className="p-4 text-zinc-300">{tx.description}</td>
                       </tr>
                     );
                   })}
                   {transactions.length === 0 && (
                     <tr><td colSpan={5} className="p-8 text-center text-zinc-500">لا يوجد حركات ديون</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
