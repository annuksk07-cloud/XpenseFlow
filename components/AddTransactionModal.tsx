import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TransactionType, CURRENCIES, CurrencyCode } from '../types';
import VoiceInput from './VoiceInput';
import { classifyExpense } from '../services/aiCategorizer';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n/translations';

declare const Tesseract: any;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const ScanningOverlay: React.FC<{ progress: number; status: string }> = ({ progress, status }) => (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F0F2F5]/80 backdrop-blur-sm rounded-3xl">
    <div className="neumorphic p-8 text-center w-3/4">
      <div className="mb-4 text-blue-600 animate-spin"><i className="fa-solid fa-spinner fa-2x"></i></div>
      <p className="font-bold text-[#1A1C2E] mb-2">Scanning Receipt</p>
      <p className="text-sm text-gray-500 mb-4 capitalize">{status}...</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 neumorphic-inset">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress * 100}%` }}></div>
      </div>
    </div>
  </div>
);

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState('General');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const CATEGORIES = useMemo(() => [
    t('categories.Food'), t('categories.Transport'), t('categories.Shopping'), 
    t('categories.Bills'), t('categories.Entertainment'), t('categories.Health'), 
    t('categories.Salary'), t('categories.Investment'), t('categories.General')
  ], [t]);
  
  useEffect(() => {
    if (title.length > 3 && !isScanning) {
      const predictedCategory = classifyExpense(title);
      const localizedCategory = t(`categories.${predictedCategory}`);
      if (CATEGORIES.includes(localizedCategory)) {
        setCategory(localizedCategory);
      }
    }
  }, [title, CATEGORIES, t, isScanning]);

  useEffect(() => {
    if (isOpen) {
      setTitle(''); setAmount(''); setType(TransactionType.EXPENSE); setCategory(t('categories.General')); setCurrency('USD');
    }
  }, [isOpen, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    const categoryKey = Object.keys(translations.en.categories).find(key => t(`categories.${key}`) === category) || 'General';
    onAdd({ title, originalAmount: parseFloat(amount), currency, type, category: categoryKey });
    onClose();
  };

  const handleVoiceTranscript = (text: string) => {
    setTitle(text.charAt(0).toUpperCase() + text.slice(1));
    const amountMatch = text.match(/(\d+(\.\d{1,2})?)/);
    if (amountMatch) setAmount(amountMatch[0]);
  };

  const parseReceiptText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim().length > 1);
    
    // Find Merchant (heuristic: first meaningful line)
    const merchant = lines[0] || 'Scanned Receipt';

    // Find Total Amount (heuristic: largest number, often near "total")
    const amountRegex = /(\d{1,5}[.,]\d{2})/g;
    let amounts = text.match(amountRegex)?.map(v => parseFloat(v.replace(',', '.'))) || [];
    const totalAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
    
    // Find Category
    const categoryKey = classifyExpense(text);
    const localizedCategory = t(`categories.${categoryKey}`);

    setTitle(merchant);
    setAmount(totalAmount.toFixed(2));
    if (CATEGORIES.includes(localizedCategory)) {
      setCategory(localizedCategory);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !Tesseract) return;

    setIsScanning(true);
    setScanStatus('Initializing AI');
    setScanProgress(0);

    let worker: any = null;

    try {
      worker = await Tesseract.createWorker('eng', 1, {
        logger: (m: any) => {
          if (m && typeof m.status === 'string') {
            setScanStatus(m.status);
          }
          if (m && m.status === 'recognizing text' && typeof m.progress === 'number') {
            setScanProgress(m.progress);
          }
        },
      });

      const { data: { text } } = await worker.recognize(file);
      parseReceiptText(text);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('OCR Error:', errorMessage);
      alert('Could not read receipt. Please try a clearer image.');
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsScanning(false);
      // Clear file input value to allow scanning the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-[#F0F2F5] rounded-3xl p-6 shadow-2xl relative animate-in fade-in" onClick={e => e.stopPropagation()}>
        {isScanning && <ScanningOverlay progress={scanProgress} status={scanStatus} />}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full neumorphic-flat active:neumorphic-pressed !rounded-full transition-all text-gray-500 z-20"><i className="fa-solid fa-xmark"></i></button>
        <div className="flex items-center justify-between mb-6 pr-12">
           <h3 className="text-xl font-bold text-[#1A1C2E] pl-2">{t('modals.newEntry')}</h3>
           <div className="flex gap-2">
             <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 w-12 h-12 flex items-center justify-center text-lg rounded-full neumorphic-flat active:neumorphic-pressed !rounded-full text-blue-600 transition-all" aria-label="Scan receipt"><i className="fa-solid fa-camera-retro"></i></button>
             <VoiceInput onTranscript={handleVoiceTranscript} />
           </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex p-1 rounded-xl neumorphic-inset">
            <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${type === TransactionType.EXPENSE ? 'neumorphic-flat !rounded-lg text-rose-500' : 'text-gray-500'}`}>{t('modals.expense')}</button>
            <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${type === TransactionType.INCOME ? 'neumorphic-flat !rounded-lg text-emerald-500' : 'text-gray-500'}`}>{t('modals.income')}</button>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder={t('modals.titlePlaceholder')} value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 neumorphic-inset outline-none placeholder:text-gray-400 text-[#1A1C2E]" />
            <div className="flex gap-3">
               <input type="number" placeholder={t('modals.amountPlaceholder')} value={amount} onChange={e => setAmount(e.target.value)} required className="flex-1 w-full px-4 py-3 neumorphic-inset outline-none placeholder:text-gray-400 text-[#1A1C2E]" />
               <select value={currency} onChange={e => setCurrency(e.target.value as CurrencyCode)} className="w-1/3 px-4 py-3 neumorphic-inset outline-none text-[#1A1C2E]">{Object.keys(CURRENCIES).map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 neumorphic-inset outline-none text-[#1A1C2E]">{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select>
          </div>
          <button type="submit" className="w-full py-4 rounded-xl neumorphic-flat active:neumorphic-pressed !rounded-xl bg-blue-600 text-white font-bold transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-check"></i>{t('modals.saveTransaction')}</button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;