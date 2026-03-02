import { useState } from 'react';
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

export interface ScheduleRow {
  month: number;
  yearLabel: string;
  outstanding: number;
  principal: number;
  interest: number;
  insurance: number;
  total: number;
}

export interface TEGTAEGResult {
  taeg: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  totalInsurance: number;
  schedule: ScheduleRow[];
}

function buildSchedule(
  amount: number,
  totalMonths: number,
  annualRate: number,
  insuranceRate: number,
  fees: number
): { schedule: ScheduleRow[]; totalPaid: number; totalInterest: number; totalInsurance: number } {
  const r = annualRate / 100 / 12;
  const iIns = insuranceRate / 100 / 12;
  const pmt = amount * (r * Math.pow(1 + r, totalMonths)) / (Math.pow(1 + r, totalMonths) - 1);
  const schedule: ScheduleRow[] = [];
  let outstanding = amount;
  let totalInterest = 0;
  let totalInsurance = 0;
  for (let k = 1; k <= totalMonths; k++) {
    const interest = outstanding * r;
    const principal = pmt - interest;
    const insurance = outstanding * iIns;
    const total = pmt + insurance;
    outstanding = Math.max(0, outstanding - principal);
    totalInterest += interest;
    totalInsurance += insurance;
    const yearNum = Math.ceil(k / 12);
    schedule.push({
      month: k,
      yearLabel: `Année ${yearNum}`,
      outstanding: Math.round(outstanding * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      insurance: Math.round(insurance * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  }
  return {
    schedule,
    totalPaid: totalInterest + amount + totalInsurance,
    totalInterest,
    totalInsurance,
  };
}

function solveTAEG(
  netReceived: number,
  schedule: ScheduleRow[],
  maxIter = 50
): number {
  let low = 0.00001;
  let high = 0.5;
  for (let iter = 0; iter < maxIter; iter++) {
    const r = (low + high) / 2;
    let npv = 0;
    for (let k = 0; k < schedule.length; k++) {
      npv += schedule[k].total / Math.pow(1 + r, k + 1);
    }
    if (Math.abs(npv - netReceived) < 1) break;
    if (npv > netReceived) low = r;
    else high = r;
  }
  const rMonthly = (low + high) / 2;
  return (Math.pow(1 + rMonthly, 12) - 1) * 100;
}

export function TEGTAEGSimulator() {
  const { t } = useTranslation();
  const [calcType, setCalcType] = useState<'TAEG' | 'TEG'>('TAEG');
  const [amount, setAmount] = useState<string>('');
  const [years, setYears] = useState<string>('10');
  const [months, setMonths] = useState<string>('0');
  const [annualRate, setAnnualRate] = useState<string>('4');
  const [insuranceRate, setInsuranceRate] = useState<string>('0.3');
  const [fees, setFees] = useState<string>('0');
  const [result, setResult] = useState<TEGTAEGResult | null>(null);
  const [showChart, setShowChart] = useState(false);

  const amountNum = parseFloat(amount.replace(/\s/g, '').replace(',', '.')) || 0;
  const yearsNum = Math.max(0, parseInt(years, 10) || 0);
  const monthsNum = Math.max(0, Math.min(11, parseInt(months, 10) || 0));
  const totalMonths = yearsNum * 12 + monthsNum;
  const annualRateNum = Math.max(0, parseFloat(annualRate.replace(',', '.')) || 0);
  const insuranceRateNum = Math.max(0, parseFloat(insuranceRate.replace(',', '.')) || 0);
  const feesNum = Math.max(0, parseFloat(fees.replace(/\s/g, '').replace(',', '.')) || 0);

  const handleCalculate = () => {
    if (amountNum <= 0 || totalMonths <= 0) {
      setResult(null);
      return;
    }
    const { schedule, totalPaid, totalInterest, totalInsurance } = buildSchedule(
      amountNum,
      totalMonths,
      annualRateNum,
      insuranceRateNum,
      feesNum
    );
    const netReceived = amountNum - feesNum;
    const taeg = solveTAEG(netReceived, schedule);
    const monthlyPayment = schedule[0]?.total ?? 0;
    setResult({
      taeg,
      monthlyPayment,
      totalPaid,
      totalInterest,
      totalInsurance,
      schedule,
    });
    setShowChart(false);
  };

  // Agrégation par année pour le graphique (une barre par année)
  const chartDataByYear = (() => {
    if (!result) return [];
    const map: Record<number, { principal: number; interest: number; insurance: number }> = {};
    result.schedule.forEach((r) => {
      const y = Math.ceil(r.month / 12);
      if (!map[y]) map[y] = { principal: 0, interest: 0, insurance: 0 };
      map[y].principal += r.principal;
      map[y].interest += r.interest;
      map[y].insurance += r.insurance;
    });
    return Object.entries(map).map(([y, v]) => ({
      name: t('tegtaeg.yearLabel', { year: Number(y) }),
      principal: Math.round(v.principal * 100) / 100,
      interest: Math.round(v.interest * 100) / 100,
      insurance: Math.round(v.insurance * 100) / 100,
    }));
  })();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="text-[#0A2F73]" size={24} />
            <h3 className="text-xl font-black text-[#0A2F73]">{t('tegtaeg.title')}</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('tegtaeg.calcType')}
              </label>
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setCalcType('TAEG')}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${calcType === 'TAEG' ? 'bg-[#0A2F73] text-white shadow' : 'text-gray-500'}`}
                >
                  TAEG
                </button>
                <button
                  type="button"
                  onClick={() => setCalcType('TEG')}
                  className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${calcType === 'TEG' ? 'bg-[#0A2F73] text-white shadow' : 'text-gray-500'}`}
                >
                  TEG
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('tegtaeg.loanAmount')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 200000"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-black text-xl outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{t('tegtaeg.currency')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  {t('tegtaeg.durationYears')}
                </label>
                <input
                  type="number"
                  min={0}
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">{t('tegtaeg.years')}</p>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  {t('tegtaeg.durationMonths')}
                </label>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">{t('tegtaeg.months')}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('tegtaeg.annualRate')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  placeholder="4"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('tegtaeg.insuranceRate')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={insuranceRate}
                  onChange={(e) => setInsuranceRate(e.target.value)}
                  placeholder="0.3"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('tegtaeg.fees')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{t('tegtaeg.currency')}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-[#0A2F73] text-white py-5 rounded-2xl font-black hover:bg-[#E64501] transition-all shadow-lg uppercase tracking-widest text-sm"
            >
              {t('tegtaeg.calculate')}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {result && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A2F73] p-8 rounded-[2.5rem] text-white shadow-2xl"
              >
                <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">
                  {calcType} {t('tegtaeg.resultRate')}
                </div>
                <div className="text-4xl font-black text-[#E64501]">
                  {result.taeg.toFixed(2)} %
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">{t('tegtaeg.monthlyPayment')}</span>
                    <p className="font-black">{result.monthlyPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {t('tegtaeg.currency')}</p>
                  </div>
                  <div>
                    <span className="text-white/60">{t('tegtaeg.totalCost')}</span>
                    <p className="font-black">{result.totalPaid.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {t('tegtaeg.currency')}</p>
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
                  {showChart ? t('tegtaeg.hideChart') : t('tegtaeg.showChart')}
                </button>
              </div>

              {showChart && chartDataByYear.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"
                >
                  <h4 className="font-black text-[#0A2F73] mb-4">{t('tegtaeg.chartTitle')}</h4>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#0A2F73' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#0A2F73' }} tickFormatter={(v) => v.toLocaleString('fr-FR')} />
                        <Tooltip formatter={(v: number) => v.toLocaleString('fr-FR')} contentStyle={{ borderRadius: 12 }} />
                        <Legend />
                        <Bar dataKey="principal" stackId="a" fill="#0A2F73" radius={[0, 0, 0, 0]} name={t('tegtaeg.colPrincipal')} />
                        <Bar dataKey="interest" stackId="a" fill="#E64501" radius={[0, 0, 0, 0]} name={t('tegtaeg.colInterest')} />
                        <Bar dataKey="insurance" stackId="a" fill="#3F5F99" radius={[0, 0, 0, 0]} name={t('tegtaeg.colInsurance')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {!result && (
            <div className="h-64 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
              <Calculator size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm font-bold">{t('tegtaeg.waiting')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
