import React, { useState } from 'react';
import { CURRENCIES, CurrencyCode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#F0F2F5] rounded-3xl p-6 shadow-2xl relative animate-in fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full neumorphic-flat active:neumorphic-pressed !rounded-full transition-all text-gray-500"><i className="fa-solid fa-xmark"></i></button>
        <h3 className="text-xl font-bold text-[#1A1C2E] pl-2 mb-6">{t('modals.newSubscription')}</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <input type="text" placeholder={t('modals.subscriptionNamePlaceholder')} value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 neumorphic-inset outline-none placeholder:text-gray-400 text-[#1A1C2E]" />
            <div className="flex gap-3">
              <input type="number" placeholder={t('modals.amountPlaceholder')} value={amount} onChange={e => setAmount(e.target.value)} required className="flex-1 w-full px-4 py-3 neumorphic-inset outline-none placeholder:text-gray-400 text-[#1A1C2E]" />
              <select value={currency} onChange={e => setCurrency(e.target.value as CurrencyCode)} className="w-1/3 px-4 py-3 neumorphic-inset outline-none text-[#1A1C2E]">{Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div className="flex gap-3">
                <select value={billingCycle} onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly')} className="w-1/2 px-4 py-3 neumorphic-inset outline-none text-[#1A1C2E]">
                    <option value="monthly">{t('modals.monthly')}</option>
                    <option value="yearly">{t('modals.yearly')}</option>
                </select>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-1/2 px-4 py-3 neumorphic-inset outline-none text-[#1A1C2E]" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl neumorphic-flat active:neumorphic-pressed !rounded-xl bg-[#00D09C] text-white font-bold transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-check"></i>{t('modals.saveSubscription')}</button>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;