import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CalendarOff } from 'lucide-react';

interface IndemniteResult {
  salaireMoyen: number;
  ancienneteAnnees: number;
  tranche1: number;
  tranche2: number;
  tranche3: number;
  indemniteTotale: number;
}

function formatDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${j}`;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function joursEntre(dateDebut: Date, dateFin: Date): number {
  const ms = dateFin.getTime() - dateDebut.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function IndemniteLicenciementSimulator() {
  const { t } = useTranslation();
  const today = useMemo(() => formatDateInput(new Date()), []);
  const [brutSocial, setBrutSocial] = useState<string>('');
  const [dateEmbauche, setDateEmbauche] = useState<string>('');
  const [dateArret, setDateArret] = useState<string>(today);
  const [result, setResult] = useState<IndemniteResult | null>(null);

  const calculate = useMemo(() => {
    const brut = parseFloat(brutSocial.replace(/\s/g, '')) || 0;
    const debut = parseDate(dateEmbauche);
    const fin = parseDate(dateArret);
    if (brut <= 0 || !debut || !fin || fin <= debut) return null;

    const salaireMoyen = brut / 12;
    const jours = joursEntre(debut, fin);
    const ancienneteAnnees = jours / 365;

    const ans1 = Math.min(ancienneteAnnees, 5);
    const ans2 = Math.min(Math.max(ancienneteAnnees - 5, 0), 5);
    const ans3 = Math.max(ancienneteAnnees - 10, 0);

    const tranche1 = ans1 * salaireMoyen * 0.25;
    const tranche2 = ans2 * salaireMoyen * 0.30;
    const tranche3 = ans3 * salaireMoyen * 0.40;
    const indemniteTotale = tranche1 + tranche2 + tranche3;

    return {
      salaireMoyen,
      ancienneteAnnees,
      tranche1,
      tranche2,
      tranche3,
      indemniteTotale,
    };
  }, [brutSocial, dateEmbauche, dateArret]);

  useEffect(() => {
    setResult(calculate);
  }, [calculate]);

  const formatNumber = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="grid md:grid-cols-2 min-h-[500px]">
          <div className="p-8 bg-white border-r border-slate-50">
            <h3 className="text-xl font-black text-[#0A2F73] mb-8 flex items-center gap-2">
              <Briefcase size={24} className="text-[#E64501]" /> {t('indemniteLicenciement.title')}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {t('indemniteLicenciement.brutSocial')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={brutSocial}
                    onChange={(e) => setBrutSocial(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-5 font-black text-2xl outline-none transition-all text-[#0A2F73]"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{t('indemniteLicenciement.cfa')}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic flex items-center gap-2">
                  <Calendar size={14} /> {t('indemniteLicenciement.dateEmbauche')}
                </label>
                <input
                  type="date"
                  value={dateEmbauche}
                  onChange={(e) => setDateEmbauche(e.target.value)}
                  max={dateArret || undefined}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold outline-none transition-all text-[#0A2F73]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic flex items-center gap-2">
                  <CalendarOff size={14} /> {t('indemniteLicenciement.dateArret')}
                </label>
                <input
                  type="date"
                  value={dateArret}
                  onChange={(e) => setDateArret(e.target.value)}
                  min={dateEmbauche || undefined}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold outline-none transition-all text-[#0A2F73]"
                />
              </div>

              <p className="text-xs text-gray-500 italic">
                {t('indemniteLicenciement.info')}
              </p>
            </div>
          </div>

          <div className="p-8 bg-[#0A2F73] flex flex-col justify-between relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            {result ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col space-y-4 relative z-10"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                      {t('indemniteLicenciement.salaireMoyen')}
                    </span>
                    <span className="font-black text-lg">
                      {formatNumber(result.salaireMoyen)} <small className="opacity-70 text-sm">{t('indemniteLicenciement.cfa')}</small>
                    </span>
                  </div>

                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                      {t('indemniteLicenciement.anciennete')}
                    </span>
                    <span className="font-black text-lg">
                      {result.ancienneteAnnees.toFixed(2)} {t('indemniteLicenciement.annees')}
                    </span>
                  </div>

                  <div className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 space-y-3">
                    <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">
                      {t('indemniteLicenciement.detailTranches')}
                    </div>
                    {result.tranche1 > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100/80">{t('indemniteLicenciement.tranche1')}</span>
                        <span className="font-bold">{formatNumber(result.tranche1)} {t('indemniteLicenciement.cfa')}</span>
                      </div>
                    )}
                    {result.tranche2 > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100/80">{t('indemniteLicenciement.tranche2')}</span>
                        <span className="font-bold">{formatNumber(result.tranche2)} {t('indemniteLicenciement.cfa')}</span>
                      </div>
                    )}
                    {result.tranche3 > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100/80">{t('indemniteLicenciement.tranche3')}</span>
                        <span className="font-bold">{formatNumber(result.tranche3)} {t('indemniteLicenciement.cfa')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-[#E64501] rounded-2xl border border-white/20 relative z-10">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-1">
                    {t('indemniteLicenciement.indemniteTotale')}
                  </span>
                  <span className="font-black text-3xl text-white block">
                    {formatNumber(result.indemniteTotale)} {t('indemniteLicenciement.cfa')}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-center relative z-10">
                <Briefcase size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">{t('indemniteLicenciement.fillForm')}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
