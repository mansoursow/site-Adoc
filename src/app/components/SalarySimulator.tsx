import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, RefreshCcw, User, Baby, Users, Heart } from 'lucide-react';

interface SalaryResult {
  salaireBrut: number;
  ipres: number;
  rcc: number;
  trimf: number;
  irNet: number;
  indemniteTransport: number;
  salaireNet: number;
  nbParts: number;
}

export function SalarySimulator() {
  const [calculMode, setCalculMode] = useState<'brut' | 'net'>('brut');
  const [montant, setMontant] = useState<string>('0');
  const [statut, setStatut] = useState<'cadre' | 'non-cadre'>('non-cadre');
  const [situation, setSituation] = useState<'CELIBATAIRE' | 'MARIE'>('CELIBATAIRE');
  const [enfants, setEnfants] = useState<number>(0);
  const [conjointEnCharge, setConjointEnCharge] = useState<boolean>(false);
  const [result, setResult] = useState<SalaryResult | null>(null);

  const TRANSPORT_ADOC = 26000;

  // Fonction pour afficher les séparateurs de milliers pendant la saisie
  const formatVisualNumber = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? '' : n.toLocaleString('fr-FR');
  };

  const runDirectCalculation = useCallback((valBrut: number): SalaryResult => {
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
      { min: 4166667, max: Infinity, t: 0.43 }
    ];

    let irBrut = 0;
    tranches.forEach(tr => {
      if (revImposable > tr.min) {
        irBrut += (Math.min(revImposable, tr.max) - tr.min) * tr.t;
      }
    });

    let calculParts = situation === 'MARIE' ? 1.5 : 1.0;
    calculParts += (enfants * 0.5);
    if (situation === 'MARIE' && conjointEnCharge) {
      calculParts += 0.5;
    }
    const finalParts = Math.min(calculParts, 5.0);

    const reductionBareme: Record<number, { t: number, min: number, max: number }> = {
      1:   { t: 0,    min: 0,      max: 0 },
      1.5: { t: 0.10, min: 8333,   max: 25000 },
      2:   { t: 0.15, min: 16667,  max: 54167 },
      2.5: { t: 0.20, min: 25000,  max: 91667 },
      3:   { t: 0.25, min: 33333,  max: 137500 },
      3.5: { t: 0.30, min: 41667,  max: 169167 },
      4:   { t: 0.35, min: 50000,  max: 207500 },
      4.5: { t: 0.40, min: 58333,  max: 229583 },
      5:   { t: 0.45, min: 66667,  max: 265000 }
    };

    const conf = reductionBareme[finalParts];
    let reduction = 0;
    if (irBrut > 0 && conf) {
      reduction = Math.max(conf.min, Math.min(irBrut * conf.t, conf.max));
    }
    
    let finalIR = Math.max(0, Math.floor(irBrut - reduction));
    if (finalIR > revImposable * 0.43) {
      finalIR = Math.floor(revImposable * 0.43);
    }

    const net = valBrut - totalIPRES - totalTRIMF - finalIR + TRANSPORT_ADOC;

    return {
      salaireBrut: valBrut,
      ipres: Math.round(ipresRG),
      rcc: Math.round(ipresRC),
      trimf: Math.round(totalTRIMF),
      irNet: finalIR,
      indemniteTransport: TRANSPORT_ADOC,
      salaireNet: Math.round(net),
      nbParts: finalParts
    };
  }, [statut, situation, enfants, conjointEnCharge]);

  useEffect(() => {
    const inputAmount = parseFloat(montant) || 0;
    if (inputAmount === 0) {
      setResult(null);
      return;
    }

    if (calculMode === 'brut') {
      setResult(runDirectCalculation(inputAmount));
    } else {
      let currentBrut = inputAmount - TRANSPORT_ADOC;
      for (let i = 0; i < 50; i++) {
        const test = runDirectCalculation(currentBrut);
        const diff = inputAmount - test.salaireNet;
        if (Math.abs(diff) < 1) break;
        currentBrut += diff;
      }
      setResult(runDirectCalculation(currentBrut));
    }
  }, [montant, calculMode, statut, situation, enfants, conjointEnCharge, runDirectCalculation]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          
          {/* PANNEAU DE SAISIE (GAUCHE) */}
          <div className="p-8 bg-white border-r border-slate-50">
            <h3 className="text-xl font-black text-[#0A2F73] mb-8 flex items-center gap-2">
              <Building2 size={24} className="text-[#E64501]" /> Simulateur Paie Sénégal
            </h3>
            
            <div className="space-y-6">
              <div className="flex p-1 bg-slate-100 rounded-2xl relative h-12">
                <div className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-xl shadow-sm transition-all duration-300 ${calculMode === 'net' ? 'translate-x-[104%]' : 'translate-x-0'}`} />
                <button onClick={() => setCalculMode('brut')} className={`relative z-10 flex-1 text-xs font-black transition-colors ${calculMode === 'brut' ? 'text-[#0A2F73]' : 'text-gray-400'}`}>BRUT → NET</button>
                <button onClick={() => setCalculMode('net')} className={`relative z-10 flex-1 text-xs font-black transition-colors ${calculMode === 'net' ? 'text-[#0A2F73]' : 'text-gray-400'}`}>NET → BRUT</button>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                  {calculMode === 'brut' ? 'Salaire Brut Imposable' : 'Net à Payer Souhaité'}
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    onFocus={(e) => e.target.value === '0' && setMontant('')}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] rounded-2xl p-5 font-black text-3xl outline-none transition-all text-[#0A2F73]"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">CFA</span>
                </div>
                {/* SÉPARATEUR DE LISIBILITÉ */}
                {montant !== '0' && montant !== '' && (
                  <p className="mt-2 text-right font-bold text-[#E64501] text-sm animate-pulse">
                    {formatVisualNumber(montant)} CFA
                  </p>
                )}
              </div>

              <hr className="border-slate-100 my-4" />

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSituation('CELIBATAIRE')} className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${situation === 'CELIBATAIRE' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}>
                  <User size={16} /> CÉLIBATAIRE
                </button>
                <button onClick={() => setSituation('MARIE')} className={`p-4 rounded-xl border-2 flex items-center justify-center gap-2 font-bold text-xs transition-all ${situation === 'MARIE' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}>
                  <Users size={16} /> MARIÉ(E)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">Enfants</label>
                  <select value={enfants} onChange={(e) => setEnfants(Number(e.target.value))} className="w-full bg-slate-50 p-3 rounded-xl font-bold text-[#0A2F73] outline-none border-2 border-transparent focus:border-[#0A2F73]/20">
                    {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} enfant{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <button 
                    onClick={() => setConjointEnCharge(!conjointEnCharge)}
                    className={`p-3 rounded-xl border-2 text-[10px] font-black transition-all h-[48px] ${conjointEnCharge ? 'bg-[#0A2F73] border-[#0A2F73] text-white shadow-lg' : 'bg-slate-50 border-transparent text-gray-400'}`}
                  >
                    <Heart size={12} className={`inline mr-1 ${conjointEnCharge ? 'fill-white' : ''}`} /> CONJOINT SANS REVENU
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">Catégorie</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setStatut('non-cadre')} className={`py-4 rounded-2xl border-2 font-black text-xs transition-all ${statut === 'non-cadre' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}>NON-CADRE</button>
                  <button onClick={() => setStatut('cadre')} className={`py-4 rounded-2xl border-2 font-black text-xs transition-all ${statut === 'cadre' ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]' : 'border-slate-50 text-gray-400'}`}>CADRE</button>
                </div>
              </div>
            </div>
          </div>

          {/* PANNEAU DE RÉSULTATS (DROITE - BLEU) */}
          <div className="p-8 bg-[#0A2F73] flex flex-col justify-between relative overflow-hidden text-white">
            {/* Effet décoratif en arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            {result ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col space-y-4 relative z-10">
                
                <div className="space-y-3 flex-grow">
                  {/* Badge Parts */}
                  <div className="flex justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 items-center">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Parts Fiscales (CGI)</span>
                    <span className="font-black px-4 py-1 bg-[#E64501] text-white rounded-lg text-sm shadow-md">
                      {result.nbParts} part{result.nbParts > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Bloc Détails */}
                  <div className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Détails mensuels</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100/70">Retraite (IPRES)</span>
                      <span className="font-bold">-{ (result.ipres + result.rcc).toLocaleString('fr-FR')} <small className="opacity-50">CFA</small></span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100/70">Impôt IR (Net)</span>
                      <span className="font-bold">-{result.irNet.toLocaleString('fr-FR')} <small className="opacity-50">CFA</small></span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-blue-100/70">Taxe Munic. (TRIMF)</span>
                      <span className="font-bold">-{result.trimf.toLocaleString('fr-FR')} <small className="opacity-50">CFA</small></span>
                    </div>

                    <div className="pt-2 border-t border-dashed border-white/20 flex justify-between text-sm">
                      <span className="text-emerald-300 font-bold italic">Transport</span>
                      <span className="font-bold text-emerald-400">+{result.indemniteTransport.toLocaleString('fr-FR')} <small className="opacity-50 text-white">CFA</small></span>
                    </div>
                  </div>
                </div>

                {/* RÉSULTAT FINAL EN BAS (CARTE BLANCHE) */}
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#E64501]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0A2F73]/40 block mb-2">
                    {calculMode === 'brut' ? 'NET À PERCEVOIR' : 'BRUT ESTIMÉ'}
                  </span>
                  <div className="text-4xl font-black text-[#0A2F73] flex items-baseline gap-2">
                    {Math.round(calculMode === 'brut' ? result.salaireNet : result.salaireBrut).toLocaleString('fr-FR')} 
                    <span className="text-sm font-bold text-[#E64501] tracking-normal uppercase">CFA</span>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="text-center p-12 my-auto opacity-50 relative z-10">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <RefreshCcw size={28} className="text-blue-200 animate-spin-slow" />
                </div>
                <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">En attente de saisie</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <p className="text-center mt-6 text-gray-400 text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">
        Simulateur conforme à la Loi n° 2022-19 du 27 mai 2022 (Sénégal)
      </p>
    </div>
  );
}