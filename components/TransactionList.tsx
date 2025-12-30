import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { Trash2, ShoppingBag, Coffee, Car, Home, Zap, Heart, DollarSign, Briefcase, Search, Filter, RefreshCw, Hash, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  currencySymbol: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'food': return <Coffee size={20} />;
    case 'shopping': return <ShoppingBag size={20} />;
    case 'transport': return <Car size={20} />;
    case 'bills': return <Home size={20} />;
    case 'entertainment': return <Zap size={20} />;
    case 'health': return <Heart size={20} />;
    case 'salary': return <DollarSign size={20} />;
    case 'investment': return <Briefcase size={20} />;
    default: return <DollarSign size={20} />;
  }
};

type FilterRange = 'ALL' | 'WEEK' | 'MONTH';

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, currencySymbol }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRange, setFilterRange] = useState<FilterRange>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced Filters State
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(lower) || 
        t.amount.toString().includes(lower) ||
        t.category.toLowerCase().includes(lower) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(lower)))
      );
    }

    // Time Range
    const now = new Date();
    if (filterRange === 'WEEK') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
    } else if (filterRange === 'MONTH') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filtered = filtered.filter(t => new Date(t.date) >= monthAgo);
    }

    // Amount Range
    if (minAmount) filtered = filtered.filter(t => t.amount >= parseFloat(minAmount));
    if (maxAmount) filtered = filtered.filter(t => t.amount <= parseFloat(maxAmount));

    // Payment Method
    if (paymentFilter !== 'ALL') {
        filtered = filtered.filter(t => t.paymentMethod === paymentFilter);
    }

    return filtered;
  }, [transactions, searchTerm, filterRange, minAmount, maxAmount, paymentFilter]);


  return (
    <div className="space-y-4 pb-24">
      
      {/* Search & Basic Filter */}
      <div className="mb-2 space-y-4">
        <div className="relative flex gap-2">
           <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 h-12 rounded-xl bg-[#efeeee] shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] outline-none text-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-100"
             />
           </div>
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`px-4 h-12 rounded-xl shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] transition-all active:scale-95 ${showFilters ? 'text-blue-500' : 'text-gray-500'}`}
           >
             <SlidersHorizontal size={20} />
           </button>
        </div>

        {/* Advanced Filter Drawer */}
        {showFilters && (
            <div className="p-4 rounded-2xl bg-[#efeeee] shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff] animate-in slide-in-from-top-4 fade-in">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Min Amount</label>
                        <input type="number" value={minAmount} onChange={e => setMinAmount(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" placeholder="0" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Max Amount</label>
                        <input type="number" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} className="w-full mt-1 p-2 rounded-lg bg-white/50 border border-gray-200 text-sm" placeholder="Max" />
                    </div>
                </div>
                <div>
                     <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Payment Method</label>
                     <div className="flex flex-wrap gap-2">
                        {['ALL', ...Object.values(PaymentMethod)].map(pm => (
                            <button
                                key={pm}
                                onClick={() => setPaymentFilter(pm)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                paymentFilter === pm
                                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                : 'bg-transparent border-gray-300 text-gray-500'
                                }`}
                            >
                                {pm}
                            </button>
                        ))}
                     </div>
                </div>
            </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(['ALL', 'WEEK', 'MONTH'] as FilterRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setFilterRange(range)}
              className={`px-4 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filterRange === range 
                  ? 'bg-[#efeeee] text-blue-500 shadow-[inset_3px_3px_6px_#d1d1d1,inset_-3px_-3px_6px_#ffffff]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {range === 'ALL' ? 'All Time' : range === 'WEEK' ? 'Last 7 Days' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-700 pl-2">
        {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 && 's'}
      </h3>
      
      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] flex items-center justify-center mb-4">
            <Filter className="w-8 h-8 opacity-50" />
          </div>
          <p className="font-medium text-sm">No transactions found</p>
        </div>
      ) : (
        filteredTransactions.map((t) => (
          <div 
            key={t.id}
            className="group flex items-center justify-between p-4 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff] transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-[inset_3px_3px_6px_#c5c5c5,inset_-3px_-3px_6px_#ffffff] ${
                t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'
              }`}>
                {getCategoryIcon(t.category)}
                {t.isRecurring && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white border-2 border-[#efeeee]">
                    <RefreshCw size={10} />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                   <p className="font-bold text-gray-700 text-sm">{t.title}</p>
                   {t.tags && t.tags.length > 0 && (
                     <span className="text-[10px] text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                       <Hash size={8} /> {t.tags[0]}
                     </span>
                   )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(t.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{t.paymentMethod || 'Card'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className={`block font-bold ${
                  t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{currencySymbol}{Math.abs(t.amount).toFixed(2)}
                </span>
                {t.hasTax && <span className="text-[9px] text-purple-400 block">+Tax</span>}
              </div>
              <button
                onClick={() => onDelete(t.id)}
                className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-gray-200 transition-colors"
                aria-label="Delete transaction"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionList;