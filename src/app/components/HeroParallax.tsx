'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// L'ajout de "default" ici règle l'erreur d'import dans App.tsx
export default function HeroParallax() {
  const ref = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // --- EFFETS DE PROFONDEUR ---
  const yImage = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={ref} 
      className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center bg-[#0A2F73]"
    >
      {/* 1. COUCHE DE FOND : Image avec effet Double Exposition */}
      <motion.div 
        style={{ y: yImage }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2F73]/80 via-transparent to-[#0A2F73]/80 z-10" />
        
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" 
          alt="Vision technologique"
          className="w-full h-[130%] object-cover opacity-30 mix-blend-overlay" 
        />
      </motion.div>

      {/* 2. COUCHE DE CONTENU : Texte et Accents */}
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-20 text-center px-4"
      >
        <h2 className="text-5xl md:text-8xl font-black text-[#C9C9C9] tracking-tighter mb-6 leading-none">
          L'AUDACE <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F5F99] to-[#0A2F73]">
            DIGITALE
          </span>
        </h2>
        
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="h-[1px] w-12 md:w-24 bg-[#3F5F99]" />
          <p className="text-[#C9C9C9] text-xs md:text-sm font-light tracking-[0.4em] uppercase">
            Solutions sur mesure avec l'IA
          </p>
          <div className="h-[1px] w-12 md:w-24 bg-[#3F5F99]" />
        </div>
        
        <div className="mt-12">
          <button className="group relative px-8 py-3 overflow-hidden rounded-full bg-transparent border border-[#C9C9C9] text-[#C9C9C9] transition-all hover:border-[#3F5F99]">
            <span className="relative z-10 font-bold text-xs tracking-widest uppercase group-hover:text-white transition-colors">
              Explorer le projet
            </span>
            <div className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-[#3F5F99] to-[#0A2F73] transition-transform duration-300 group-hover:translate-y-0" />
          </button>
        </div>
      </motion.div>

      {/* 3. TRANSITIONS DE SECTION */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white to-transparent z-20 opacity-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
}