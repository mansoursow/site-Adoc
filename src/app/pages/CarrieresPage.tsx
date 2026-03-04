'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export function CarrieresPage() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fonction pour gérer la soumission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulation d'envoi (tu pourras lier ton backend ou Supabase ici)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-[#0A2F73]"
          >
            {t('carrieres.title')}
          </motion.h1>

          <p className="mt-6 max-w-3xl text-[#0A2F73]/80 text-lg leading-relaxed">
            {t('carrieres.intro')}
          </p>

          <div className="mt-10 rounded-3xl border border-[#C9C9C9]/60 p-8 md:p-12 bg-gradient-to-br from-[#0A2F73]/5 via-white to-white shadow-sm">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-[#0A2F73]">{t('carrieres.spontaneousTitle')}</h2>
              <p className="mt-4 text-[#0A2F73]/70">
                {t('carrieres.spontaneousDesc')}
              </p>

              <div className="mt-8">
                <button
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl bg-[#0A2F73] text-white px-8 py-4 font-bold hover:bg-[#3F5F99] transition shadow-lg shadow-[#0A2F73]/20"
                >
                  {t('carrieres.applyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL FORMULAIRE */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay sombre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#0A2F73]/60 backdrop-blur-sm"
            />

            {/* Contenu de la Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-[#0A2F73]">{t('carrieres.modalTitle')}</h3>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                </div>

                {submitted ? (
                  <div className="py-10 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                    <h4 className="text-xl font-bold text-[#0A2F73]">{t('carrieres.thankYou')}</h4>
                    <p className="text-gray-600 mt-2">{t('carrieres.successMessage')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0A2F73] uppercase mb-1">{t('carrieres.lastName')} *</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A2F73] outline-none transition" placeholder={t('carrieres.lastNamePlaceholder')} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0A2F73] uppercase mb-1">{t('carrieres.firstName')} *</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A2F73] outline-none transition" placeholder={t('carrieres.firstNamePlaceholder')} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2F73] uppercase mb-1">{t('carrieres.emailLabel')} *</label>
                      <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A2F73] outline-none transition" placeholder={t('carrieres.emailPlaceholder')} />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2F73] uppercase mb-1">{t('carrieres.coverLetter')}</label>
                      <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0A2F73] outline-none transition" placeholder={t('carrieres.coverLetterPlaceholder')}></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0A2F73] uppercase mb-1">{t('carrieres.cv')}</label>
                      <div className="relative group">
                        <input 
                          required 
                          type="file" 
                          accept=".pdf,.doc,.docx"
                          className="w-full px-4 py-3 rounded-xl border border-dashed border-gray-300 group-hover:border-[#0A2F73] transition cursor-pointer" 
                        />
                      </div>
                    </div>

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full mt-6 bg-[#0A2F73] text-white py-4 rounded-xl font-bold hover:bg-[#3F5F99] transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? t('carrieres.submitting') : t('carrieres.submit')}
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-2">
                      {t('carrieres.requiredNote')}
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}