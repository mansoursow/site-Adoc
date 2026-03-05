import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Building2, ChevronDown, Scale, Shield } from 'lucide-react';

type Responsabilite = 'indefinie' | 'limitee';

const SOCIETIES_BY_RESP: Record<Responsabilite, string[]> = {
  indefinie: ['SNC', 'SCS', 'SEP', 'societeDeFait', 'GIE'],
  limitee: ['SARL', 'SUARL', 'SA', 'SAS', 'SASU'],
};

export function FormeSocialeSimulator() {
  const { t } = useTranslation();
  const [responsabilite, setResponsabilite] = useState<Responsabilite | null>(null);
  const [selectedSociete, setSelectedSociete] = useState<string | null>(null);

  const societies = responsabilite ? SOCIETIES_BY_RESP[responsabilite] : [];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="grid md:grid-cols-2 min-h-[520px]">
          <div className="p-8 bg-white border-r border-slate-50">
            <h3 className="text-xl font-black text-[#0A2F73] mb-6 flex items-center gap-2">
              <Building2 size={24} className="text-[#E64501]" /> {t('formeSociale.title')}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-3 block tracking-widest italic">
                  {t('formeSociale.chooseResponsabilite')}
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResponsabilite('indefinie');
                      setSelectedSociete(null);
                    }}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 text-left transition-all ${
                      responsabilite === 'indefinie'
                        ? 'border-[#E64501] bg-[#E64501]/5'
                        : 'border-slate-100 hover:border-[#0A2F73]/30'
                    }`}
                  >
                    <Scale size={24} className={`shrink-0 ${responsabilite === 'indefinie' ? 'text-[#E64501]' : 'text-gray-400'}`} />
                    <div>
                      <span className={`font-black text-sm block ${responsabilite === 'indefinie' ? 'text-[#0A2F73]' : 'text-gray-600'}`}>
                        {t('formeSociale.responsabiliteIndefinie')}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 block">{t('formeSociale.responsabiliteIndefinieDesc')}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResponsabilite('limitee');
                      setSelectedSociete(null);
                    }}
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 text-left transition-all ${
                      responsabilite === 'limitee'
                        ? 'border-[#0A2F73] bg-[#0A2F73]/5'
                        : 'border-slate-100 hover:border-[#0A2F73]/30'
                    }`}
                  >
                    <Shield size={24} className={`shrink-0 ${responsabilite === 'limitee' ? 'text-[#0A2F73]' : 'text-gray-400'}`} />
                    <div>
                      <span className={`font-black text-sm block ${responsabilite === 'limitee' ? 'text-[#0A2F73]' : 'text-gray-600'}`}>
                        {t('formeSociale.responsabiliteLimitee')}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 block">{t('formeSociale.responsabiliteLimiteeDesc')}</span>
                    </div>
                  </button>
                </div>
              </div>

              {responsabilite && societies.length > 0 && (
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest italic">
                    {t('formeSociale.chooseForme')}
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {societies.map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedSociete(selectedSociete === code ? null : code)}
                        className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                          selectedSociete === code
                            ? 'border-[#0A2F73] bg-[#0A2F73]/5 text-[#0A2F73]'
                            : 'border-slate-100 hover:border-[#0A2F73]/20'
                        }`}
                      >
                        <span className="font-bold text-sm">{t(`formeSociale.societies.${code}.name`)}</span>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 transition-transform ${selectedSociete === code ? 'rotate-180' : ''}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 italic">{t('formeSociale.disclaimer')}</p>
            </div>
          </div>

          <div className="p-8 bg-[#0A2F73] flex flex-col relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

            {selectedSociete ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative z-10 space-y-4 overflow-y-auto"
              >
                <h4 className="font-black text-xl border-b border-white/20 pb-3 flex items-center gap-2">
                  <Building2 size={22} className="text-[#E64501]" />
                  {t(`formeSociale.societies.${selectedSociete}.name`)}
                </h4>

                <div className="space-y-3">
                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">
                      {t('formeSociale.nbAssocies')}
                    </span>
                    <span className="font-bold">{t(`formeSociale.societies.${selectedSociete}.nbAssocies`)}</span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">
                      {t('formeSociale.responsabilite')}
                    </span>
                    <span className="font-bold">{t(`formeSociale.societies.${selectedSociete}.responsabilite`)}</span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">
                      {t('formeSociale.capitalSocial')}
                    </span>
                    <span className="font-bold">{t(`formeSociale.societies.${selectedSociete}.capital`)}</span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">
                      {t('formeSociale.organisation')}
                    </span>
                    <span className="font-bold">{t(`formeSociale.societies.${selectedSociete}.organisation`)}</span>
                  </div>

                  <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-widest block mb-1">
                      {t('formeSociale.seuilsCAC')}
                    </span>
                    <span className="font-bold">{t(`formeSociale.societies.${selectedSociete}.seuilsCAC`)}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/40 text-center relative z-10">
                <Scale size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">{t('formeSociale.selectForme')}</p>
                <p className="text-sm mt-2 text-white/60">{t('formeSociale.selectFormeHint')}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
