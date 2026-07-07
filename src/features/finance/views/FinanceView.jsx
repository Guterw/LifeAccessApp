// src/features/finance/views/FinanceView.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  TrendingUp, TrendingDown, Wallet, Receipt, X, Plus, Minus,
  ArrowUpCircle, ArrowDownCircle, ChevronRight, PiggyBank, RefreshCw
} from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';
import { todayKey } from '../../../utils/calendarUtils';
import {
  getExchangeRateBRLtoEUR, convertCurrency, setPrimaryCurrency, CURRENCY_SYMBOLS, formatCurrencyValue
} from '../../../utils/currencyManager';

const EXPENSE_CATEGORIES = ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Contas', 'Saúde', 'Outros'];
const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros'];

function AddTransactionModal({ defaultType = 'expense', primaryCurrency, onClose, onSave, t }) {
  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(primaryCurrency);
  const [category, setCategory] = useState(defaultType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayKey());

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(String(amount).replace(',', '.'));
    if (!parsedAmount || parsedAmount <= 0) return;
    onSave({
      type,
      amount: parsedAmount,
      currency,
      category,
      description: description.trim(),
      date,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-black text-white">
            {t('finance.newTransaction', 'Nova Transação')}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-full">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                type === 'expense' ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              <ArrowDownCircle size={22} />
              <span className="text-xs font-bold">{t('finance.expense', 'Gasto')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                type === 'income' ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400'
              }`}
            >
              <ArrowUpCircle size={22} />
              <span className="text-xs font-bold">{t('finance.income', 'Receita')}</span>
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('finance.amount', 'Valor')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="flex-1 bg-gray-800 text-white p-4 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-2xl font-black text-center"
              />
              <div className="flex bg-gray-800 rounded-xl border-2 border-gray-700 overflow-hidden shrink-0">
                {['BRL', 'EUR'].map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className={`px-3 font-black text-sm transition-colors ${
                      currency === cur ? 'bg-blue-600 text-white' : 'text-gray-400'
                    }`}
                  >
                    {CURRENCY_SYMBOLS[cur]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('finance.category', 'Categoria')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('finance.description', 'Descrição (opcional)')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('finance.descPlaceholder', 'Ex: Mercado do mês')}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t('finance.date', 'Data')}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none text-sm [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-xl font-black text-white transition-colors shadow-lg ${
              type === 'expense' ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {type === 'expense' ? t('finance.saveExpense', 'Salvar Gasto') : t('finance.saveIncome', 'Salvar Receita')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FinanceView() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState('expense');
  const [exchangeRate, setExchangeRate] = useState(0.17);
  const [isRefreshingRate, setIsRefreshingRate] = useState(false);

  const appSettings = useLiveQuery(() => db.appSettings.get(1)) || {};
  const primaryCurrency = appSettings.primaryCurrency || 'BRL';

  const transactions = useLiveQuery(() => db.financeTransactions.toArray(), []) || [];

  useEffect(() => {
    const loadRate = async () => {
      const rate = await getExchangeRateBRLtoEUR();
      setExchangeRate(rate);
    };
    loadRate();
  }, []);

  const handleRefreshRate = async () => {
    setIsRefreshingRate(true);
    const rate = await getExchangeRateBRLtoEUR(true);
    setExchangeRate(rate);
    setIsRefreshingRate(false);
  };

  const handleChangePrimaryCurrency = async (cur) => {
    await setPrimaryCurrency(cur);
  };

  // Converte cada transação (que pode estar em BRL ou EUR) para a moeda
  // principal escolhida, usando a cotação real, antes de somar os totais.
  const { totalIncome, totalExpense, balance, recent } = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach((tx) => {
      const txCurrency = tx.currency || 'BRL';
      const converted = convertCurrency(tx.amount, txCurrency, primaryCurrency, exchangeRate);
      if (tx.type === 'income') income += converted;
      else expense += converted;
    });
    const sorted = [...transactions].sort((a, b) => new Date(b.date + 'T' + (b.createdAt?.split('T')[1] || '00:00')) - new Date(a.date + 'T' + (a.createdAt?.split('T')[1] || '00:00')));
    return { totalIncome: income, totalExpense: expense, balance: income - expense, recent: sorted.slice(0, 5) };
  }, [transactions, primaryCurrency, exchangeRate]);

  const openModal = (type) => {
    setModalDefaultType(type);
    setModalOpen(true);
  };

  const handleSaveTransaction = async (data) => {
    await db.financeTransactions.add(data);
    setModalOpen(false);
  };

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mt-5 -mb-20 min-h-screen">
      <BackButton to="/" label={t('backToHome', 'Voltar')} />

      <div className="flex items-center gap-3 mb-4 -mt-3">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
          <Wallet size={28} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-black text-white">{t('finance.title', 'Finanças')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">{t('finance.subtitle', 'Controle de Gastos e Receitas')}</p>
        </div>
      </div>

      {/* SELETOR DE MOEDA PRINCIPAL + COTAÇÃO */}
      <div className="bg-gray-800/60 rounded-2xl border border-gray-700 p-3 mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {t('finance.primaryCurrency', 'Moeda Principal')}
          </span>
          <div className="flex bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
            {['BRL', 'EUR'].map((cur) => (
              <button
                key={cur}
                onClick={() => handleChangePrimaryCurrency(cur)}
                className={`px-3 py-1 text-xs font-black transition-colors ${
                  primaryCurrency === cur ? 'bg-emerald-600 text-white' : 'text-gray-400'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleRefreshRate}
          disabled={isRefreshingRate}
          className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-white transition-colors shrink-0"
          title={t('finance.refreshRate', 'Atualizar cotação')}
        >
          <RefreshCw size={12} className={isRefreshingRate ? 'animate-spin' : ''} />
          1 R$ = {exchangeRate.toFixed(4)} €
        </button>
      </div>

      {/* CARD DE SALDO */}
      <div className={`rounded-3xl p-6 mb-6 border shadow-xl relative overflow-hidden ${
        balance >= 0 ? 'bg-gradient-to-br from-emerald-900/40 to-gray-800 border-emerald-500/30' : 'bg-gradient-to-br from-red-900/40 to-gray-800 border-red-500/30'
      }`}>
        <div className="absolute -top-6 -right-6 opacity-10">
          <PiggyBank size={140} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 relative z-10">
          {t('finance.currentBalance', 'Saldo Atual')}
        </p>
        <h3 className={`text-4xl font-black relative z-10 ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatCurrencyValue(balance, primaryCurrency)}
        </h3>
        <div className="flex gap-6 mt-5 relative z-10">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-bold">{t('finance.income', 'Receitas')}</p>
              <p className="text-sm font-bold text-green-400">{formatCurrencyValue(totalIncome, primaryCurrency)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-red-400" />
            <div>
              <p className="text-[9px] text-gray-400 uppercase font-bold">{t('finance.expense', 'Gastos')}</p>
              <p className="text-sm font-bold text-red-400">{formatCurrencyValue(totalExpense, primaryCurrency)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AÇÕES RÁPIDAS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => openModal('expense')}
          className="bg-gray-800 border border-red-500/30 hover:border-red-400 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <div className="p-3 bg-red-500/20 text-red-400 rounded-xl"><Minus size={24} /></div>
          <span className="text-sm font-black text-white">{t('finance.addExpense', 'Adicionar Gasto')}</span>
        </button>
        <button
          onClick={() => openModal('income')}
          className="bg-gray-800 border border-green-500/30 hover:border-green-400 rounded-2xl p-5 flex flex-col items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><Plus size={24} /></div>
          <span className="text-sm font-black text-white">{t('finance.addIncome', 'Adicionar Receita')}</span>
        </button>
      </div>

      {/* VER PLANILHA */}
      <button
        onClick={() => navigate('/finance/transactions')}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black p-5 rounded-2xl flex items-center justify-between shadow-lg transition-all active:scale-[0.98] mb-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl"><Receipt size={22} /></div>
          <div className="text-left">
            <h3 className="text-base font-black">{t('finance.viewStatement', 'Ver Planilha / Extrato')}</h3>
            <p className="text-[10px] text-blue-100 font-medium">{t('finance.viewStatementDesc', 'Todos os lançamentos e cálculos')}</p>
          </div>
        </div>
        <ChevronRight className="text-white/70" />
      </button>

      {/* RECENTES */}
      <h3 className="font-bold text-gray-400 mb-3 uppercase tracking-wider text-xs">{t('finance.recentTransactions', 'Lançamentos Recentes')}</h3>
      <div className="space-y-2">
        {recent.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-6 text-center text-gray-500 text-sm">
            {t('finance.noTransactions', 'Nenhuma transação registrada ainda.')}
          </div>
        ) : (
          recent.map((tx) => {
            const txCurrency = tx.currency || 'BRL';
            return (
              <div key={tx.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${tx.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {tx.type === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{tx.description || tx.category}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{tx.category} • {tx.date.slice(5).split('-').reverse().join('/')} • {txCurrency}</p>
                  </div>
                </div>
                <span className={`text-sm font-black shrink-0 ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrencyValue(tx.amount, txCurrency)}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="shrink-0 mt-8">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {modalOpen && (
        <AddTransactionModal
          defaultType={modalDefaultType}
          primaryCurrency={primaryCurrency}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveTransaction}
          t={t}
        />
      )}
    </div>
  );
}