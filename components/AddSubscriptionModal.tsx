import React, { useState } from 'react';
import { CURRENCIES, CurrencyCode } from '../types';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !startDate) return;

    const nextDueDate = new Date(startDate);
    if (billingCycle === 'monthly') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    } else {
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
    }

    onAdd({
      name,
      amount: parseFloat(amount),
      currency,
      billingCycle,
      nextDueDate: nextDueDate.toISOString(),
    });
    onClose();
    // Reset fields
    setName(''); setAmount(''); setCurrency('USD'); setBillingCycle('monthly'); setStartDate(new Date().toISOString().split('T')[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#efeeee] rounded-3xl p-6 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] relative animate-in fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-[#efeeee] shadow-[5px_5px_10px_#c5c5c5,-5px_-5px_10px_#ffffff] text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        <h3 className="text-xl font-bold text-gray-700 pl-2 mb-6">New Subscription</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <input type="text" placeholder="Subscription Name (e.g. Netflix)" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] placeholder:text-gray-500 text-gray-800" />
            <div className="flex gap-3">
              <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required className="flex-1 w-full px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] placeholder:text-gray-500 text-gray-800" />
              <select value={currency} onChange={e => setCurrency(e.target.value as CurrencyCode)} className="w-1/3 px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] text-gray-800">{Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div className="flex gap-3">
                <select value={billingCycle} onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly')} className="w-1/2 px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] text-gray-800">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-1/2 px-4 py-3 bg-[#efeeee] rounded-xl outline-none shadow-[inset_5px_5px_10px_#d1d1d1,inset_-5px_-5px_10px_#ffffff] text-gray-800" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl bg-[#efeeee] text-blue-500 font-bold shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] flex items-center justify-center gap-2"><i className="fa-solid fa-check"></i>Save Subscription</button>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;