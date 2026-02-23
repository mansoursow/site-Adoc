import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Users } from 'lucide-react';

interface TaxResult {
  revenuBrut: number;
  impotIR: number;
  trimf: number;
  impotTotal: number;
  parts: number;
}

export function TaxCalculator() {
  const [revenuBrutSaisi, setRevenuBrutSaisi] = useState<string>('');
  const [situationFamiliale, setSituationFamiliale] = useState<string>('celibataire');
  const [nombreEnfants, setNombreEnfants] = useState<string>('0');
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculateTax = () => {
    const brutSaisi = parseFloat(revenuBrutSaisi) || 0;
    const brutBase = Math.floor(brutSaisi / 5000) * 5000;
    const enfants = parseInt(nombreEnfants) || 0;

    // --- LOGIQUE ARTICLE 174 CGI ---
    // 1. Détermination du nombre de parts (Plafonné à 5)
    let calculParts = 1;
    if (situationFamiliale === 'marie') {
        calculParts = 1.5;
    } else if (situationFamiliale === 'veuf') {
        calculParts = (enfants > 0) ? 2.0 : 1.5; 
    }
    
    // Ajout des parts pour enfants (0.5 par enfant)
    calculParts += (enfants * 0.5);
    
    // Application du plafond strict (Art 174.4)
    const finalParts = Math.min(calculParts, 5.0);

    // 2. TRIMF (Taxe Municipale Annuelle)
    let trimf = 0;
    if (brutBase >= 600000 && brutBase < 1000000) trimf = 3600;
    else if (brutBase >= 1000000 && brutBase < 2000000) trimf = 4800;
    else if (brutBase >= 2000000 && brutBase < 7000000) trimf = 12000;
    else if (brutBase >= 7000000 && brutBase < 12000000) trimf = 18000;
    else if (brutBase >= 12000000) trimf = 36000;

    // 3. IR Progressif Annuel
    const abattement = Math.min(brutBase * 0.3, 900000);
    let rni = brutBase - abattement;
    rni = Math.floor(rni / 1000) * 1000; // Arrondi RNI

    let irTheorique = 0;
    if (rni > 630000) {
      if (rni <= 1500000) irTheorique = (rni - 630000) * 0.20;
      else if (rni <= 4000000) irTheorique = 174000 + (rni - 1500000) * 0.30;
      else if (rni <= 8000000) irTheorique = 924000 + (rni - 4000000) * 0.35;
      else if (rni <= 13500000) irTheorique = 2324000 + (rni - 8000000) * 0.37;
      else irTheorique = 4359000 + (rni - 13500000) * 0.40;
    }

    // 4. Réductions de charge (Tableau Art 174.1)
    const baremeReduc: Record<number, { taux: number, min: number, max: number }> = {
      1.5: { taux: 0.10, min: 100000, max: 300000 },
      2.0: { taux: 0.15, min: 200000, max: 650000 },
      2.5: { taux: 0.20, min: 300000, max: 1100000 },
      3.0: { taux: 0.25, min: 400000, max: 1650000 },
      3.5: { taux: 0.30, min: 500000, max: 2030000 },
      4.0: { taux: 0.35, min: 600000, max: 2490000 },
      4.5: { taux: 0.40, min: 700000, max: 2755000 },
      5.0: { taux: 0.45, min: 800000, max: 3180000 }
    };

    let reduction = 0;
    const conf = baremeReduc[finalParts];
    if (conf && irTheorique > 0) {
      reduction = irTheorique * conf.taux;
      if (reduction < conf.min && irTheorique > conf.min) reduction = conf.min;
      if (reduction > conf.max) reduction = conf.max;
    }

    let irFinal = Math.max(0, irTheorique - reduction);

    // Art 174.1 : Plafonnement à 43% du RNI
    if (irFinal > rni * 0.43) {
      irFinal = rni * 0.43;
    }

    setResult({
      revenuBrut: brutSaisi,
      impotIR: Math.floor(irFinal),
      trimf: trimf,
      impotTotal: Math.floor(irFinal + trimf),
      parts: finalParts
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* FORMULAIRE */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="text-[#0A2F73]" size={24} />
            <h3 className="text-xl font-black text-[#0A2F73]">Calculateur IR Annuel</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Revenu Annuel Brut</label>
              <div className="relative">
                <input
                  type="number"
                  value={revenuBrutSaisi}
                  onChange={(e) => setRevenuBrutSaisi(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-4 rounded-2xl font-black text-xl outline-none transition-all"
                  placeholder="Ex: 5000000"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 tracking-tighter">CFA</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Situation</label>
                <select 
                  value={situationFamiliale} 
                  onChange={(e) => setSituationFamiliale(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#0A2F73]/20"
                >
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="veuf">Veuf(ve)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Enfants</label>
                <input
                  type="number"
                  value={nombreEnfants}
                  onChange={(e) => setNombreEnfants(e.target.value)}
                  className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#0A2F73]/20"
                />
              </div>
            </div>

            <button onClick={calculateTax} className="w-full bg-[#0A2F73] text-white py-5 rounded-2xl font-black hover:bg-[#E64501] transition-all shadow-lg shadow-[#0A2F73]/20 uppercase tracking-widest text-sm">
              Calculer l'impôt annuel
            </button>
          </div>
        </div>

        {/* AFFICHAGE (ZONE BLEUE) */}
        <div className="h-full flex flex-col justify-start">
          {result ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="bg-[#0A2F73] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 text-center">Impôt Total à Payer (An)</div>
                <div className="text-4xl font-black text-[#E64501] text-center">
                  {result.impotTotal.toLocaleString('fr-FR')} <span className="text-sm font-normal text-white italic">CFA</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <Users size={18} className="text-[#0A2F73]" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Quotient Familial</span>
                </div>
                <span className="text-xl font-black text-[#0A2F73] bg-[#0A2F73]/5 px-4 py-1 rounded-lg">
                    {result.parts} Part{result.parts > 1 ? 's' : ''}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Impôt IR Net</span>
                <span className="text-lg font-black text-[#0A2F73]">{result.impotIR.toLocaleString('fr-FR')} CFA</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Taxe Municipale</span>
                <span className="text-lg font-black text-[#0A2F73]">{result.trimf.toLocaleString('fr-FR')} CFA</span>
              </div>

              <p className="text-[10px] text-gray-400 text-center italic mt-4">
                *Plafonnement de l'Article 174 appliqué (Max 5 parts / Max 43% RNI)
              </p>
            </motion.div>
          ) : (
            <div className="h-full border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center">
              <Calculator size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-300 text-xs font-black uppercase tracking-[0.2em]">En attente de calcul...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}