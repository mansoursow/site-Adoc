'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ScrambledText from '@/app/components/ScrambledText';

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
        min-h-[100svh] md:min-h-[100dvh]
        bg-white
      "
    >
      {/* ================= BACKGROUND SLIDER ================= */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {current.type === 'video' ? (
            <motion.video
              key={`video-${index}`}
              src={current.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover object-center"
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
              className="absolute inset-0 h-full w-full object-cover object-center"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
              transition={{ duration: reduceMotion ? 0.35 : 0.9, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        
      </div>

      {/* ================= CONTENT (REMONTÉ EN HAUT) ================= */}
      <div className="relative z-10 flex min-h-[100svh] justify-center px-6 pt-16 md:pt-20">
        <div className="max-w-4xl text-center">
          <ScrambledText
            text="ADOC Audit & Conseil"
            className="text-4xl md:text-6xl font-semibold text-slate-900"
          />

        <p className="mt-4 text-lg md:text-xl font-medium text-[#0A2F73]">
  Cabinet d’audit, conseil et expertise comptable
</p>
        </div>
      </div>

      {/* ================= SCROLL DOWN (REMONTÉ + COULEURS SITE) ================= */}
      <div className="pointer-events-none absolute bottom-28 md:bottom-32 left-0 right-0 z-20 flex justify-center">
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
          aria-label="Descendre pour voir la suite"
        >
          <span className="text-xs font-semibold text-white tracking-wide">
            Découvrir la suite
          </span>

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
