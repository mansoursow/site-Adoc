import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, BarChart3 } from 'lucide-react';
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
                placeholder: 'Ex: 5000000',
                suffix: currency,
              },
              {
                key: 'rate' as const,
                label: t('credit.rate'),
                value: rate,
                setValue: setRate,
                placeholder: 'Ex: 5,5',
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
                placeholder: '0',
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

              <div>
                <button
                  type="button"
                  onClick={() => setShowChart((v) => !v)}
                  className="inline-flex items-center gap-2 bg-[#3F5F99] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0A2F73] transition-all shadow"
                >
                  <BarChart3 size={20} />
                  {showChart ? t('credit.hideChart') : t('credit.showChart')}
                </button>
              </div>

              {showChart && chartData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"
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
