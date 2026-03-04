'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Building2,
  Ship,
  Train,
  Plane,
  Shield,
  Gift,
  FolderOpen,
} from 'lucide-react';

type OpenPlancher = 'pl15' | 'pl100' | null;
type OpenCategory =
  | 'catPrimaire'
  | 'catSocial'
  | 'catServices'
  | 'catManufacturier'
  | 'catMineraux'
  | 'catTourisme'
  | 'catCulture'
  | 'catInfra'
  | 'catComplexes'
  | null;
type OpenInfra = 'commerciaux' | 'portuaires' | 'ferroviaires' | 'aeroportuaires' | null;
type OpenAvantage = 'creation' | 'extension' | null;
type OpenPhase = 'realisation' | 'exploitation' | null;

export function CodeInvestissementsSection() {
  const { t } = useTranslation();
  const [openPlancher, setOpenPlancher] = useState<OpenPlancher>(null);
  const [openCategory, setOpenCategory] = useState<OpenCategory>(null);
  const [openInfra, setOpenInfra] = useState<OpenInfra>(null);
  const [openAvantage, setOpenAvantage] = useState<OpenAvantage>(null);
  const [openPhase, setOpenPhase] = useState<OpenPhase>(null);

  const plancher15Categories: { key: OpenCategory; labelKey: string; itemsKey: string }[] = [
    { key: 'catPrimaire', labelKey: 'codeInvestissements.catPrimaire', itemsKey: 'codeInvestissements.catPrimaireItems' },
    { key: 'catSocial', labelKey: 'codeInvestissements.catSocial', itemsKey: 'codeInvestissements.catSocialItems' },
    { key: 'catServices', labelKey: 'codeInvestissements.catServices', itemsKey: 'codeInvestissements.catServicesItems' },
  ];
  const plancher100Categories: { key: OpenCategory; labelKey: string; itemsKey: string }[] = [
    { key: 'catManufacturier', labelKey: 'codeInvestissements.catManufacturier', itemsKey: 'codeInvestissements.catManufacturierItems' },
    { key: 'catMineraux', labelKey: 'codeInvestissements.catMineraux', itemsKey: 'codeInvestissements.catMinerauxItems' },
    { key: 'catTourisme', labelKey: 'codeInvestissements.catTourisme', itemsKey: 'codeInvestissements.catTourismeItems' },
    { key: 'catCulture', labelKey: 'codeInvestissements.catCulture', itemsKey: 'codeInvestissements.catCultureItems' },
    { key: 'catInfra', labelKey: 'codeInvestissements.catInfra', itemsKey: 'codeInvestissements.catInfraItems' },
    { key: 'catComplexes', labelKey: 'codeInvestissements.catComplexes', itemsKey: 'codeInvestissements.catComplexesItems' },
  ];

  const infraTypes: { key: OpenInfra; labelKey: string; itemsKey: string; Icon: typeof Building2 }[] = [
    { key: 'commerciaux', labelKey: 'codeInvestissements.infraCommerciaux', itemsKey: 'codeInvestissements.infraCommerciauxItems', Icon: Building2 },
    { key: 'portuaires', labelKey: 'codeInvestissements.infraPortuaires', itemsKey: 'codeInvestissements.infraPortuairesItems', Icon: Ship },
    { key: 'ferroviaires', labelKey: 'codeInvestissements.infraFerroviaires', itemsKey: 'codeInvestissements.infraFerroviairesItems', Icon: Train },
    { key: 'aeroportuaires', labelKey: 'codeInvestissements.infraAeroportuaires', itemsKey: 'codeInvestissements.infraAeroportuairesItems', Icon: Plane },
  ];

  return (
    <div id="code-investissements" className="mt-32 scroll-mt-24">
      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-[#0A2F73] text-white flex items-center justify-center shadow-lg shrink-0">
          <FolderOpen size={22} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#0A2F73]">
            {t('codeInvestissements.title')}
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#0A2F73]/70 max-w-3xl">
            {t('codeInvestissements.subtitle')}
          </p>
        </div>
      </div>

      {/* Section I - Activités éligibles */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-[#0A2F73] mb-2">{t('codeInvestissements.section1Title')}</h3>
        <p className="text-sm text-[#0A2F73]/60 mb-4">{t('codeInvestissements.section1Intro')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            layout
            className="rounded-2xl border-2 border-[#0A2F73]/15 bg-white overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => {
                setOpenPlancher(openPlancher === 'pl15' ? null : 'pl15');
                setOpenCategory(null);
              }}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-[#0A2F73] hover:bg-[#0A2F73]/5 transition-colors"
            >
              <span className="text-[#E64501] font-black">{t('codeInvestissements.plancher15')}</span>
              {openPlancher === 'pl15' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <AnimatePresence>
              {openPlancher === 'pl15' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-[#0A2F73]/10 overflow-hidden"
                >
                  <div className="p-4 pt-2 space-y-2">
                    {plancher15Categories.map((cat) => (
                      <div key={cat.key}>
                        <button
                          type="button"
                          onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
                          className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-sm font-semibold text-[#0A2F73] hover:bg-[#0A2F73]/10 transition-colors text-left"
                        >
                          {t(cat.labelKey)}
                          {openCategory === cat.key ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <AnimatePresence>
                          {openCategory === cat.key && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 pb-2 space-y-1 text-sm text-[#0A2F73]/90"
                            >
                              {(t(cat.itemsKey, { returnObjects: true }) as string[]).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            layout
            className="rounded-2xl border-2 border-[#0A2F73]/15 bg-white overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => {
                setOpenPlancher(openPlancher === 'pl100' ? null : 'pl100');
                setOpenCategory(null);
              }}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-[#0A2F73] hover:bg-[#0A2F73]/5 transition-colors"
            >
              <span className="text-[#E64501] font-black">{t('codeInvestissements.plancher100')}</span>
              {openPlancher === 'pl100' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <AnimatePresence>
              {openPlancher === 'pl100' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#0A2F73]/10 overflow-hidden"
                >
                  <div className="p-4 pt-2 space-y-2">
                    {plancher100Categories.map((cat) => (
                      <div key={cat.key}>
                        <button
                          type="button"
                          onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
                          className="w-full flex items-center justify-between py-2 px-3 rounded-xl text-sm font-semibold text-[#0A2F73] hover:bg-[#0A2F73]/10 transition-colors text-left"
                        >
                          {t(cat.labelKey)}
                          {openCategory === cat.key ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <AnimatePresence>
                          {openCategory === cat.key && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="pl-4 pb-2 space-y-1 text-sm text-[#0A2F73]/90"
                            >
                              {(t(cat.itemsKey, { returnObjects: true }) as string[]).map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Section II - Infrastructures */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-[#0A2F73] mb-2">{t('codeInvestissements.section2Title')}</h3>
        <p className="text-sm text-[#0A2F73]/60 mb-4">{t('codeInvestissements.section2Intro')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {infraTypes.map(({ key, labelKey, itemsKey, Icon }) => (
            <motion.div
              key={key}
              layout
              className="rounded-2xl border-2 border-[#0A2F73]/15 bg-white overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenInfra(openInfra === key ? null : key)}
                className="w-full flex items-center justify-between gap-2 p-4 text-left font-bold text-[#0A2F73] hover:bg-[#0A2F73]/5 transition-colors"
              >
                <Icon size={20} className="text-[#E64501] shrink-0" />
                <span className="text-sm font-bold truncate">{t(labelKey)}</span>
                {openInfra === key ? <ChevronDown size={18} className="shrink-0" /> : <ChevronRight size={18} className="shrink-0" />}
              </button>
              <AnimatePresence>
                {openInfra === key && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#0A2F73]/10 p-4 space-y-1 text-xs text-[#0A2F73]/90"
                  >
                    {(t(itemsKey, { returnObjects: true }) as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section III - Garanties */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-[#0A2F73] mb-2 flex items-center gap-2">
          <Shield size={20} className="text-[#E64501]" />
          {t('codeInvestissements.section3Title')}
        </h3>
        <ul className="rounded-2xl border-2 border-[#0A2F73]/10 bg-[#F8FAFF] p-4 md:p-6 space-y-2 text-sm text-[#0A2F73]">
          {(t('codeInvestissements.garantiesItems', { returnObjects: true }) as string[]).map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A2F73] mt-1.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Section IV - Avantages */}
      <div>
        <h3 className="text-lg font-bold text-[#0A2F73] mb-2 flex items-center gap-2">
          <Gift size={20} className="text-[#E64501]" />
          {t('codeInvestissements.section4Title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-[#0A2F73]/15 bg-white overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => {
                setOpenAvantage(openAvantage === 'creation' ? null : 'creation');
                setOpenPhase(null);
              }}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-[#0A2F73] hover:bg-[#0A2F73]/5 transition-colors"
            >
              {t('codeInvestissements.creationTitle')}
              {openAvantage === 'creation' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <AnimatePresence>
              {openAvantage === 'creation' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#0A2F73]/10 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-[#0A2F73]/80 italic">{t('codeInvestissements.creationDef')}</p>
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenPhase(openPhase === 'realisation' ? null : 'realisation')}
                        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-[#0A2F73]"
                      >
                        {t('codeInvestissements.phaseRealisation')}
                        {openPhase === 'realisation' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <AnimatePresence>
                        {openPhase === 'realisation' && openAvantage === 'creation' && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 pb-2 space-y-1 text-sm text-[#0A2F73]/90"
                          >
                            {(t('codeInvestissements.avantageCreationRealisation', { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenPhase(openPhase === 'exploitation' ? null : 'exploitation')}
                        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-[#0A2F73]"
                      >
                        {t('codeInvestissements.phaseExploitation')}
                        {openPhase === 'exploitation' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <AnimatePresence>
                        {openPhase === 'exploitation' && openAvantage === 'creation' && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 pb-2 space-y-1 text-sm text-[#0A2F73]/90"
                          >
                            {(t('codeInvestissements.avantageCreationExploitation', { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-2xl border-2 border-[#0A2F73]/15 bg-white overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => {
                setOpenAvantage(openAvantage === 'extension' ? null : 'extension');
                setOpenPhase(null);
              }}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-[#0A2F73] hover:bg-[#0A2F73]/5 transition-colors"
            >
              {t('codeInvestissements.extensionTitle')}
              {openAvantage === 'extension' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <AnimatePresence>
              {openAvantage === 'extension' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[#0A2F73]/10 overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-[#0A2F73]/80 italic">{t('codeInvestissements.extensionDef')}</p>
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenPhase(openPhase === 'realisation' ? null : 'realisation')}
                        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-[#0A2F73]"
                      >
                        {t('codeInvestissements.phaseRealisation')}
                        {openPhase === 'realisation' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <AnimatePresence>
                        {openPhase === 'realisation' && openAvantage === 'extension' && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 pb-2 space-y-1 text-sm text-[#0A2F73]/90"
                          >
                            {(t('codeInvestissements.avantageExtensionRealisation', { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => setOpenPhase(openPhase === 'exploitation' ? null : 'exploitation')}
                        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-[#0A2F73]"
                      >
                        {t('codeInvestissements.phaseExploitation')}
                        {openPhase === 'exploitation' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      <AnimatePresence>
                        {openPhase === 'exploitation' && openAvantage === 'extension' && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 pb-2 space-y-1 text-sm text-[#0A2F73]/90"
                          >
                            {(t('codeInvestissements.avantageExtensionExploitation', { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
