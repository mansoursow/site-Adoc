'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

type OpenChapter = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5' | null;

export function StartupActSection() {
  const { t } = useTranslation();
  const [openChapter, setOpenChapter] = useState<OpenChapter>(null);

  const chapters: { id: OpenChapter; titleKey: string }[] = [
    { id: 'ch1', titleKey: 'startupAct.ch1Title' },
    { id: 'ch2', titleKey: 'startupAct.ch2Title' },
    { id: 'ch3', titleKey: 'startupAct.ch3Title' },
    { id: 'ch4', titleKey: 'startupAct.ch4Title' },
    { id: 'ch5', titleKey: 'startupAct.ch5Title' },
  ];

  const renderArticle = (num: string, content: string) => (
    <div key={num} className="mb-4">
      <span className="font-black text-[#0A2F73] text-sm">{num}</span>
      <p className="mt-1 text-[#0A2F73]/90 text-sm leading-relaxed">{content}</p>
    </div>
  );

  const renderArticleWithItems = (num: string, introKey: string, itemsKey: string) => (
    <div key={num} className="mb-4">
      <span className="font-black text-[#0A2F73] text-sm">{num}</span>
      <p className="mt-1 text-[#0A2F73]/90 text-sm leading-relaxed">{t(introKey)}</p>
      <ul className="mt-2 pl-4 space-y-1 text-sm text-[#0A2F73]/90">
        {(t(itemsKey, { returnObjects: true }) as string[]).map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div id="startup-act" className="mt-32 scroll-mt-24">
      <div className="flex items-start gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-[#0A2F73] text-white flex items-center justify-center shadow-lg shrink-0">
          <BookOpen size={22} />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-[#0A2F73]">
            {t('startupAct.title')}
          </h2>
          <p className="mt-2 text-sm md:text-base text-[#0A2F73]/70 max-w-3xl">
            {t('startupAct.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="rounded-2xl border-2 border-[#0A2F73]/15 bg-white overflow-hidden shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpenChapter(openChapter === ch.id ? null : ch.id)}
              className="w-full flex items-center justify-between p-4 text-left font-bold text-[#0A2F73] hover:bg-[#0A2F73]/5 transition-colors"
            >
              <span>{t(ch.titleKey)}</span>
              {openChapter === ch.id ? (
                <ChevronDown size={20} className="text-[#E64501]" />
              ) : (
                <ChevronRight size={20} className="text-[#E64501]" />
              )}
            </button>
            <AnimatePresence>
              {openChapter === ch.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-[#0A2F73]/10 overflow-hidden"
                >
                  <div className="p-6 pt-4 space-y-2">
                    {ch.id === 'ch1' && (
                      <>
                        {renderArticle('Article 1', t('startupAct.art1'))}
                        {renderArticle('Article 2', t('startupAct.art2'))}
                        <div className="mb-4">
                          <span className="font-black text-[#0A2F73] text-sm">Article 3</span>
                          <p className="mt-1 text-[#0A2F73]/90 text-sm">{t('startupAct.art3Def')}</p>
                          <ul className="mt-2 pl-4 space-y-1 text-sm text-[#0A2F73]/90">
                            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />{t('startupAct.art3Promoteur')}</li>
                            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />{t('startupAct.art3Startup')}</li>
                            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />{t('startupAct.art3Enregistree')}</li>
                            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />{t('startupAct.art3Labellee')}</li>
                          </ul>
                        </div>
                      </>
                    )}
                    {ch.id === 'ch2' && (
                      <>
                        {renderArticle('Article 4', t('startupAct.art4'))}
                        {renderArticle('Article 5', t('startupAct.art5'))}
                        {renderArticle('Article 6', t('startupAct.art6'))}
                        {renderArticle('Article 7', t('startupAct.art7'))}
                      </>
                    )}
                    {ch.id === 'ch3' && (
                      <>
                        {renderArticleWithItems('Article 8', 'startupAct.art8Intro', 'startupAct.art8Items')}
                        {renderArticle('Article 9', t('startupAct.art9'))}
                        <div className="mb-4">
                          <span className="font-black text-[#0A2F73] text-sm">Article 10</span>
                          <ul className="mt-2 pl-4 space-y-1 text-sm text-[#0A2F73]/90">
                            {(t('startupAct.art10Items', { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />{item}</li>
                            ))}
                          </ul>
                          <p className="mt-3 text-sm text-[#0A2F73]/90">{t('startupAct.art10Social')}</p>
                          <p className="mt-1 text-sm text-[#0A2F73]/90">{t('startupAct.art10Fiscal')}</p>
                        </div>
                        {renderArticle('Article 11', t('startupAct.art11'))}
                        <div className="mb-4">
                          <span className="font-black text-[#0A2F73] text-sm">Article 12</span>
                          <p className="mt-1 text-sm text-[#0A2F73]/90">{t('startupAct.art12Intro')}</p>
                          <ul className="mt-2 pl-4 space-y-1 text-sm text-[#0A2F73]/90">
                            {(t('startupAct.art12Items', { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#E64501] mt-1.5 shrink-0" />{item}</li>
                            ))}
                          </ul>
                          <p className="mt-2 text-sm text-[#0A2F73]/90">{t('startupAct.art12Douane')}</p>
                        </div>
                        <div className="mb-4">
                          <span className="font-black text-[#0A2F73] text-sm">Article 13</span>
                          <p className="mt-1 text-sm text-[#0A2F73]/90">{t('startupAct.art13Intro')}</p>
                          <p className="mt-2 text-sm text-[#0A2F73]/90">{t('startupAct.art13Marge')}</p>
                          <p className="mt-2 text-sm text-[#0A2F73]/90">{t('startupAct.art13SousTraitance')}</p>
                        </div>
                        {renderArticle('Article 14', t('startupAct.art14'))}
                      </>
                    )}
                    {ch.id === 'ch4' && (
                      <>
                        {renderArticle('Article 15', t('startupAct.art15'))}
                        {renderArticle('Article 16', t('startupAct.art16'))}
                        {renderArticle('Article 17', t('startupAct.art17'))}
                      </>
                    )}
                    {ch.id === 'ch5' && (
                      <>
                        {renderArticle('Article 18', t('startupAct.art18'))}
                        {renderArticle('Article 19', t('startupAct.art19'))}
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
