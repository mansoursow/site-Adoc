'use client';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, FileSpreadsheet, Percent, BarChart3, ArrowRight } from 'lucide-react';

const TOOLS = [
  {
    key: 'pay',
    icon: Calculator,
    to: '/publications#paie',
  },
  {
    key: 'tax',
    icon: FileSpreadsheet,
    to: '/publications#impot',
  },
  {
    key: 'tegtaeg',
    icon: Percent,
    to: '/publications#tegtaeg',
  },
  {
    key: 'ratios',
    icon: BarChart3,
    to: '/publications#ratios',
  },
] as const;

export function ToolsSimulationSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openChatWidget = () => {
    window.dispatchEvent(new CustomEvent('openChatWidget'));
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-[#0A2F73] tracking-tight mb-6">
            {t('toolsSimulation.title')}
          </h2>
          <p className="text-lg md:text-xl text-[#0A2F73]/75 leading-relaxed">
            {t('toolsSimulation.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.article
                key={tool.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#0A2F73]/5 hover:shadow-xl hover:border-[#0A2F73]/15 transition-all duration-300 flex flex-col min-w-0"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 text-[#0A2F73] group-hover:bg-[#0A2F73]/5 group-hover:text-[#E64501] transition-colors">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#0A2F73] mb-3">
                  {t(`toolsSimulation.tools.${tool.key}.title`)}
                </h3>
                <p className="text-[#0A2F73]/70 text-sm leading-relaxed mb-6 flex-grow">
                  {t(`toolsSimulation.tools.${tool.key}.desc`)}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(tool.to)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-[#0A2F73] text-white hover:bg-[#E64501] transition-colors w-fit"
                >
                  {t('toolsSimulation.tryTool')}
                  <ArrowRight size={16} />
                </button>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={openChatWidget}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[#0A2F73] bg-transparent border-2 border-[#0A2F73]/20 hover:border-[#E64501] hover:text-[#E64501] hover:bg-[#E64501]/5 transition-all duration-300"
          >
            {t('toolsSimulation.ctaExpert')}
          </button>
        </div>
      </div>
    </section>
  );
}
