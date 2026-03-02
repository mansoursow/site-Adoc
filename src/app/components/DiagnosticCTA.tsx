'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function DiagnosticCTA() {
  const { t } = useTranslation();

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('openChatWidget'));
  };

  return (
    <section className="relative overflow-hidden">
      {/* Fond élégant Bleu marine / Or */}
      <div className="relative bg-gradient-to-br from-[#0A2F73] via-[#0A2F73] to-[#0D3A8C]">
        {/* Motif décoratif doré subtil */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #E64501 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E64501]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E64501]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              {t('diagnosticCTA.title')}
            </h2>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10">
              {t('diagnosticCTA.text')}
            </p>
            <motion.button
              type="button"
              onClick={handleClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-[#E64501] text-white font-bold text-lg shadow-lg shadow-[#E64501]/30 hover:bg-[#F55A15] hover:shadow-[#E64501]/40 transition-all"
            >
              {t('diagnosticCTA.button')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
