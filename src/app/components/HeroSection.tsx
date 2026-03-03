'use client';

import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ✅ Images
import hero1 from '../../assets/gallery hero/image2.jpg';



// ✅ Vidéo
import heroVideo from '../../assets/gallery hero/videologo.mp4';

// ✅ Media list (VIDÉO EN PREMIER)
const HERO_MEDIA = [
  { type: 'video' as const, src: heroVideo },
  { type: 'image' as const, src: hero1 },


];

export function HeroSection() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  // ⏱️ gestion du défilement image / vidéo
  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((i) => (i + 1) % HERO_MEDIA.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const current = HERO_MEDIA[index];

  // ⬇️ scroll vers la section suivante
  const goNext = () => {
    const next = document.querySelector('#WhyUsSection'); // 🔁 change l'id si besoin
    if (next) {
      next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="
        relative w-full overflow-hidden
        min-h-[max(600px,85svh)] md:min-h-[100dvh]
        bg-white
      "
    >
      {/* ================= BACKGROUND SLIDER ================= */}
      <div className="absolute inset-0 z-0 min-w-full min-h-full bg-white">
        <AnimatePresence mode="wait">
          {current.type === 'video' ? (
            <motion.video
              key={`video-${index}`}
              src={current.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full min-w-full min-h-full object-contain md:object-cover object-center"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
              transition={{ duration: reduceMotion ? 0.35 : 0.9, ease: 'easeOut' }}
            />
          ) : (
            <motion.img
              key={`image-${index}`}
              src={current.src}
              alt="ADOC background"
              className="absolute inset-0 w-full h-full min-w-full min-h-full object-contain md:object-cover object-center"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
              transition={{ duration: reduceMotion ? 0.35 : 0.9, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ================= CONTENT (en haut pour éviter le chevauchement avec le logo ADO) ================= */}
      <div className="relative z-10 flex flex-col min-h-[max(600px,85svh)] md:min-h-[100dvh] justify-start items-center px-4 sm:px-6 pt-20 pb-4 md:pt-28 md:pb-4 gap-6">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full max-w-2xl mx-auto text-center overflow-hidden">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-[#0A2F73] drop-shadow-sm">
            <Trans
              i18nKey="hero.title"
              components={{ orange: <span className="text-[#E64501]" /> }}
            />
          </h1>

          <p className="text-sm sm:text-base md:text-xl font-medium text-center max-w-md mx-auto leading-relaxed text-[#0A2F73]">
            <Trans
              i18nKey="hero.subtitle"
              components={{ orange: <span className="text-[#E64501] font-semibold" /> }}
            />
          </p>
        </div>
      </div>

      {/* ================= BOUTON DÉCOUVRIR - centré, au-dessus du chat ================= */}
      <div className="pointer-events-none absolute bottom-20 sm:bottom-24 md:bottom-32 left-0 right-0 z-20 flex justify-center">
        <button
          type="button"
          onClick={goNext}
          className="
            pointer-events-auto
            group
            inline-flex flex-col items-center gap-2
            rounded-full
            px-6 py-3
            shadow-lg
            backdrop-blur
            transition
            hover:scale-[1.04]
            focus:outline-none
          "
          style={{
            background: 'linear-gradient(135deg, #0A2F73, #3F5F99)',
          }}
          aria-label={t('hero.discoverAria')}
        >
          <span className="text-xs font-semibold text-white tracking-wide">{t('hero.discover')}</span>

          <motion.span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0A2F73]"
            animate={reduceMotion ? { y: 0 } : { y: [0, 10, 0] }}
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <ChevronDown size={18} />
          </motion.span>
        </button>
      </div>
    </section>
  );
}
