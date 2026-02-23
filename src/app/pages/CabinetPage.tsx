'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ✅ IMAGES DU CABINET (15)
import image1 from '@/assets/gallery-cabinet/image1.jpg';
import image2 from '@/assets/gallery-cabinet/image2.jpg';
import image3 from '@/assets/gallery-cabinet/image3.jpg';
import image4 from '@/assets/gallery-cabinet/image4.jpg';
import image5 from '@/assets/gallery-cabinet/image5.jpg';
import image10 from '@/assets/gallery-cabinet/image10.jpg';
import image11 from '@/assets/gallery-cabinet/image11.jpg';
import image12 from '@/assets/gallery-cabinet/image12.jpg';
import image13 from '@/assets/gallery-cabinet/image13.jpg';
import image14 from '@/assets/gallery-cabinet/image14.jpg';
import image15 from '@/assets/gallery-cabinet/image15.jpg';

const COLORS = {
  blue: '#0A2F73',
  blue2: '#3F5F99',
  gray: '#C9C9C9',
};

const timeline = [
  { year: '1981', title: 'Création CMG', desc: 'Lancement des activités et structuration des premières missions.' },
  { year: '2000', title: 'Renforcement international', desc: 'Ouverture et consolidation des standards et partenariats.' },
  { year: '2009', title: 'ADOC SA', desc: 'Évolution et structuration sous la marque ADOC.' },
  { year: 'Now', title: 'Cabinet de référence régional', desc: 'Interventions multi-secteurs en Afrique de l’Ouest.' },
];

// ✅ helper : gère Next (objet) et Vite (string)
function toSrc(img: any): string {
  return typeof img === 'string' ? img : img?.src;
}

type FitMode = 'contain' | 'cover';

type CabinetImage = {
  src: string;
  alt: string;
  fit?: FitMode;          // ✅ 'contain' = jamais coupé, 'cover' = plein écran (peut couper)
  pos?: string;           // ✅ object-position : 'center top', 'center 20%', etc.
};

export function CabinetPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // ✅ 15 images (par défaut: contain + position centre)
  // 👉 Tu peux personnaliser uniquement celles qui posent problème (têtes coupées)
  const cabinetImages: CabinetImage[] = [
    { src: toSrc(image1), alt: 'Cabinet — Image 1', fit: 'contain', pos: 'center' },
    { src: toSrc(image2), alt: 'Cabinet — Image 2', fit: 'contain', pos: 'center' },
    { src: toSrc(image3), alt: 'Cabinet — Image 3', fit: 'contain', pos: 'center' },

    // Exemples si certaines images doivent rester en cover mais sans couper les têtes :
    { src: toSrc(image4), alt: 'Cabinet — Image 4', fit: 'cover', pos: 'center 20%' }, // 👈 remonte un peu
    { src: toSrc(image5), alt: 'Cabinet — Image 5', fit: 'contain', pos: 'center' },

    { src: toSrc(image10), alt: 'Cabinet — Image 10', fit: 'contain', pos: 'center' },
    { src: toSrc(image11), alt: 'Cabinet — Image 11', fit: 'contain', pos: 'center' },
    { src: toSrc(image12), alt: 'Cabinet — Image 12', fit: 'contain', pos: 'center' },
    { src: toSrc(image13), alt: 'Cabinet — Image 13', fit: 'contain', pos: 'center' },
    { src: toSrc(image14), alt: 'Cabinet — Image 14', fit: 'contain', pos: 'center' },
    { src: toSrc(image15), alt: 'Cabinet — Image 15', fit: 'contain', pos: 'center' },
  ];

  // ================= CAROUSEL STATE =================
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // ✅ optionnel : toggle pour tester rapidement
  const [globalFit, setGlobalFit] = useState<FitMode>('contain');

  const total = cabinetImages.length;

  const next = () => setSlide((s) => (s + 1) % total);
  const prev = () => setSlide((s) => (s - 1 + total) % total);

  // ✅ autoplay (pause au hover)
  useEffect(() => {
    if (paused) return;
    if (total <= 1) return;

    const t = window.setInterval(() => {
      setSlide((s) => (s + 1) % total);
    }, 3500);

    return () => window.clearInterval(t);
  }, [paused, total]);

  const current = cabinetImages[slide];

  // ✅ fit réel : on prend la config de l’image, sinon le global
  const fit = current.fit ?? globalFit;
  const pos = current.pos ?? 'center';

  return (
    <div className="bg-white">
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          {/* ================= TITRE ================= */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black"
            style={{ color: COLORS.blue }}
          >
            Le Cabinet
          </motion.h1>

          <p className="mt-6 max-w-3xl text-base md:text-lg" style={{ color: 'rgba(10,47,115,0.80)' }}>
           ADOC Audit & Conseil est un cabinet structuré et indépendant, intervenant au Sénégal et dans l’ensemble de la sous‑région ouest‑africaine. Le cabinet accompagne des organisations publiques et privées confrontées à des enjeux complexes de gouvernance, de conformité, de performance et de transformation.

Le positionnement d’ADOC repose sur une conviction centrale : la qualité des décisions dépend directement de la fiabilité de l’information, de la solidité de l’analyse et de l’indépendance du conseil.
          </p>

          {/* ================= CAROUSEL ================= */}
          <div className="mt-12">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: COLORS.blue }}>
                Le cabinet en images
              </h2>

              {/* ✅ Toggle de test */}

            </div>

            <div
              className="relative overflow-hidden rounded-3xl border shadow-sm"
              style={{ borderColor: 'rgba(201,201,201,0.55)' }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* background soft */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    `radial-gradient(900px 320px at 20% 10%, rgba(63,95,153,0.20), transparent 55%),` +
                    `radial-gradient(900px 320px at 90% 20%, rgba(10,47,115,0.18), transparent 50%),` +
                    `linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,255,255,0.90))`,
                }}
              />

              {/* slide */}
              <div className="relative h-[320px] md:h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.src}
                    src={current.src}
                    alt={current.alt}
                    className="absolute inset-0 h-full w-full"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.01 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    onClick={() => setActiveImage(current.src)}
                    style={{
                      cursor: 'pointer',
                      objectFit: fit,          // ✅ contain ou cover
                      objectPosition: pos,     // ✅ centre / top / 20% etc
                      // ✅ pour que le "contain" soit beau : pas de vide “brut”
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.0))',
                    }}
                  />
                </AnimatePresence>

                {/* overlay caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex items-end justify-between gap-3">
                  <div className="text-white">
                    <div className="text-sm md:text-base font-semibold">{current.alt}</div>
                    <div className="text-xs opacity-80 mt-1">
                      {slide + 1} / {total}
                      {paused ? ' • pause' : ' • auto'} • {fit}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveImage(current.src)}
                    className="rounded-full px-4 py-2 text-xs md:text-sm font-semibold bg-white/85 hover:bg-white transition"
                    style={{ color: COLORS.blue }}
                  >
                    Agrandir
                  </button>
                </div>

                {/* arrows */}
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white shadow"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={18} color={COLORS.blue} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 rounded-full p-2 bg-white/80 hover:bg-white shadow"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={18} color={COLORS.blue} />
                </button>

                {/* dots */}
                <div className="absolute right-4 top-4 flex flex-wrap gap-2 max-w-[60%] justify-end">
                  {cabinetImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSlide(i)}
                      className="h-2.5 w-2.5 rounded-full transition"
                      aria-label={`Aller à l'image ${i + 1}`}
                      style={{
                        backgroundColor: i === slide ? COLORS.blue2 : 'rgba(255,255,255,0.55)',
                        boxShadow: i === slide ? '0 0 0 2px rgba(255,255,255,0.40)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm" style={{ color: 'rgba(10,47,115,0.70)' }}>
              Astuce : passe la souris sur le carousel pour mettre en pause. Clique sur une image pour l’agrandir.
            </p>
          </div>

         

          {/* ================= APPROCHE + HISTORIQUE ================= */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div
              className="rounded-2xl p-8 bg-white shadow-sm border"
              style={{ borderColor: 'rgba(201,201,201,0.60)' }}
            >
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: COLORS.blue }}>
                Notre approche
              </h2>
              <ul className="mt-5 space-y-3" style={{ color: 'rgba(10,47,115,0.80)' }}>
                <li>• Rigueur technique & conformité (audit, fiscalité, normes).</li>
                <li>• Compréhension fine des réalités des organisations en Afrique de l’Ouest.</li>
                <li>• Exigence de qualité et confidentialité sur les missions sensibles.</li>
              </ul>
            </div>

            <div
              className="rounded-2xl border p-8"
              style={{
                borderColor: 'rgba(201,201,201,0.60)',
                background:
                  'linear-gradient(180deg, rgba(10,47,115,0.05), rgba(255,255,255,1), rgba(255,255,255,1))',
              }}
            >
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: COLORS.blue }}>
  Historique (<span style={{ color: '#E64501' }}>43 ans</span> d'existence)
</h2>

              <div className="mt-6 relative">
                <div
                  className="absolute left-[5.5rem] top-0 bottom-0 w-px"
                  style={{ backgroundColor: 'rgba(201,201,201,0.70)' }}
                />

                <div className="space-y-7">
                  {timeline.map((it, idx) => (
                    <div key={it.year} className="grid grid-cols-[5.5rem_1fr] gap-6">
                      <div className="text-right font-black pr-2" style={{ color: COLORS.blue }}>
                        {it.year}
                      </div>

                      <div className="relative">
                        <div
                          className="absolute -left-[1.125rem] top-1.5 w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS.blue2 }}
                        />

                        <div className="rounded-xl p-4 bg-white/60 border border-white/40">
                          <div className="font-bold" style={{ color: COLORS.blue }}>
                            {it.title}
                          </div>
                          <div className="text-sm mt-1" style={{ color: 'rgba(10,47,115,0.75)' }}>
                            {it.desc}
                          </div>
                        </div>

                        {idx !== timeline.length - 1 && <div className="h-1" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
           {/* ================= GALERIE ================= */}
          <div className="mt-14">
            <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: COLORS.blue }}>
              Galerie
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cabinetImages.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setActiveImage(img.src)}
                  className="relative cursor-pointer overflow-hidden rounded-2xl shadow-md border group"
                  style={{ borderColor: 'rgba(201,201,201,0.40)' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(10,47,115,0.72), rgba(10,47,115,0.35), transparent)',
                    }}
                  >
                    <span className="text-white text-sm font-medium">{img.alt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= LIGHTBOX FULLSCREEN ================= */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            <motion.img
              src={activeImage}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 max-w-6xl max-h-[85vh] rounded-3xl shadow-2xl object-contain border border-white/20"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
