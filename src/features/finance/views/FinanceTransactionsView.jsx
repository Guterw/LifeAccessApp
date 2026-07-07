// src/features/finance/views/FinanceTransactionsView.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Trash2, ArrowUpCircle, ArrowDownCircle, AlertTriangle, X, FileSpreadsheet } from 'lucide-react';
import { db } from '../../../config/dexieDb';
import { useLanguage } from '../../../contexts/LanguageContext';
import BackButton from '../../../components/BackButton';
import FooterBrand from '../../../components/FooterBrand';
import { getExchangeRates, convertCurrency, formatCurrencyValue } from '../../../utils/currencyManager';

export default function FinanceTransactionsView() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all'); // all | income | expense
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [exchangeRate, setExchangeRate] = useState(0.17);

  const appSettings = useLiveQuery(() => db.appSettings.get(1)) || {};
  const primaryCurrency = appSettings.primaryCurrency || 'BRL';

  const transactions = useLiveQuery(() => db.financeTransactions.toArray(), []) || [];

  useEffect(() => {
    getExchangeRates().then((r) => setExchangeRate(r.brlToEur));
  }, []);

  const convertToPrimary = (tx) => convertCurrency(tx.amount, tx.currency || 'BRL', primaryCurrency, exchangeRate);

  // Ordena do mais antigo para o mais recente para calcular o saldo acumulado
  // (já convertido para a moeda principal), depois inverte para exibir do mais
  // recente para o mais antigo.
  const rowsWithRunningBalance = useMemo(() => {
    const sortedAsc = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.createdAt) - new Date(b.createdAt));
    let running = 0;
    const withBalance = sortedAsc.map((tx) => {
      const convertedAmount = convertToPrimary(tx);
      running += tx.type === 'income' ? convertedAmount : -convertedAmount;
      return { ...tx, runningBalance: running };
    });
    return withBalance.reverse();
  }, [transactions, primaryCurrency, exchangeRate]);

  const filteredRows = useMemo(() => {
    if (filter === 'all') return rowsWithRunningBalance;
    return rowsWithRunningBalance.filter((tx) => tx.type === filter);
  }, [rowsWithRunningBalance, filter]);

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    transactions.forEach((tx) => {
      const converted = convertToPrimary(tx);
      if (tx.type === 'income') income += converted;
      else expense += converted;
    });
    return { income, expense, balance: income - expense };
  }, [transactions, primaryCurrency, exchangeRate]);

  const handleDelete = async () => {
    if (deleteModal.id) await db.financeTransactions.delete(deleteModal.id);
    setDeleteModal({ open: false, id: null });
  };

  return (
    <div className="w-full pt-8 animate-fade-in pb-24 px-4 -mt-5 -mb-20 min-h-screen">
      <BackButton to="/finance" label={t('finance.title', 'Finanças')} />

      <div className="flex items-center gap-3 mb-6 -mt-3">
        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
          <FileSpreadsheet size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{t('finance.statementTitle', 'Planilha / Extrato')}</h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
            {t('finance.statementSubtitle', 'Todos os lançamentos')} • {t('finance.convertedTo', 'convertido para')} {primaryCurrency}
          </p>
        </div>
      </div>

      {/* RESUMO FIXO */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-3 text-center">
          <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">{t('finance.income', 'Receitas')}</p>
          <p className="text-sm font-black text-green-400">{formatCurrencyValue(totals.income, primaryCurrency)}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-3 text-center">
          <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">{t('finance.expense', 'Gastos')}</p>
          <p className="text-sm font-black text-red-400">{formatCurrencyValue(totals.expense, primaryCurrency)}</p>
        </div>
        <div className={`rounded-2xl border p-3 text-center ${totals.balance >= 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">{t('finance.balance', 'Saldo')}</p>
          <p className={`text-sm font-black ${totals.balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrencyValue(totals.balance, primaryCurrency)}</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'all', label: t('finance.filterAll', 'Todos') },
          { id: 'income', label: t('finance.filterIncome', 'Receitas') },
          { id: 'expense', label: t('finance.filterExpense', 'Gastos') },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
              filter === f.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABELA/LISTA */}
      <div className="space-y-2">
        {filteredRows.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 text-center text-gray-500 text-sm">
            {t('finance.noTransactions', 'Nenhuma transação registrada ainda.')}
          </div>
        ) : (
          filteredRows.map((tx) => {
            const txCurrency = tx.currency || 'BRL';
            const showsConverted = txCurrency !== primaryCurrency;
            return (
              <div key={tx.id} className="bg-gray-800 rounded-2xl border border-gray-700 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {tx.type === 'income'
                      ? <ArrowUpCircle size={16} className="text-green-400 shrink-0" />
                      : <ArrowDownCircle size={16} className="text-red-400 shrink-0" />
                    }
                    <span className="text-sm font-bold text-white truncate">{tx.description || tx.category}</span>
                  </div>
                  <button onClick={() => setDeleteModal({ open: true, id: tx.id })} className="p-1.5 text-gray-500 hover:text-red-400 shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold">{tx.category} • {tx.date.split('-').reverse().join('/')} • {txCurrency}</span>
                  <span className={`font-black ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrencyValue(tx.amount, txCurrency)}
                    {showsConverted && (
                      <span className="text-[10px] text-gray-500 font-normal ml-1">
                        (~{formatCurrencyValue(convertToPrimary(tx), primaryCurrency)})
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-700/60 flex justify-between items-center">
                  <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{t('finance.balanceAfter', 'Saldo acumulado')} ({primaryCurrency})</span>
                  <span className={`text-xs font-black ${tx.runningBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatCurrencyValue(tx.runningBalance, primaryCurrency)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="shrink-0 mt-8">
        <FooterBrand direction="flex-col" textSize="text-xs" textColor="text-white-400" />
      </div>

      {deleteModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('finance.deleteConfirmTitle', 'Excluir esta transação?')}</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">{t('calendar.deleteConfirmDesc', 'Essa ação não pode ser desfeita.')}</p>
            <div className="flex w-full gap-3">
              <button onClick={() => setDeleteModal({ open: false, id: null })} className="flex-1 py-3.5 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors">
                {t('cancel', 'Cancelar')}
              </button>
              <button onClick={handleDelete} className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors">
                {t('confirm', 'Confirmar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}