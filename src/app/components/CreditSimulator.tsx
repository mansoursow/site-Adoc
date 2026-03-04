import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, BarChart3, Table2, ChevronDown, ChevronRight, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type UnknownField = 'amount' | 'rate' | 'duration' | 'totalCost' | null;
type CreditMode = 'inFine' | 'annuiteConstante' | 'amortissementConstant';
type SolvedValues = { amount: number; rate: number; duration: number; totalCost: number };

type MonthlyRow = { monthIndex: number; year: number; monthInYear: number; principal: number; interest: number; payment: number; remaining: number };
type YearlyRow = { year: number; totalPrincipal: number; totalInterest: number; totalPayment: number; remainingEnd: number; monthlyRows: MonthlyRow[] };

function parseNum(s: string): number {
  return Math.max(0, parseFloat(String(s).replace(/\s/g, '').replace(',', '.')) || 0);
}

function annuityFactor(rate: number, duration: number): number {
  if (duration <= 0) return 0;
  if (rate <= 0) return 0;
  return (duration * rate) / (1 - Math.pow(1 + rate, -duration)) - 1;
}

function totalCostByMode(mode: CreditMode, amount: number, ratePct: number, duration: number): number {
  const r = ratePct / 100;
  if (amount <= 0 || duration <= 0 || r < 0) return 0;
  if (mode === 'inFine') return amount * r * duration;
  if (mode === 'annuiteConstante') {
    const factor = annuityFactor(r, duration);
    return amount * factor;
  }
  return amount * r * duration * (duration + 1) / 2;
}

function solveRateAnnuity(targetRatio: number, duration: number): number | null {
  if (duration <= 0 || targetRatio < 0) return null;
  if (targetRatio === 0) return 0;
  let lo = 0;
  let hi = 1;
  const f = (r: number) => annuityFactor(r, duration);
  while (f(hi) < targetRatio && hi < 100) hi *= 2;
  if (f(hi) < targetRatio) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < targetRatio) lo = mid;
    else hi = mid;
  }
  return ((lo + hi) / 2) * 100;
}

function solveDurationAnnuity(targetRatio: number, ratePct: number): number | null {
  const r = ratePct / 100;
  if (r <= 0 || targetRatio < 0) return null;
  if (targetRatio === 0) return 0;
  let lo = 0.1;
  let hi = 100;
  const f = (n: number) => annuityFactor(r, n);
  if (f(hi) < targetRatio) return null;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < targetRatio) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function buildMonthlySchedule(
  mode: CreditMode,
  amount: number,
  ratePct: number,
  durationYears: number
): YearlyRow[] {
  const nMonths = Math.max(1, Math.round(durationYears * 12));
  const r = ratePct / 100 / 12;
  const rows: MonthlyRow[] = [];

  if (mode === 'inFine') {
    for (let m = 0; m < nMonths; m++) {
      const interest = amount * r;
      const principal = m === nMonths - 1 ? amount : 0;
      const payment = interest + principal;
      const remaining = m === nMonths - 1 ? 0 : amount;
      rows.push({
        monthIndex: m + 1,
        year: Math.floor(m / 12) + 1,
        monthInYear: (m % 12) + 1,
        principal,
        interest,
        payment,
        remaining,
      });
    }
  } else if (mode === 'annuiteConstante') {
    const mensualite = r <= 0 ? amount / nMonths : amount * (r / (1 - Math.pow(1 + r, -nMonths)));
    let remaining = amount;
    for (let m = 0; m < nMonths; m++) {
      const interest = remaining * r;
      let principal = mensualite - interest;
      if (m === nMonths - 1) principal = remaining;
      remaining = Math.max(0, remaining - principal);
      rows.push({
        monthIndex: m + 1,
        year: Math.floor(m / 12) + 1,
        monthInYear: (m % 12) + 1,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        payment: Math.round((principal + interest) * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
      });
    }
  } else {
    const principalConst = amount / nMonths;
    let remaining = amount;
    for (let m = 0; m < nMonths; m++) {
      const interest = remaining * r;
      const principal = m === nMonths - 1 ? remaining : principalConst;
      remaining = Math.max(0, remaining - principal);
      rows.push({
        monthIndex: m + 1,
        year: Math.floor(m / 12) + 1,
        monthInYear: (m % 12) + 1,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        payment: Math.round((principal + interest) * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
      });
    }
  }

  const byYear = new Map<number, MonthlyRow[]>();
  rows.forEach((row) => {
    const arr = byYear.get(row.year) ?? [];
    arr.push(row);
    byYear.set(row.year, arr);
  });

  return Array.from(byYear.entries()).map(([year, monthlyRows]) => {
    const totalPrincipal = monthlyRows.reduce((s, r) => s + r.principal, 0);
    const totalInterest = monthlyRows.reduce((s, r) => s + r.interest, 0);
    const totalPayment = monthlyRows.reduce((s, r) => s + r.payment, 0);
    const remainingEnd = monthlyRows[monthlyRows.length - 1]?.remaining ?? 0;
    return {
      year,
      totalPrincipal: Math.round(totalPrincipal * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      remainingEnd,
      monthlyRows,
    };
  });
}

export function CreditSimulator() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<CreditMode>('inFine');
  const [loanDate, setLoanDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [duration, setDuration] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [unknownField, setUnknownField] = useState<UnknownField>(null);
  const [showChart, setShowChart] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const amountNum = parseNum(amount);
  const rateNum = parseNum(rate);
  const durationNum = parseNum(duration);
  const totalCostNum = parseNum(totalCost);

  const missingFields = useMemo<UnknownField[]>(() => {
    const missing: UnknownField[] = [];
    if (!amount.trim()) missing.push('amount');
    if (!rate.trim()) missing.push('rate');
    if (!duration.trim()) missing.push('duration');
    if (!totalCost.trim()) missing.push('totalCost');
    return missing;
  }, [amount, rate, duration, totalCost]);

  const solveForField = (
    field: UnknownField,
    modeValue: CreditMode,
    a: number,
    rPct: number,
    d: number,
    c: number
  ): SolvedValues | null => {
    if (!field) return null;
    const r = rPct / 100;

    if (field === 'totalCost') {
      if (a > 0 && d > 0 && r >= 0) {
        return { amount: a, rate: rPct, duration: d, totalCost: totalCostByMode(modeValue, a, rPct, d) };
      }
      return null;
    }

    if (field === 'amount') {
      if (d <= 0 || c < 0) return null;
      if (modeValue === 'inFine') {
        const denom = r * d;
        if (denom <= 0) return null;
        const k = c / denom;
        return { amount: k, rate: rPct, duration: d, totalCost: c };
      }
      if (modeValue === 'annuiteConstante') {
        const factor = annuityFactor(r, d);
        if (factor <= 0) return null;
        const k = c / factor;
        return { amount: k, rate: rPct, duration: d, totalCost: c };
      }
      const denom = r * d * (d + 1) / 2;
      if (denom <= 0) return null;
      const k = c / denom;
      return { amount: k, rate: rPct, duration: d, totalCost: c };
    }

    if (field === 'rate') {
      if (a <= 0 || d <= 0 || c < 0) return null;
      if (modeValue === 'inFine') {
        const rSolved = (c / (a * d)) * 100;
        return { amount: a, rate: rSolved, duration: d, totalCost: c };
      }
      if (modeValue === 'annuiteConstante') {
        const ratio = c / a;
        const rSolved = solveRateAnnuity(ratio, d);
        if (rSolved === null) return null;
        return { amount: a, rate: rSolved, duration: d, totalCost: c };
      }
      const denom = a * d * (d + 1) / 2;
      if (denom <= 0) return null;
      const rSolved = (c / denom) * 100;
      return { amount: a, rate: rSolved, duration: d, totalCost: c };
    }

    if (field === 'duration') {
      if (a <= 0 || c < 0 || r <= 0) return null;
      if (modeValue === 'inFine') {
        const n = c / (a * r);
        return n > 0 ? { amount: a, rate: rPct, duration: n, totalCost: c } : null;
      }
      if (modeValue === 'annuiteConstante') {
        const ratio = c / a;
        const n = solveDurationAnnuity(ratio, rPct);
        if (n === null || n <= 0) return null;
        return { amount: a, rate: rPct, duration: n, totalCost: c };
      }
      const x = (2 * c) / (a * r);
      const disc = 1 + 4 * x;
      if (disc < 0) return null;
      const n = (-1 + Math.sqrt(disc)) / 2;
      return n > 0 ? { amount: a, rate: rPct, duration: n, totalCost: c } : null;
    }

    return null;
  };

  const solved = useMemo(() => {
    return solveForField(unknownField, mode, amountNum, rateNum, durationNum, totalCostNum);
  }, [unknownField, mode, amountNum, rateNum, durationNum, totalCostNum]);

  const totalRepayment = solved ? solved.amount + solved.totalCost : 0;
  const hasResult = solved !== null && solved.duration > 0;
  const periodicPayment = useMemo(() => {
    if (!solved || mode !== 'annuiteConstante') return 0;
    const r = solved.rate / 100;
    if (r <= 0) return solved.amount / solved.duration;
    return solved.amount * (r / (1 - Math.pow(1 + r, -solved.duration)));
  }, [solved, mode]);
  const firstPayment = useMemo(() => {
    if (!solved || mode !== 'amortissementConstant') return 0;
    const n = solved.duration;
    if (n <= 0) return 0;
    return solved.amount / n + solved.amount * (solved.rate / 100);
  }, [solved, mode]);

  const chartData = useMemo(() => {
    if (!solved || solved.duration <= 0) return [];
    const rows: { name: string; interest: number; principal: number }[] = [];
    const n = Math.max(1, Math.round(solved.duration));
    const r = solved.rate / 100;

    if (mode === 'inFine') {
      const annualInterest = solved.amount * r;
      for (let y = 1; y <= n; y++) {
        rows.push({
          name: t('credit.yearLabel', { year: y }),
          interest: Math.round(annualInterest * 100) / 100,
          principal: y === n ? Math.round(solved.amount * 100) / 100 : 0,
        });
      }
      return rows;
    }

    if (mode === 'annuiteConstante') {
      let remaining = solved.amount;
      const annuity = r <= 0
        ? solved.amount / n
        : solved.amount * (r / (1 - Math.pow(1 + r, -n)));
      for (let y = 1; y <= n; y++) {
        const interest = remaining * r;
        let principal = annuity - interest;
        if (y === n) principal = remaining;
        remaining = Math.max(0, remaining - principal);
        rows.push({
          name: t('credit.yearLabel', { year: y }),
          interest: Math.round(interest * 100) / 100,
          principal: Math.round(principal * 100) / 100,
        });
      }
      return rows;
    }

    let remaining = solved.amount;
    const principalConst = solved.amount / n;
    for (let y = 1; y <= n; y++) {
      const interest = remaining * r;
      const principal = y === n ? remaining : principalConst;
      remaining = Math.max(0, remaining - principal);
      rows.push({
        name: t('credit.yearLabel', { year: y }),
        interest: Math.round(interest * 100) / 100,
        principal: Math.round(principal * 100) / 100,
      });
    }
    return rows;
  }, [solved, t, mode]);

  const amortizationTable = useMemo(() => {
    if (!solved || solved.duration <= 0) return [];
    return buildMonthlySchedule(mode, solved.amount, solved.rate, solved.duration);
  }, [solved, mode]);

  const handleExportExcel = () => {
    if (!solved || !amortizationTable.length) return;
    const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
    const allMonthlyRows = amortizationTable.flatMap((yr) => yr.monthlyRows);

    const monthlyData = [
      [t('credit.tableTitle'), '', '', '', '', ''],
      [t('credit.loanDate'), formatDate(loanDate), '', '', '', ''],
      ['', '', '', '', '', ''],
      [t('credit.colYear'), t('credit.colMonth'), t('credit.colMensualite'), t('credit.colPrincipal'), t('credit.colInterest'), t('credit.colRemaining')],
      ...allMonthlyRows.map((r) => [
        t('credit.yearLabel', { year: r.year }),
        t('credit.monthLabel', { month: r.monthInYear }),
        fmt(r.payment),
        fmt(r.principal),
        fmt(r.interest),
        fmt(r.remaining),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(monthlyData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('credit.sheetMonthly'));
    const fileName = `tableau-amortissement-${loanDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleSolve = () => {
    const field = missingFields.length === 1 ? missingFields[0] : unknownField;
    if (!field) return;
    const solvedNow = solveForField(field, mode, amountNum, rateNum, durationNum, totalCostNum);
    if (!solvedNow) return;
    setUnknownField(field);
    if (field === 'amount') setAmount(solvedNow.amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 }));
    if (field === 'rate') setRate(solvedNow.rate.toFixed(2));
    if (field === 'duration') setDuration(solvedNow.duration.toFixed(2));
    if (field === 'totalCost') setTotalCost(solvedNow.totalCost.toLocaleString('fr-FR', { maximumFractionDigits: 0 }));
  };

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const currency = t('credit.currency');

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="text-[#0A2F73]" size={24} />
            <h3 className="text-xl font-black text-[#0A2F73]">{t('credit.title')}</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">{t('credit.hint')}</p>
          <div className="mb-5">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              {t('credit.modeLabel')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { value: 'inFine' as const, label: t('credit.modeInFine') },
                { value: 'annuiteConstante' as const, label: t('credit.modeAnnuity') },
                { value: 'amortissementConstant' as const, label: t('credit.modeConstantAmort') },
              ].map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => {
                    setMode(m.value);
                    setUnknownField(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wide border transition-all ${
                    mode === m.value
                      ? 'bg-[#0A2F73] text-white border-[#0A2F73]'
                      : 'bg-white text-[#0A2F73] border-slate-200 hover:border-[#0A2F73]/40'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('credit.loanDate')}
              </label>
              <input
                type="date"
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
              />
              <p className="text-[10px] text-gray-400 mt-1">{t('credit.dateFormat')}</p>
            </div>

            {[
              {
                key: 'amount' as const,
                label: t('credit.amount'),
                value: amount,
                setValue: setAmount,
                placeholder: t('credit.placeholderAmount'),
                suffix: currency,
              },
              {
                key: 'rate' as const,
                label: t('credit.rate'),
                value: rate,
                setValue: setRate,
                placeholder: t('credit.placeholderRate'),
                suffix: '%',
              },
              {
                key: 'duration' as const,
                label: t('credit.duration'),
                value: duration,
                setValue: setDuration,
                placeholder: 'Ex: 5',
                suffix: t('credit.years'),
              },
              {
                key: 'totalCost' as const,
                label: t('credit.totalCost'),
                value: totalCost,
                setValue: setTotalCost,
                placeholder: t('credit.placeholderZero'),
                suffix: currency,
              },
            ].map(({ key, label, value, setValue, placeholder, suffix }) => (
              <div key={key}>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => { setValue(e.target.value); setUnknownField(null); }}
                    placeholder={placeholder}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">
                    {suffix}
                  </span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleSolve}
              disabled={missingFields.length !== 1}
              className="w-full px-5 py-4 rounded-2xl bg-[#0A2F73] text-white font-black text-sm hover:bg-[#E64501] transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              title={t('credit.calcButtonTitle')}
            >
              {t('credit.calc')}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {hasResult && solved && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A2F73] p-8 rounded-[2.5rem] text-white shadow-2xl"
              >
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                  {t('credit.hypotheses')}
                </div>
                <div className="text-sm text-white/70 mb-1">{t('credit.loanDate')} : {formatDate(loanDate)}</div>
                <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/60">{t('credit.amount')}</span>
                    <span className="font-black">{solved.amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/60">{t('credit.rate')}</span>
                    <span className="font-black">{solved.rate.toFixed(2)} %</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/60">{t('credit.duration')}</span>
                    <span className="font-black">{solved.duration} {t('credit.years')}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/60">{t('credit.totalCost')}</span>
                    <span className="font-black">{solved.totalCost.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-white/60">{t('credit.totalRepayment')}</span>
                    <span className="font-black">{totalRepayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}</span>
                  </div>
                  {mode === 'annuiteConstante' && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-white/60">{t('credit.periodicPayment')}</span>
                      <span className="font-black">{periodicPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}</span>
                    </div>
                  )}
                  {mode === 'amortissementConstant' && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-white/60">{t('credit.firstPayment')}</span>
                      <span className="font-black">{firstPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/20">
                    <span className="text-[#E64501] font-black">
                      {mode === 'inFine' ? t('credit.inFineAmount') : t('credit.totalRepayment')}
                    </span>
                    <span className="font-black text-[#E64501] text-xl">
                      {totalRepayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = !showChart;
                    setShowChart(next);
                    if (next) setTimeout(() => document.getElementById('credit-chart')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  className="inline-flex items-center gap-2 bg-[#3F5F99] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0A2F73] transition-all shadow"
                >
                  <BarChart3 size={20} />
                  {showChart ? t('credit.hideChart') : t('credit.showChart')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = !showTable;
                    setShowTable(next);
                    if (next) setTimeout(() => document.getElementById('credit-table')?.scrollIntoView({ behavior: 'smooth' }), 150);
                  }}
                  className="inline-flex items-center gap-2 bg-[#3F5F99] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0A2F73] transition-all shadow"
                >
                  <Table2 size={20} />
                  {showTable ? t('credit.hideTable') : t('credit.showTable')}
                </button>
                <button
                  type="button"
                  onClick={handleExportExcel}
                  disabled={!amortizationTable.length}
                  className="inline-flex items-center gap-2 bg-[#22c55e] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#16a34a] transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={20} />
                  {t('credit.downloadExcel')}
                </button>
              </div>

              {showChart && chartData.length > 0 && (
                <motion.div
                  id="credit-chart"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg scroll-mt-6"
                >
                  <h4 className="font-black text-[#0A2F73] mb-4">{t('credit.chartTitle')}</h4>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#0A2F73' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#0A2F73' }} tickFormatter={(v) => v.toLocaleString('fr-FR')} />
                        <Tooltip formatter={(v: number) => v.toLocaleString('fr-FR')} contentStyle={{ borderRadius: 12 }} />
                        <Legend />
                        <Bar dataKey="interest" stackId="a" fill="#E64501" radius={[0, 0, 0, 0]} name={t('credit.colInterest')} />
                        <Bar dataKey="principal" stackId="a" fill="#0A2F73" radius={[0, 0, 0, 0]} name={t('credit.colPrincipal')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {showTable && amortizationTable.length > 0 && (
                <motion.div
                  id="credit-table"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg overflow-x-auto scroll-mt-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-black text-[#0A2F73]">{t('credit.tableTitle')}</h4>
                      <p className="text-xs text-gray-500 mt-1">{t('credit.tableHint')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportExcel}
                      className="inline-flex items-center gap-2 bg-[#22c55e] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#16a34a] transition-all shadow text-sm"
                    >
                      <Download size={18} />
                      {t('credit.downloadExcel')}
                    </button>
                  </div>
                  <div className="min-w-[640px]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-[#0A2F73]/30">
                          <th className="text-left py-2 px-2 font-black text-[#0A2F73] w-20"></th>
                          <th className="text-right py-2 px-2 font-black text-[#0A2F73]">{t('credit.colPrincipal')}</th>
                          <th className="text-right py-2 px-2 font-black text-[#0A2F73]">{t('credit.colInterest')}</th>
                          <th className="text-right py-2 px-2 font-black text-[#0A2F73]">{t('credit.colPayment')}</th>
                          <th className="text-right py-2 px-2 font-black text-[#0A2F73]">{t('credit.colRemaining')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationTable.map((yr) => (
                          <React.Fragment key={yr.year}>
                            <tr
                              key={yr.year}
                              className="border-b border-gray-100 hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="py-2 px-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedYear(expandedYear === yr.year ? null : yr.year)}
                                  className="flex items-center gap-1 font-bold text-[#0A2F73] hover:text-[#E64501] transition-colors"
                                >
                                  {expandedYear === yr.year ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronRight size={16} />
                                  )}
                                  {t('credit.yearLabel', { year: yr.year })}
                                </button>
                              </td>
                              <td className="text-right py-2 px-2 font-bold tabular-nums">
                                {yr.totalPrincipal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                              </td>
                              <td className="text-right py-2 px-2 font-bold tabular-nums">
                                {yr.totalInterest.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                              </td>
                              <td className="text-right py-2 px-2 font-bold tabular-nums">
                                {yr.totalPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                              </td>
                              <td className="text-right py-2 px-2 font-bold tabular-nums">
                                {yr.remainingEnd.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                            <AnimatePresence>
                              {expandedYear === yr.year && (
                                <motion.tr
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-slate-50/60"
                                >
                                  <td colSpan={5} className="p-0">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                      <div className="text-[10px] font-black text-[#0A2F73]/70 uppercase tracking-wider mb-2">
                                        {t('credit.monthlyDetail')} — {t('credit.yearLabel', { year: yr.year })}
                                      </div>
                                      <table className="w-full text-xs">
                                        <thead>
                                          <tr className="border-b border-gray-200">
                                            <th className="text-left py-1 px-2 font-bold text-gray-600">{t('credit.colMonth')}</th>
                                            <th className="text-right py-1 px-2 font-bold text-gray-600">{t('credit.colMensualite')}</th>
                                            <th className="text-right py-1 px-2 font-bold text-gray-600">{t('credit.colPrincipal')}</th>
                                            <th className="text-right py-1 px-2 font-bold text-gray-600">{t('credit.colInterest')}</th>
                                            <th className="text-right py-1 px-2 font-bold text-gray-600">{t('credit.colRemaining')}</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {yr.monthlyRows.map((row) => (
                                            <tr key={row.monthIndex} className="border-b border-gray-100/80">
                                              <td className="py-1 px-2 text-gray-600">
                                                {t('credit.monthLabel', { month: row.monthInYear })}
                                              </td>
                                              <td className="text-right py-1 px-2 tabular-nums font-medium">
                                                {row.payment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                                              </td>
                                              <td className="text-right py-1 px-2 tabular-nums">
                                                {row.principal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                                              </td>
                                              <td className="text-right py-1 px-2 tabular-nums">
                                                {row.interest.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                                              </td>
                                              <td className="text-right py-1 px-2 tabular-nums">
                                                {row.remaining.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {!hasResult && (
            <div className="h-64 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
              <Calculator size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm font-bold">{t('credit.waiting')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
