'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

const REASON_KEYS = ['panafrican', 'tailored', 'rigor', 'partnership'] as const;
const REASON_ICONS = [
  <Globe key="globe" className="text-[#E64501]" size={32} />,
  <Zap key="zap" className="text-[#E64501]" size={32} />,
  <ShieldCheck key="shield" className="text-[#0A2F73]" size={32} />,
  <Users key="users" className="text-[#0A2F73]" size={32} />,
];

export function WhyUsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E64501] mb-4">
              {t('whyUs.badge')}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#0A2F73] leading-tight">
              {t('whyUs.title')}
            </h3>
          </div>
          <p className="text-[#0A2F73]/70 md:max-w-xs text-lg border-l-2 border-[#E64501] pl-4">
            {t('whyUs.tagline')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {REASON_KEYS.map((key, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-transparent hover:border-[#0A2F73]/10 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                {REASON_ICONS[idx]}
              </div>
              <h4 className="text-xl font-bold text-[#0A2F73] mb-3">
                {t(`whyUs.reasons.${key}.title`)}
              </h4>
              <p className="text-[#0A2F73]/70 text-sm leading-relaxed">
                {t(`whyUs.reasons.${key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}