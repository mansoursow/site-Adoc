'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

/**
 * ✅ Charge automatiquement TOUTES les images du dossier "last image".
 * Pas besoin d'importer chaque fichier à la main : si tu ajoutes une image
 * dans le dossier, elle sera prise en compte automatiquement.
 */
const modules = import.meta.glob(
  '../../assets/gallery/last image/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true, import: 'default' }
);

export const LAST_IMAGES: string[] = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map((k) => modules[k] as string);

type Variant = 'slideshow' | 'parallax' | 'fixed';

interface PageBackgroundProps {
  /** Liste d'images (par défaut : tout le dossier "last image") */
  images?: string[];
  /** slideshow = crossfade fixe · parallax = crossfade + défilement · fixed = image unique */
  variant?: Variant;
  /** Opacité des photos (voile clair par-dessus pour la lisibilité) */
  opacity?: number;
  /** Durée entre 2 photos (ms) */
  interval?: number;
  /** Décalage de départ dans la liste (pour varier d'une page à l'autre) */
  offset?: number;
  /** Passe les photos en noir & blanc (look filigrane) */
  grayscale?: boolean;
}

/**
 * Fond d'écran animé, plein écran, placé DERRIÈRE le contenu (z-0).
 * Le contenu de la page doit rester en `relative z-10`.
 *
 * Design : filigrane élégant → photos N&B en fondu enchaîné + léger zoom
 * (effet "Ken Burns") + parallaxe au scroll, le tout sous un voile clair
 * teinté bleu ADOC pour garder les textes parfaitement lisibles.
 */
export function PageBackground({
  images,
  variant = 'slideshow',
  opacity = 0.42,
  interval = 6000,
  offset = 0,
  grayscale = true,
}: PageBackgroundProps) {
  // Réordonne selon l'offset pour éviter que toutes les pages démarrent pareil
  const pics = useMemo(() => {
    const src = images && images.length ? images : LAST_IMAGES;
    if (!src.length) return src;
    const start = ((offset % src.length) + src.length) % src.length;
    return [...src.slice(start), ...src.slice(0, start)];
  }, [images, offset]);

  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Respecte "prefers-reduced-motion"
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Défilement automatique des photos (sauf variante "fixed")
  useEffect(() => {
    if (variant === 'fixed' || reduced) return;
    if (pics.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % pics.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [variant, interval, pics.length, reduced]);

  // Parallaxe : le fond dérive doucement quand on scrolle
  const { scrollY } = useScroll();
  const yDrift = useTransform(scrollY, [0, 1600], [0, variant === 'parallax' ? -120 : -40]);
  const y = reduced ? 0 : yDrift;

  if (!pics.length) return null;

  const current = pics[index];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Couche photo animée */}
      <motion.div className="absolute inset-[-8%]" style={{ y }}>
        <AnimatePresence mode="sync">
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{
              opacity,
              scale: reduced ? 1.05 : 1.02,
            }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{
              opacity: { duration: 1.6, ease: 'easeInOut' },
              scale: { duration: interval / 1000 + 2, ease: 'linear' },
            }}
          >
            <img
              src={current}
              alt=""
              className={`h-full w-full object-cover ${grayscale ? 'grayscale' : ''}`}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Voile clair pour la lisibilité + touches bleu ADOC (effet "waow") */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(1200px 520px at 12% 8%, rgba(63,95,153,0.16), transparent 55%),' +
            'radial-gradient(1000px 520px at 92% 12%, rgba(10,47,115,0.16), transparent 52%),' +
            'radial-gradient(900px 600px at 50% 100%, rgba(230,69,1,0.06), transparent 60%),' +
            'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(255,255,255,0.80) 45%, rgba(255,255,255,0.88))',
        }}
      />

      {/* Vignette douce sur les bords pour le relief */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 62%, rgba(10,47,115,0.10))',
        }}
      />
    </div>
  );
}

export default PageBackground;
