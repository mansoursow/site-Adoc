import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Baby, Calendar, CalendarCheck, CalendarOff } from 'lucide-react';

const SEMAINES_AVANT = 6;
const JOURS_AVANT_MAX = SEMAINES_AVANT * 7; // 42
const SEMAINES_APRES = 8;
const JOURS_APRES_BASE = SEMAINES_APRES * 7; // 56
const MAX_JOURS_EXTENSION = 21; // 3 semaines

function joursEntre(dateFin: Date, dateDebut: Date): number {
  return Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateLocale(d: Date): string {
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function CongeMaterniteSimulator() {
  const { t } = useTranslation();
  const [dateDebutConge, setDateDebutConge] = useState<string>('');
  const [dateAccouchement, setDateAccouchement] = useState<string>('');
  const [extensionChecked, setExtensionChecked] = useState(false);
  const [joursExtension, setJoursExtension] = useState<string>('0');
  const [result, setResult] = useState<{
    dateRetour: Date;
    joursTotal: number;
    joursApres: number;
    joursDefalques?: number;
    excedentAvant?: number;
  } | null>(null);

  const calcul = useMemo(() => {
    const accouchement = parseDate(dateAccouchement);
    if (!accouchement) return null;

    let joursApres = JOURS_APRES_BASE;
    let joursDefalques: number | undefined;
    let excedentAvant: number | undefined;

    const debut = parseDate(dateDebutConge);
    if (debut) {
      const joursAvantAccouchement = joursEntre(accouchement, debut);
      if (joursAvantAccouchement > JOURS_AVANT_MAX) {
        excedentAvant = joursAvantAccouchement - JOURS_AVANT_MAX;
        joursDefalques = excedentAvant;
        joursApres = Math.max(0, JOURS_APRES_BASE - excedentAvant);
      }
    }

    if (extensionChecked) {
      const j = Math.min(MAX_JOURS_EXTENSION, Math.max(0, parseInt(joursExtension, 10) || 0));
      joursApres += j;
    }

    const dateRetour = addDays(accouchement, joursApres);
    const joursTotal = debut
      ? joursEntre(dateRetour, debut)
      : joursApres;

    return { dateRetour, joursTotal, joursApres, joursDefalques, excedentAvant };
  }, [dateAccouchement, dateDebutConge, extensionChecked, joursExtension]);

  useEffect(() => {
    setResult(calcul);
  }, [calcul]);

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
              <Baby size={24} className="text-[#E64501]" /> {t('congeMaternite.title')}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic flex items-center gap-2">
                  <Calendar size={14} /> {t('congeMaternite.dateDebutConge')}
                </label>
                <input
                  type="date"
                  value={dateDebutConge}
                  onChange={(e) => setDateDebutConge(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold outline-none transition-all text-[#0A2F73]"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic flex items-center gap-2">
                  <Baby size={14} /> {t('congeMaternite.dateAccouchement')}
                </label>
                <input
                  type="date"
                  value={dateAccouchement}
                  onChange={(e) => setDateAccouchement(e.target.value)}
                  min={dateDebutConge || undefined}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold outline-none transition-all text-[#0A2F73]"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={extensionChecked}
                    onChange={(e) => setExtensionChecked(e.target.checked)}
                    className="mt-1 rounded border-[#0A2F73] text-[#0A2F73] focus:ring-[#0A2F73]"
                  />
                  <span className="text-xs text-gray-700 leading-relaxed">
                    {t('congeMaternite.extensionLabel')}
                  </span>
                </label>
                {extensionChecked && (
                  <div className="mt-4">
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest">
                      {t('congeMaternite.joursExtension')}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={MAX_JOURS_EXTENSION}
                      value={joursExtension}
                      onChange={(e) => setJoursExtension(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border-2 border-slate-200 focus:border-[#0A2F73] rounded-xl p-3 font-bold outline-none transition-all text-[#0A2F73]"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">
                      {t('congeMaternite.extensionMax', { max: MAX_JOURS_EXTENSION })}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 italic leading-relaxed">
                {t('congeMaternite.info')}
              </p>
            </div>
          </div>

          <div className="p-8 bg-[#0A2F73] flex flex-col justify-between relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            {result && dateAccouchement ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full flex flex-col space-y-4 relative z-10"
              >
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                      {t('congeMaternite.dateAccouchement')}
                    </span>
                    <span className="font-bold text-sm">
                      {formatDateLocale(parseDate(dateAccouchement)!)}
                    </span>
                  </div>

                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                      {t('congeMaternite.semainesApres')}
                    </span>
                    <span className="font-black text-lg">
                      {Math.floor(result.joursApres / 7)} {t('congeMaternite.semaines')}
                      {result.joursApres % 7 ? ` + ${result.joursApres % 7} j` : ''}
                    </span>
                  </div>

                  {result.joursDefalques != null && result.joursDefalques > 0 && (
                    <div className="flex justify-between p-4 bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-400/30 items-center">
                      <span className="text-[10px] font-black text-amber-200 uppercase tracking-widest">
                        {t('congeMaternite.defalque')}
                      </span>
                      <span className="font-bold text-amber-100">
                        -{result.joursDefalques} {t('congeMaternite.jours')}
                      </span>
                    </div>
                  )}

                  {extensionChecked && parseInt(joursExtension, 10) > 0 && (
                    <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                      <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                        {t('congeMaternite.extensionAdded')}
                      </span>
                      <span className="font-bold">
                        {parseInt(joursExtension, 10)} {t('congeMaternite.jours')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 bg-[#E64501] rounded-2xl border border-white/20 relative z-10">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <CalendarCheck size={14} /> {t('congeMaternite.dateRetour')}
                  </span>
                  <span className="font-black text-xl text-white block">
                    {formatDateLocale(result.dateRetour)}
                  </span>
                  <span className="text-xs text-white/80 mt-2 block">
                    {result.joursTotal} {t('congeMaternite.joursTotal')}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-center relative z-10">
                <CalendarOff size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">{t('congeMaternite.fillForm')}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
