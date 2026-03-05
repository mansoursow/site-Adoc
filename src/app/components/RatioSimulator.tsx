import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calculator, PieChart as PieChartIcon } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export type RatioId =
  | 'valueAdded'
  | 'tradingMargin'
  | 'operatingResult'
  | 'ebitda'
  | 'netResult'
  | 'economicRentability'
  | 'financialRentability'
  | 'clientDays'
  | 'supplierDays'
  | 'stockRotation'
  | 'autonomy'
  | 'debtRatio'
  | 'debtToEbe'
  | 'paybackCapacity'
  | 'assetTurnover';

type FormulaType = 'pct' | 'days' | 'years' | 'multiple';

interface RatioConfig {
  id: RatioId;
  category: 'rentabilite' | 'rotation' | 'structure';
  formula: FormulaType;
}

const RATIO_CONFIGS: RatioConfig[] = [
  { id: 'valueAdded', category: 'rentabilite', formula: 'pct' },
  { id: 'tradingMargin', category: 'rentabilite', formula: 'pct' },
  { id: 'operatingResult', category: 'rentabilite', formula: 'pct' },
  { id: 'ebitda', category: 'rentabilite', formula: 'pct' },
  { id: 'netResult', category: 'rentabilite', formula: 'pct' },
  { id: 'economicRentability', category: 'rentabilite', formula: 'pct' },
  { id: 'financialRentability', category: 'rentabilite', formula: 'pct' },
  { id: 'clientDays', category: 'rotation', formula: 'days' },
  { id: 'supplierDays', category: 'rotation', formula: 'days' },
  { id: 'stockRotation', category: 'rotation', formula: 'days' },
  { id: 'assetTurnover', category: 'rotation', formula: 'multiple' },
  { id: 'autonomy', category: 'structure', formula: 'pct' },
  { id: 'debtRatio', category: 'structure', formula: 'pct' },
  { id: 'debtToEbe', category: 'structure', formula: 'years' },
  { id: 'paybackCapacity', category: 'structure', formula: 'years' },
];

function parseNum(s: string): number {
  return Math.max(0, parseFloat(String(s).replace(/\s/g, '').replace(',', '.')) || 0);
}

function formatResult(value: number, formula: FormulaType, t: (k: string) => string): string {
  if (formula === 'pct') return `${value.toFixed(2)} %`;
  if (formula === 'days') return `${Math.round(value)} ${t('ratios.days')}`;
  if (formula === 'years') return `${value.toFixed(2)} ${t('ratios.years')}`;
  return `${value.toFixed(2)} ${t('ratios.times')}`;
}

export function RatioSimulator() {
  const { t } = useTranslation();
  const [selectedRatio, setSelectedRatio] = useState<RatioId>('valueAdded');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [showChart, setShowChart] = useState(true);

  const config = RATIO_CONFIGS.find((c) => c.id === selectedRatio)!;
  const a = parseNum(input1);
  const b = parseNum(input2);
  const c = parseNum(input3);

  const ratioValue = useMemo(() => {
    if (config.formula === 'pct' || config.formula === 'multiple') {
      if (b <= 0) return null;
      const v = config.formula === 'pct' ? (a / b) * 100 : a / b;
      return Math.round(v * 100) / 100;
    }
    if (config.formula === 'days') {
      if (b <= 0) return null;
      const v = (a / b) * 360;
      return Math.round(v * 10) / 10;
    }
    if (config.formula === 'years') {
      const denom = config.id === 'paybackCapacity' ? b + c : b;
      if (denom <= 0) return null;
      const v = a / denom;
      return Math.round(v * 100) / 100;
    }
    return null;
  }, [a, b, c, config]);

  const ratioLabel = t(`ratios.ratios.${selectedRatio}`);
  const description = t(`ratios.descriptions.${selectedRatio}`);
  const input1Label = t(`ratios.labels.${selectedRatio}_1`);
  const input2Label = t(`ratios.labels.${selectedRatio}_2`);
  const input3Label = t(`ratios.labels.${selectedRatio}_3`);
  const currency = t('ratios.currency');
  const needsInput3 = config.id === 'paybackCapacity';

  const chartData = useMemo(() => {
    if (config.formula !== 'pct' || b <= 0) return [];
    const num = Math.round(a * 100) / 100;
    const other = Math.round((b - a) * 100) / 100;
    return [
      { name: input1Label, value: num, fill: '#0A2F73' },
      { name: t('ratios.otherComponents'), value: Math.max(0, other), fill: '#E5E7EB' },
    ].filter((d) => d.value > 0) as { name: string; value: number; fill: string }[];
  }, [a, b, input1Label, t, config.formula]);

  const barData = useMemo(() => {
    if ((b <= 0 && a <= 0) || config.formula === 'days' || config.formula === 'years') return [];
    return [
      { name: input2Label, value: Math.round(b * 100) / 100 },
      { name: input1Label, value: Math.round(a * 100) / 100 },
    ];
  }, [a, b, input1Label, input2Label, config.formula]);

  const showPieChart = config.formula === 'pct' && chartData.length >= 1 && chartData.some((d) => d.value > 0);
  const showBarChart = config.formula === 'pct' && barData.some((d) => d.value > 0) && !showPieChart;

  const categories: { key: 'rentabilite' | 'rotation' | 'structure'; labelKey: string }[] = [
    { key: 'rentabilite', labelKey: 'ratios.categoryRentabilite' },
    { key: 'rotation', labelKey: 'ratios.categoryRotation' },
    { key: 'structure', labelKey: 'ratios.categoryStructure' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="text-[#0A2F73]" size={24} />
            <h3 className="text-xl font-black text-[#0A2F73]">{t('ratios.title')}</h3>
          </div>
          <p className="text-xs text-gray-500 mb-6">{t('ratios.selectRatio')}</p>

          <div className="mb-6">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              {t('ratios.ratioToCalculate')}
            </label>
            <select
              value={selectedRatio}
              onChange={(e) => {
                setSelectedRatio(e.target.value as RatioId);
                setInput1('');
                setInput2('');
                setInput3('');
              }}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all text-[#0A2F73]"
            >
              {categories.map((cat) => (
                <optgroup key={cat.key} label={t(cat.labelKey)}>
                  {RATIO_CONFIGS.filter((r) => r.category === cat.key).map((r) => (
                    <option key={r.id} value={r.id}>
                      {t(`ratios.ratios.${r.id}`)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {input1Label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder={t('ratios.placeholderNumber')}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">
                  {currency}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {input2Label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  placeholder={t('ratios.placeholderNumber')}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">
                  {currency}
                </span>
              </div>
            </div>
            {needsInput3 && (
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                  {input3Label}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={input3}
                    onChange={(e) => setInput3(e.target.value)}
                    placeholder={t('ratios.placeholderNumber')}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-bold outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">
                    {currency}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('ratios.ratioLabel')}</p>
            <p className="text-2xl font-black text-[#0A2F73]">
              {ratioValue != null ? formatResult(ratioValue, config.formula, t) : '—'}
            </p>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {ratioValue != null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A2F73] p-8 rounded-[2.5rem] text-white shadow-2xl"
            >
              <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">
                {ratioLabel}
              </div>
              <div className="text-4xl font-black text-[#E64501] mb-2">
                {formatResult(ratioValue, config.formula, t)}
              </div>
              <div className="text-sm text-white/70 space-y-1">
                <p>
                  {input1Label} : {a.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}
                </p>
                <p>
                  {input2Label} : {b.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}
                </p>
                {needsInput3 && c > 0 && (
                  <p>
                    {input3Label} : {c.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} {currency}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {showChart && (showPieChart || showBarChart) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg"
            >
              <h4 className="font-black text-[#0A2F73] mb-4 flex items-center gap-2">
                <PieChartIcon size={20} />
                {t('ratios.chartTitle')}
              </h4>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {showPieChart ? (
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) =>
                          `${name}: ${value.toLocaleString('fr-FR')} ${currency}`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => [v.toLocaleString('fr-FR') + ' ' + currency, '']} />
                      <Legend />
                    </PieChart>
                  ) : (
                    <BarChart
                      data={barData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        type="number"
                        tickFormatter={(v) => v.toLocaleString('fr-FR')}
                        tick={{ fontSize: 11, fill: '#0A2F73' }}
                      />
                      <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11, fill: '#0A2F73' }} />
                      <Tooltip
                        formatter={(v: number) => v.toLocaleString('fr-FR') + ' ' + currency}
                        contentStyle={{ borderRadius: 12 }}
                      />
                      <Bar dataKey="value" fill="#0A2F73" radius={[0, 4, 4, 0]} name={currency} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {ratioValue == null && (
            <div className="h-64 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center bg-slate-50/50">
              <Calculator size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 text-sm font-bold">{t('ratios.waiting')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
