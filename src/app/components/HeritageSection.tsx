'use client';

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// WebGL (ogl) et canvas de particules : chargés à la demande, et uniquement
// quand la section approche du viewport. Tant qu'elle est hors écran, aucune
// boucle d'animation ne tourne.
const GlowCursor = lazy(() => import('@/app/components/reactbits/GlowCursor'));
const ParticleText = lazy(() => import('@/app/components/reactbits/ParticleText'));

// 🎯 Année de création du cabinet (CMG → ADOC SA)
const FOUNDING_YEAR = 1981;

// 🎨 Orange du glow demandé (react-bits ?color=F97316&secondaryColor=F97316)
const GLOW = '#F97316';
const NAVY = '#061F4D';

type StatProps = {
  value: number;
  label: string;
  suffix?: string;
  animate?: boolean;
  delay?: number;
};

function Stat({ value, label, suffix = '', animate = true, delay = 0 }: StatProps) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(animate && !reduceMotion ? 0 : value);
  const started = useRef(false);

  const run = () => {
    if (started.current) return;
    started.current = true;

    if (!animate || reduceMotion) {
      setDisplay(value);
      return;
    }

    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay }}
      onViewportEnter={run}
      className="relative pl-5 sm:pl-6"
    >
      <span
        className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
        style={{ background: 'linear-gradient(180deg, #F97316, rgba(249,115,22,0.15))' }}
        aria-hidden="true"
      />
      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tabular-nums leading-none">
        {display}
        {suffix ? <span style={{ color: GLOW }}>{suffix}</span> : null}
      </div>
      <div className="mt-2 text-xs sm:text-sm text-white/65 leading-snug max-w-[16rem]">{label}</div>
    </motion.div>
  );
}

/** Wrapper neutre : même boîte que GlowCursor, sans canvas ni boucle d'animation. */
function PlainLayer({ children }: { children?: ReactNode; [prop: string]: unknown }) {
  return (
    <div className="relative h-full w-full min-h-[520px] overflow-hidden md:min-h-[600px]">
      <div className="relative z-[1] h-full w-full">{children}</div>
    </div>
  );
}

export function HeritageSection() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const years = new Date().getFullYear() - FOUNDING_YEAR;

  // 📱 Sur petit écran (ou sans souris), on remplace le canvas de particules
  // par un titre classique : plus lisible et beaucoup plus léger.
  const [pointerFine, setPointerFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)');
    const sync = () => setPointerFine(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // 👀 Rien ne tourne tant que la section n'est pas (presque) à l'écran :
  // ni la boucle WebGL du glow, ni le canvas de particules.
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const MARGIN = 250;
    let timer = 0;

    const measure = () => {
      timer = 0;
      const rect = node.getBoundingClientRect();
      const visible = rect.bottom > -MARGIN && rect.top < window.innerHeight + MARGIN;
      setInView((prev) => (prev === visible ? prev : visible));
    };

    const schedule = () => {
      if (!timer) timer = window.setTimeout(measure, 100);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const headline = t('heritage.headline', { years });
  const animated = inView && !reduceMotion;
  const Layer = animated ? GlowCursor : PlainLayer;

  const staticTitle = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="py-6 text-center text-5xl font-black tracking-tight text-white sm:text-7xl"
      style={{ textShadow: '0 0 40px rgba(249,115,22,0.35)' }}
    >
      {headline}
    </motion.div>
  );

  const content = (
    <>
      {/* Décor : halo bleu + quadrillage discret */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, rgba(63,95,153,0.45) 0%, rgba(6,31,77,0) 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(80% 70% at 50% 40%, #000 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(80% 70% at 50% 40%, #000 0%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative container mx-auto px-4 py-16 sm:px-6 md:py-20">
        {/* ================= EYEBROW ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-white/25 sm:w-14" aria-hidden="true" />
          <span
            className="text-[0.65rem] font-bold uppercase tracking-[0.3em] sm:text-xs"
            style={{ color: GLOW }}
          >
            {t('heritage.eyebrow', { year: FOUNDING_YEAR })}
          </span>
          <span className="h-px w-8 bg-white/25 sm:w-14" aria-hidden="true" />
        </motion.div>

        {/* ================= TITRE EN PARTICULES ================= */}
        <h2 id="heritage-title" className="sr-only">
          {headline} — {t('heritage.lead')}
        </h2>

        <div className="mt-6 flex justify-center md:mt-8">
          {pointerFine && animated ? (
            <Suspense fallback={staticTitle}>
              <ParticleText
                text={headline}
                color="#FFFFFF"
                highlightColor={GLOW}
                particleSize={2.8}
                // density 5 ≈ 35 % de particules en moins qu'en 4, invisible à l'œil.
                density={5}
                scatter={200}
                gatherDuration={1500}
                pointerRepel={45}
                repelRadius={140}
                // glow={false} : le shadowBlur du canvas se paie sur CHAQUE
                // particule à chaque image. Le halo est refait une seule fois
                // par image en CSS (drop-shadow), côté GPU.
                glow={false}
                // idleDrift 0 : sans dérive permanente, la boucle peut s'arrêter
                // une fois le texte formé.
                idleDrift={0}
                fontWeight={900}
                fontSize="clamp(3.5rem, 11vw, 9rem)"
                className="!min-h-[180px] max-w-4xl md:!min-h-[230px]"
                style={{ filter: 'drop-shadow(0 0 14px rgba(249,115,22,0.45))' }}
              />
            </Suspense>
          ) : (
            staticTitle
          )}
        </div>

        {/* ================= PHRASE CLÉ ================= */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-2 max-w-3xl text-center text-base font-medium leading-relaxed text-white/85 sm:text-lg md:mt-4 md:text-2xl"
        >
          {t('heritage.lead')}
        </motion.p>

        {/* ================= CHIFFRES ================= */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 md:mt-16">
          <Stat value={years} suffix="+" label={t('heritage.stats.years')} delay={0} />
          <Stat value={FOUNDING_YEAR} animate={false} label={t('heritage.stats.founded')} delay={0.1} />
          <Stat value={2009} animate={false} label={t('heritage.stats.adoc')} delay={0.2} />
        </div>

        {/* ================= CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-12 flex justify-center md:mt-14"
        >
          <Link
            to="/cabinet"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/[0.12] sm:text-base"
          >
            {t('heritage.cta')}
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
              style={{ backgroundColor: GLOW }}
            >
              <ArrowRight size={16} className="text-[#061F4D]" />
            </span>
          </Link>
        </motion.div>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="heritage"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: NAVY }}
      aria-labelledby="heritage-title"
    >
      <Suspense fallback={<PlainLayer>{content}</PlainLayer>}>
        <Layer
          color={GLOW}
          secondaryColor={GLOW}
          blendMode="screen"
          trailLength={28}
          trailWidth={12}
          glowIntensity={2.4}
          glowSpread={1.5}
          hotspot={0.22}
          brightness={0.95}
          opacity={1}
          className="min-h-[520px] md:min-h-[600px]"
        >
          {content}
        </Layer>
      </Suspense>
    </section>
  );
}
