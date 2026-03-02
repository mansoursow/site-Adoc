import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface AmortissementRow {
  year: number;
  label: string;
  depreciation: number;
  cumulative: number;
  netValue: number;
}

function computeLinear(amount: number, duration: number): AmortissementRow[] {
  const annual = amount / duration;
  const rows: AmortissementRow[] = [];
  let cumulative = 0;
  let netValue = amount;
  for (let y = 1; y <= duration; y++) {
    const dep = y === duration ? amount - cumulative : Math.round(annual * 100) / 100;
    cumulative += dep;
    netValue = amount - cumulative;
    rows.push({
      year: y,
      label: String(y),
      depreciation: Math.round(dep * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
      netValue: Math.round(Math.max(0, netValue) * 100) / 100,
    });
  }
  return rows;
}

function computeDegressif(amount: number, duration: number): AmortissementRow[] {
  const coeff = duration <= 4 ? 2.25 : duration <= 6 ? 1.75 : 1.25;
  const rate = coeff / duration;
  const rows: AmortissementRow[] = [];
  let netValue = amount;
  let cumulative = 0;
  for (let y = 1; y <= duration; y++) {
    const isLast = y === duration;
    const dep = isLast ? netValue : Math.round(netValue * rate * 100) / 100;
    cumulative += dep;
    netValue = amount - cumulative;
    rows.push({
      year: y,
      label: String(y),
      depreciation: Math.round(dep * 100) / 100,
      cumulative: Math.round(cumulative * 100) / 100,
      netValue: Math.round(Math.max(0, netValue) * 100) / 100,
    });
  }
  return rows;
}

export function AmortissementSimulator() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'lineaire' | 'degressif'>('lineaire');
  const [dateStr, setDateStr] = useState<string>('');
  const [duration, setDuration] = useState<string>('5');
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<AmortissementRow[] | null>(null);
  const [showChart, setShowChart] = useState(false);

  const durationNum = Math.min(30, Math.max(3, parseInt(duration, 10) || 3));
  const amountNum = parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;

  const handleCalculate = () => {
    if (amountNum <= 0) {
      setResult(null);
      return;
    }
    const rows = mode === 'lineaire'
      ? computeLinear(amountNum, durationNum)
      : computeDegressif(amountNum, durationNum);
    setResult(rows);
    setShowChart(false);
  };

  const chartData = result ? result.map((r) => ({
    name: t('amortissement.yearLabel', { year: r.year }),
    depreciation: r.depreciation,
    netValue: r.netValue,
  })) : [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Formulaire */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="text-[#0A2F73]" size={24} />
            <h3 className="text-xl font-black text-[#0A2F73]">{t('amortissement.title')}</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('amortissement.depreciationType')}
              </label>
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMode('lineaire')}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${mode === 'lineaire' ? 'bg-[#0A2F73] text-white shadow' : 'text-gray-500'}`}
                >
                  {t('amortissement.linear')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('degressif')}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${mode === 'degressif' ? 'bg-[#0A2F73] text-white shadow' : 'text-gray-500'}`}
                >
                  {t('amortissement.degressive')}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('amortissement.purchaseDate')}
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
              />
              <p className="text-[10px] text-gray-400 mt-1">{t('amortissement.dateFormat')}</p>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('amortissement.duration')}
              </label>
              <input
                type="number"
                min={3}
                max={30}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('amortissement.amount')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 100000"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-black text-xl outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{t('amortissement.currency')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-[#0A2F73] text-white py-5 rounded-2xl font-black hover:bg-[#E64501] transition-all shadow-lg uppercase tracking-widest text-sm"
            >
              {t('amortissement.calculate')}
            </button>
          </div>
        </div>

        {/* Résultats + Diagramme */}
        <div className="space-y-6">
          {result && result.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg overflow-x-auto"
              >
                <h4 className="font-black text-[#0A2F73] mb-4">{t('amortissement.tableTitle')}</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-[10px] font-black uppercase text-gray-500">
                      <th className="pb-2 pr-4">{t('amortissement.colYear')}</th>
                      <th className="pb-2 pr-4">{t('amortissement.colDepreciation')}</th>
                      <th className="pb-2 pr-4">{t('amortissement.colCumulative')}</th>
                      <th className="pb-2">{t('amortissement.colNetValue')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((row) => (
                      <tr key={row.year} className="border-b border-gray-50">
                        <td className="py-2 pr-4 font-bold text-[#0A2F73]">{t('amortissement.yearLabel', { year: row.year })}</td>
                        <td className="py-2 pr-4">{row.depreciation.toLocaleString('fr-FR')} {t('amortissement.currency')}</td>
                        <td className="py-2 pr-4">{row.cumulative.toLocaleString('fr-FR')} {t('amortissement.currency')}</td>
                        <td className="py-2">{row.netValue.toLocaleString('fr-FR')} {t('amortissement.currency')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowChart((v) => !v)}
                  className="inline-flex items-center gap-2 bg-[#3F5F99] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0A2F73] transition-all shadow"
                >
                  <BarChart3 size={20} />
                  {showChart ? t('amortissement.hideChart') : t('amortissement.showChart')}
                </button>
              </div>

              {showChart && chartData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"
                >
                  <h4 className="font-black text-[#0A2F73] mb-4">{t('amortissement.chartTitle')}</h4>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#0A2F73' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#0A2F73' }} tickFormatter={(v) => v.toLocaleString('fr-FR')} />
                        <Tooltip formatter={(v: number) => v.toLocaleString('fr-FR')} contentStyle={{ borderRadius: 12 }} />
                        <Legend />
                        <Bar dataKey="depreciation" fill="#0A2F73" radius={[4, 4, 0, 0]} name={t('amortissement.colDepreciation')} />
                        <Bar dataKey="netValue" fill="#E64501" radius={[4, 4, 0, 0]} name={t('amortissement.colNetValue')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {(!result || result.length === 0) && (
            <div className="h-64 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
              <Calculator size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm font-bold">{t('amortissement.waiting')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
