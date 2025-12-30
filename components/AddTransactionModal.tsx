import React, { useState, useEffect } from 'react';
import { TransactionType, CURRENCIES, CurrencyCode } from '../types';
import VoiceInput from './VoiceInput';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Investment', 'General'];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('General');
  
  useEffect(() => {
    if (isOpen) {
      setTitle(''); setAmount(''); setType(TransactionType.EXPENSE); setCategory('General'); setCurrency('USD');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    onAdd({ title, originalAmount: parseFloat(amount), currency, type, category });
    onClose();
  };

  const handleVoiceTranscript = (text: string) => {
    setTitle(text.charAt(0).toUpperCase() + text.slice(1));
    const amountMatch = text.match(/(\d+(\.\d{1,2})?)/);
    if (amountMatch) setAmount(amountMatch[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#efeeee] rounded-3xl p-6 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] relative animate-in fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        <div className="flex items-center justify-between mb-6 pr-12">
           <h3 className="text-xl font-bold text-gray-700 pl-2">New Entry</h3>
           <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex p-1 rounded-xl bg-[#efeeee] shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]">
            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`flex-1 py-4 rounded-lg font-bold text-sm transition-all duration-300 ${type === TransactionType.EXPENSE ? 'bg-[#efeeee] text-red-500 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]' : 'text-gray-400'}`}>Expense</button>
            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`flex-1 py-4 rounded-lg font-bold text-sm transition-all duration-300 ${type === TransactionType.INCOME ? 'bg-[#efeeee] text-green-600 shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]' : 'text-gray-400'}`}>Income</button>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]" />
            <div className="flex gap-3">
               <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required className="flex-1 w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]" />
               <select value={currency} onChange={e => setCurrency(e.target.value as CurrencyCode)} className="w-1/3 px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]">{Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff]">{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl bg-[#efeeee] text-blue-500 font-bold shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] flex items-center justify-center gap-2"><i className="fa-solid fa-check"></i>Save Transaction</button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;