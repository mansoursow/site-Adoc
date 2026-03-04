import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FileSignature, Info } from 'lucide-react';

const TAUX_INDEMNITE = 0.07; // 7%

export function IndemniteFinCDDSimulator() {
  const { t } = useTranslation();
  const [totalBrut, setTotalBrut] = useState<string>('');
  const [indemnite, setIndemnite] = useState<number | null>(null);

  const calcul = useMemo(() => {
    const brut = parseFloat(totalBrut.replace(/\s/g, '')) || 0;
    if (brut <= 0) return null;
    return Math.round(brut * TAUX_INDEMNITE);
  }, [totalBrut]);

  useEffect(() => {
    setIndemnite(calcul);
  }, [calcul]);

  const formatNumber = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="grid md:grid-cols-2 min-h-[420px]">
          <div className="p-8 bg-white border-r border-slate-50">
            <h3 className="text-xl font-black text-[#0A2F73] mb-8 flex items-center gap-2">
              <FileSignature size={24} className="text-[#E64501]" /> {t('indemniteFinCDD.title')}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {t('indemniteFinCDD.totalBrut')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={totalBrut}
                    onChange={(e) => setTotalBrut(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-5 font-black text-2xl outline-none transition-all text-[#0A2F73]"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{t('indemniteFinCDD.cfa')}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic leading-relaxed">
                {t('indemniteFinCDD.info')}
              </p>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex gap-2 mb-2">
                  <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">{t('indemniteFinCDD.nonDueTitle')}</span>
                </div>
                <ul className="text-xs text-amber-900/90 space-y-1">
                  {[1, 2, 3].map((i) => (
                    <li key={i}>• {t(`indemniteFinCDD.nonDue${i}`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#0A2F73] flex flex-col justify-between relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            {indemnite !== null && totalBrut ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col space-y-4 relative z-10"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                      {t('indemniteFinCDD.totalBrutLabel')}
                    </span>
                    <span className="font-black text-lg">
                      {formatNumber(parseFloat(totalBrut.replace(/\s/g, '')) || 0)} <small className="opacity-70 text-sm">{t('indemniteFinCDD.cfa')}</small>
                    </span>
                  </div>

                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                      {t('indemniteFinCDD.taux')}
                    </span>
                    <span className="font-black text-lg">7 %</span>
                  </div>
                </div>

                <div className="p-5 bg-[#E64501] rounded-2xl border border-white/20 relative z-10">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-1">
                    {t('indemniteFinCDD.indemniteResult')}
                  </span>
                  <span className="font-black text-3xl text-white block">
                    {formatNumber(indemnite)} {t('indemniteFinCDD.cfa')}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-center relative z-10">
                <FileSignature size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">{t('indemniteFinCDD.fillForm')}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
