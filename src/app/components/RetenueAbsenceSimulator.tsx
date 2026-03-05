import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Building2, User, Users, Heart, CalendarX } from 'lucide-react';

const HEURES_MENSUELLES = 173.333;
const JOURS_MOIS = 30;

interface RetenueResult {
  salaireBaseRetenu: number;
  sursalaireRetenu: number;
  transportRetenu: number;
  brutImposable: number;
  ipres: number;
  rcc: number;
  trimf: number;
  irNet: number;
  salaireNet: number;
  nbParts: number;
  retenueTotale: number;
}

function parseNum(s: string): number {
  return Math.max(0, parseFloat(String(s).replace(/\s/g, '').replace(',', '.')) || 0);
}

export function RetenueAbsenceSimulator() {
  const { t } = useTranslation();
  const [salaireBase, setSalaireBase] = useState<string>('');
  const [sursalaire, setSursalaire] = useState<string>('');
  const [primeTransport, setPrimeTransport] = useState<string>('');
  const [joursAbsence, setJoursAbsence] = useState<string>('0');
  const [statut, setStatut] = useState<'cadre' | 'non-cadre'>('non-cadre');
  const [situation, setSituation] = useState<'CELIBATAIRE' | 'MARIE'>('CELIBATAIRE');
  const [enfants, setEnfants] = useState<number>(0);
  const [conjointEnCharge, setConjointEnCharge] = useState<boolean>(false);
  const [result, setResult] = useState<RetenueResult | null>(null);

  const calculBrutToNet = useCallback(
    (valBrut: number, transportAmount: number): Omit<RetenueResult, 'salaireBaseRetenu' | 'sursalaireRetenu' | 'transportRetenu' | 'retenueTotale'> => {
      const ipresRG = Math.min(valBrut, 432000) * 0.056;
      const ipresRC = statut === 'cadre' ? Math.min(valBrut, 1296000) * 0.024 : 0;
      const totalIPRES = Math.round(ipresRG + ipresRC);

      const brutAnnuel = valBrut * 12;
      let trimfAnnuelle = 0;
      if (brutAnnuel <= 599999) trimfAnnuelle = 900;
      else if (brutAnnuel <= 999999) trimfAnnuelle = 3600;
      else if (brutAnnuel <= 1999999) trimfAnnuelle = 4800;
      else if (brutAnnuel <= 6999999) trimfAnnuelle = 12000;
      else if (brutAnnuel <= 11999999) trimfAnnuelle = 18000;
      else trimfAnnuelle = 36000;
      const totalTRIMF = (trimfAnnuelle / 12) * (conjointEnCharge ? 2 : 1);

      const baseArrondie = Math.floor(valBrut / 1000) * 1000;
      const abattement = Math.min(baseArrondie * 0.30, 75000);
      const revImposable = baseArrondie - abattement;

      const tranches = [
        { min: 0, max: 52500, t: 0 },
        { min: 52500, max: 125000, t: 0.20 },
        { min: 125000, max: 333333, t: 0.30 },
        { min: 333333, max: 666667, t: 0.35 },
        { min: 666667, max: 1125000, t: 0.37 },
        { min: 1125000, max: 4166667, t: 0.40 },
        { min: 4166667, max: Infinity, t: 0.43 },
      ];

      let irBrut = 0;
      tranches.forEach((tr) => {
        if (revImposable > tr.min) {
          irBrut += (Math.min(revImposable, tr.max) - tr.min) * tr.t;
        }
      });

      let calculParts = situation === 'MARIE' ? 1.5 : 1.0;
      calculParts += enfants * 0.5;
      if (situation === 'MARIE' && conjointEnCharge) calculParts += 0.5;
      const finalParts = Math.min(calculParts, 5.0);

      const reductionBareme: Record<number, { t: number; min: number; max: number }> = {
        1: { t: 0, min: 0, max: 0 },
        1.5: { t: 0.1, min: 8333, max: 25000 },
        2: { t: 0.15, min: 16667, max: 54167 },
        2.5: { t: 0.2, min: 25000, max: 91667 },
        3: { t: 0.25, min: 33333, max: 137500 },
        3.5: { t: 0.3, min: 41667, max: 169167 },
        4: { t: 0.35, min: 50000, max: 207500 },
        4.5: { t: 0.4, min: 58333, max: 229583 },
        5: { t: 0.45, min: 66667, max: 265000 },
      };

      const conf = reductionBareme[finalParts];
      let reduction = 0;
      if (irBrut > 0 && conf) {
        reduction = Math.max(conf.min, Math.min(irBrut * conf.t, conf.max));
      }
      let finalIR = Math.max(0, Math.floor(irBrut - reduction));
      if (finalIR > revImposable * 0.43) finalIR = Math.floor(revImposable * 0.43);

      const net = valBrut - totalIPRES - totalTRIMF - finalIR + transportAmount;

      return {
        brutImposable: valBrut,
        ipres: Math.round(ipresRG),
        rcc: Math.round(ipresRC),
        trimf: Math.round(totalTRIMF),
        irNet: finalIR,
        salaireNet: Math.round(net),
        nbParts: finalParts,
      };
    },
    [statut, situation, enfants, conjointEnCharge]
  );

  const calcul = useMemo(() => {
    const base = parseNum(salaireBase);
    const sursal = parseNum(sursalaire);
    const transport = parseNum(primeTransport);
    const absences = Math.min(JOURS_MOIS, Math.max(0, parseInt(joursAbsence, 10) || 0));
    const joursTravailles = JOURS_MOIS - absences;

    if (base <= 0 && sursal <= 0) return null;

    const coef = joursTravailles / JOURS_MOIS;
    const salaireBaseRetenu = base * coef;
    const sursalaireRetenu = sursal * coef;
    const transportRetenu = transport * coef;
    const brutImposable = salaireBaseRetenu + sursalaireRetenu;

    const netCalc = calculBrutToNet(brutImposable, transportRetenu);

    const brutComplet = base + sursal;
    const netSansAbsence = calculBrutToNet(brutComplet, transport);
    const retenueTotale = netSansAbsence.salaireNet - netCalc.salaireNet;

    return {
      salaireBaseRetenu: Math.round(salaireBaseRetenu),
      sursalaireRetenu: Math.round(sursalaireRetenu),
      transportRetenu: Math.round(transportRetenu),
      retenueTotale,
      ...netCalc,
    };
  }, [salaireBase, sursalaire, primeTransport, joursAbsence, calculBrutToNet]);

  useEffect(() => {
    setResult(calcul);
  }, [calcul]);

  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  const joursAbs = parseInt(joursAbsence, 10) || 0;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="grid md:grid-cols-2 min-h-[640px]">
          <div className="p-8 bg-white border-r border-slate-50">
            <h3 className="text-xl font-black text-[#0A2F73] mb-6 flex items-center gap-2">
              <CalendarX size={24} className="text-[#E64501]" /> {t('retenueAbsence.title')}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {t('retenueAbsence.salaireBase')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={salaireBase}
                    onChange={(e) => setSalaireBase(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold text-xl outline-none transition-all text-[#0A2F73]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">{t('retenueAbsence.cfa')}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {t('retenueAbsence.sursalaire')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={sursalaire}
                    onChange={(e) => setSursalaire(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold text-xl outline-none transition-all text-[#0A2F73]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">{t('retenueAbsence.cfa')}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {t('retenueAbsence.primeTransport')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={primeTransport}
                    onChange={(e) => setPrimeTransport(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold text-xl outline-none transition-all text-[#0A2F73]"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-sm">{t('retenueAbsence.cfa')}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {t('retenueAbsence.joursAbsence')}
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={joursAbsence}
                  onChange={(e) => setJoursAbsence(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-4 font-bold outline-none transition-all text-[#0A2F73]"
                />
                <p className="text-[10px] text-gray-500 mt-1">{t('retenueAbsence.infoRetenue')}</p>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSituation('CELIBATAIRE')}
                  className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${situation === 'CELIBATAIRE' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}
                >
                  <User size={14} /> {t('salarySimulator.single')}
                </button>
                <button
                  onClick={() => setSituation('MARIE')}
                  className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${situation === 'MARIE' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}
                >
                  <Users size={14} /> {t('salarySimulator.married')}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">{t('salarySimulator.children')}</label>
                  <select
                    value={enfants}
                    onChange={(e) => setEnfants(Number(e.target.value))}
                    className="w-full bg-slate-50 p-3 rounded-xl font-bold text-[#0A2F73] outline-none border-2 border-transparent focus:border-[#0A2F73]/20"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? t('salarySimulator.child') : t('salarySimulator.childrenPlural')}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => setConjointEnCharge(!conjointEnCharge)}
                    className={`p-3 rounded-xl border-2 text-[10px] font-black transition-all h-[46px] ${conjointEnCharge ? 'bg-[#0A2F73] border-[#0A2F73] text-white' : 'bg-slate-50 border-transparent text-gray-400'}`}
                  >
                    <Heart size={12} className={`inline mr-1 ${conjointEnCharge ? 'fill-white' : ''}`} /> {t('salarySimulator.spouseNoIncome')}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">{t('salarySimulator.category')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setStatut('non-cadre')}
                    className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${statut === 'non-cadre' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}
                  >
                    {t('salarySimulator.nonCadre')}
                  </button>
                  <button
                    onClick={() => setStatut('cadre')}
                    className={`py-3 rounded-xl border-2 font-black text-xs transition-all ${statut === 'cadre' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}
                  >
                    {t('salarySimulator.cadre')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-[#0A2F73] flex flex-col justify-between relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            {result && (parseNum(salaireBase) > 0 || parseNum(sursalaire) > 0) ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col space-y-4 relative z-10">
                <div className="space-y-3 flex-grow overflow-y-auto">
                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">{t('retenueAbsence.brutRetenu')}</span>
                    <span className="font-bold">{fmt(result.brutImposable)} {t('retenueAbsence.cfa')}</span>
                  </div>

                  {joursAbs > 0 && (
                    <div className="p-4 bg-amber-500/20 rounded-xl border border-amber-400/30">
                      <div className="text-[10px] font-black text-amber-200 uppercase tracking-widest mb-2">{t('retenueAbsence.detailRetenue')}</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-100/80">{t('retenueAbsence.salaireBase')}</span>
                          <span>{fmt(result.salaireBaseRetenu)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-100/80">{t('retenueAbsence.sursalaire')}</span>
                          <span>{fmt(result.sursalaireRetenu)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-100/80">{t('retenueAbsence.primeTransport')}</span>
                          <span>{fmt(result.transportRetenu)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 space-y-3">
                    <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest border-b border-white/10 pb-2">
                      {t('salarySimulator.monthlyDetails')}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100/70">{t('salarySimulator.retirement')}</span>
                      <span className="font-bold">-{fmt(result.ipres + result.rcc)} {t('retenueAbsence.cfa')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100/70">{t('salarySimulator.incomeTax')}</span>
                      <span className="font-bold">-{fmt(result.irNet)} {t('retenueAbsence.cfa')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100/70">{t('salarySimulator.municipalTax')}</span>
                      <span className="font-bold">-{fmt(result.trimf)} {t('retenueAbsence.cfa')}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                      <span className="text-emerald-300 font-bold">{t('salarySimulator.transport')}</span>
                      <span className="font-bold text-emerald-400">+{fmt(result.transportRetenu)} {t('retenueAbsence.cfa')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-[#E64501] rounded-2xl border border-white/20">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest block mb-1">
                    {t('retenueAbsence.netApresRetenue')}
                  </span>
                  <span className="font-black text-2xl text-white block">{fmt(result.salaireNet)} {t('retenueAbsence.cfa')}</span>
                  {joursAbs > 0 && (
                    <span className="text-xs text-white/80 mt-2 block">
                      {t('retenueAbsence.retenueTotale')} : -{fmt(result.retenueTotale)} {t('retenueAbsence.cfa')}
                    </span>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-center relative z-10">
                <Building2 size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">{t('retenueAbsence.fillForm')}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
