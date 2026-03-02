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

function parseNum(s: string): number {
  return Math.max(0, parseFloat(String(s).replace(/\s/g, '').replace(',', '.')) || 0);
}

export function CreditSimulator() {
  const { t } = useTranslation();
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

  const solved = useMemo(() => {
    if (unknownField === 'amount' && rateNum > 0 && durationNum > 0 && totalCostNum >= 0) {
      const k = totalCostNum / ((rateNum / 100) * durationNum);
      return { amount: k, rate: rateNum, duration: durationNum, totalCost: totalCostNum };
    }
    if (unknownField === 'rate' && amountNum > 0 && durationNum > 0 && totalCostNum >= 0) {
      const r = (totalCostNum / (amountNum * durationNum)) * 100;
      return { amount: amountNum, rate: r, duration: durationNum, totalCost: totalCostNum };
    }
    if (unknownField === 'duration' && amountNum > 0 && rateNum > 0 && totalCostNum >= 0) {
      const n = totalCostNum / (amountNum * (rateNum / 100));
      return { amount: amountNum, rate: rateNum, duration: n, totalCost: totalCostNum };
    }
    if (unknownField === 'totalCost' && amountNum > 0 && rateNum >= 0 && durationNum > 0) {
      const cost = amountNum * (rateNum / 100) * durationNum;
      return { amount: amountNum, rate: rateNum, duration: durationNum, totalCost: cost };
    }
    return null;
  }, [unknownField, amountNum, rateNum, durationNum, totalCostNum]);

  const inFineAmount = solved ? solved.amount + solved.totalCost : 0;
  const hasResult = solved !== null && solved.duration > 0;

  const chartData = useMemo(() => {
    if (!solved || solved.duration <= 0) return [];
    const rows: { name: string; interest: number; principal: number }[] = [];
    const annualInterest = solved.amount * (solved.rate / 100);
    const n = Math.floor(solved.duration);
    for (let y = 1; y <= n; y++) {
      rows.push({
        name: t('credit.yearLabel', { year: y }),
        interest: Math.round(annualInterest * 100) / 100,
        principal: 0,
      });
    }
    if (solved.duration >= 1) {
      rows[rows.length - 1].principal = Math.round(solved.amount * 100) / 100;
    } else {
      rows.push({
        name: t('credit.yearLabel', { year: 1 }),
        interest: Math.round((solved.amount * (solved.rate / 100) * solved.duration) * 100) / 100,
        principal: Math.round(solved.amount * 100) / 100,
      });
    }
    return rows;
  }, [solved, t]);

  const handleSolve = (field: UnknownField) => {
    if (!field) return;
    setUnknownField(field);
    if (field === 'amount' && rateNum > 0 && durationNum > 0 && totalCostNum >= 0) {
      const k = totalCostNum / ((rateNum / 100) * durationNum);
      setAmount(k.toLocaleString('fr-FR', { maximumFractionDigits: 0 }));
    }
    if (field === 'rate' && amountNum > 0 && durationNum > 0 && totalCostNum >= 0) {
      const r = (totalCostNum / (amountNum * durationNum)) * 100;
      setRate(r.toFixed(2));
    }
    if (field === 'duration' && amountNum > 0 && rateNum > 0 && totalCostNum >= 0) {
      const n = totalCostNum / (amountNum * (rateNum / 100));
      setDuration(n.toFixed(2));
    }
    if (field === 'totalCost' && amountNum > 0 && rateNum >= 0 && durationNum > 0) {
      const cost = amountNum * (rateNum / 100) * durationNum;
      setTotalCost(cost.toLocaleString('fr-FR', { maximumFractionDigits: 0 }));
    }
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
                <div className="flex gap-2">
                  <div className="relative flex-1">
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
                  <button
                    type="button"
                    onClick={() => handleSolve(key)}
                    className="shrink-0 px-5 py-4 rounded-2xl bg-[#0A2F73] text-white font-black text-sm hover:bg-[#E64501] transition-all uppercase tracking-wider"
                    title={t('credit.calcButtonTitle')}
                  >
                    {t('credit.calc')}
                  </button>
                </div>
              </div>
            ))}
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
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/20">
                    <span className="text-[#E64501] font-black">{t('credit.inFineAmount')}</span>
                    <span className="font-black text-[#E64501] text-xl">
                      {inFineAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}
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
