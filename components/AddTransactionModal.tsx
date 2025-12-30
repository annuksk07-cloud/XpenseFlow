import React, { useState, useEffect } from 'react';
import { TransactionType, CURRENCIES, CurrencyCode, PaymentMethod } from '../types';
import { X, Check, RefreshCw, Tag, Receipt, CreditCard } from 'lucide-react';
import VoiceInput from './VoiceInput';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const CATEGORY_TAGS: Record<string, string[]> = {
  Food: ['#Groceries', '#DiningOut', '#Snacks'],
  Transport: ['#Fuel', '#Uber', '#PublicTransport'],
  Shopping: ['#Clothing', '#Electronics', '#Home'],
  Bills: ['#Rent', '#Utilities', '#Internet'],
  Entertainment: ['#Movies', '#Games', '#Subscriptions'],
  Health: ['#Pharmacy', '#Doctor', '#Gym'],
  Salary: ['#Bonus', '#Freelance'],
  Investment: ['#Stocks', '#Crypto']
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('General');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
  const [hasTax, setHasTax] = useState(false);
  const [taxAmount, setTaxAmount] = useState('');
  
  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setAmount('');
      setType(TransactionType.EXPENSE);
      setCategory('General');
      setIsRecurring(false);
      setSelectedTags([]);
      setCurrency('USD');
      setPaymentMethod(PaymentMethod.CARD);
      setHasTax(false);
      setTaxAmount('');
    }
  }, [isOpen]);

  const handleVoiceTranscript = (text: string) => {
    const lower = text.toLowerCase();
    
    // Attempt to find amount
    const amountMatch = lower.match(/(\d+(\.\d{1,2})?)/);
    if (amountMatch) {
      setAmount(amountMatch[0]);
    }

    const categories = Object.keys(CATEGORY_TAGS);
    const foundCat = categories.find(c => lower.includes(c.toLowerCase()));
    if (foundCat) setCategory(foundCat);

    setTitle(text.charAt(0).toUpperCase() + text.slice(1));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAdd({
      title,
      originalAmount: parseFloat(amount),
      currency,
      type,
      category,
      date: new Date().toISOString(),
      isRecurring,
      tags: selectedTags,
      paymentMethod,
      hasTax,
      taxAmount: hasTax ? parseFloat(taxAmount) || 0 : 0
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#efeeee] rounded-3xl p-6 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] text-gray-500 active:shadow-[inset_5px_5px_10px_#c5c5c5,inset_-5px_-5px_10px_#ffffff] transition-all"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between mb-6 pr-12">
           <h3 className="text-xl font-bold text-gray-700 pl-2">New Entry</h3>
           <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Type Toggle */}
          <div className="flex p-1 rounded-xl bg-[#efeeee] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                type === TransactionType.EXPENSE 
                  ? 'bg-[#efeeee] text-red-500 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-4 rounded-lg font-bold text-sm transition-all duration-300 ${
                type === TransactionType.INCOME 
                  ? 'bg-[#efeeee] text-green-600 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Income
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 ml-3 mb-1 uppercase tracking-wide">Title</label>
              <input
                type="text"
                placeholder="e.g. Groceries"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none text-gray-700 shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] focus:ring-2 focus:ring-blue-400/20 transition-all placeholder-gray-400"
                required
              />
            </div>

            <div className="flex gap-3">
               <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 ml-3 mb-1 uppercase tracking-wide">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none text-gray-700 shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] focus:ring-2 focus:ring-blue-400/20 transition-all placeholder-gray-400"
                  required
                />
               </div>
               <div className="w-1/3">
                 <label className="block text-xs font-bold text-gray-500 ml-3 mb-1 uppercase tracking-wide">Currency</label>
                 <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none text-gray-700 shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]"
                 >
                   {Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
            </div>

            {/* Payment Method */}
             <div>
              <label className="block text-xs font-bold text-gray-500 ml-3 mb-1 uppercase tracking-wide">Payment Method</label>
              <div className="relative">
                <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full pl-10 pr-4 py-3 bg-[#efeeee] rounded-xl outline-none text-gray-700 shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] appearance-none"
                >
                    {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            
             <div>
              <label className="block text-xs font-bold text-gray-500 ml-3 mb-1 uppercase tracking-wide">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none text-gray-700 shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] focus:ring-2 focus:ring-blue-400/20 transition-all appearance-none"
              >
                <option>General</option>
                {Object.keys(CATEGORY_TAGS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Tax & Recurring Row */}
            <div className="flex gap-3">
                 {/* Tax Toggle */}
                <div className={`flex-1 p-3 rounded-xl transition-all ${hasTax ? 'bg-purple-50 border border-purple-100' : 'bg-transparent'}`}>
                    <div 
                        onClick={() => setHasTax(!hasTax)}
                        className="flex items-center gap-2 cursor-pointer mb-2"
                    >
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] ${hasTax ? 'text-purple-500' : 'text-gray-400'}`}>
                            <Receipt size={12} />
                         </div>
                         <span className="text-xs font-bold text-gray-700">Incl. Tax?</span>
                    </div>
                    {hasTax && (
                        <input 
                            type="number"
                            placeholder="Tax Amt"
                            value={taxAmount}
                            onChange={(e) => setTaxAmount(e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-white rounded border border-purple-200 outline-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>

                 {/* Recurring Toggle */}
                <div 
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`flex-1 flex flex-col justify-center items-start p-3 rounded-xl cursor-pointer transition-all ${
                    isRecurring ? 'bg-blue-50 border border-blue-100' : 'bg-transparent'
                  }`}
                >
                   <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-[inset_2px_2px_4px_#c5c5c5,inset_-2px_-2px_4px_#ffffff] ${isRecurring ? 'text-blue-500' : 'text-gray-400'}`}>
                            <RefreshCw size={12} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">Recurring?</span>
                   </div>
                   <span className="text-[9px] text-gray-400 ml-8 mt-1">Monthly</span>
                </div>
            </div>

          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#efeeee] text-blue-500 font-bold shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#c5c5c5,inset_-6px_-6px_12px_#ffffff] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;