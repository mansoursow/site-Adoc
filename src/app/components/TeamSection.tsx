import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, Linkedin, Mail, X } from 'lucide-react';

import { TEAM_CV } from '@/app/components/team-cv';

// Associés
import photoIbrahima from '../../assets/team/ibrahima.jpg';
import photoAlpha from '../../assets/team/alpha.jpg';

// Experts-comptables stagiaires + chef de mission
import photoMansour from '../../assets/team/mansour.jpg';
import photoMoustapha from '../../assets/team/moustapha.jpg';
import photoDiouck from '../../assets/team/diouck.jpg';
import photoMassamba from '../../assets/team/fall.jpg';

// Collaborateurs
import photoMariame from '../../assets/team/mariam.jpg';
import photoMariama from '../../assets/team/mariama.jpg';
import photoKine from '../../assets/team/kine.jpg';
import photoFatousane from '../../assets/team/fatousane.jpg';
import photoAbdou from '../../assets/team/abdou.jpg';
import photoAdama from '../../assets/team/adama.jpg';
import photoNdeyeFatou from '../../assets/team/ndeyefatou.jpg';
import photoNdeyeMaguette from '../../assets/team/ndeyemaguette.jpg';
import photoKalidou from '../../assets/team/kalidou-kane.jpg';
import photoKhadijatou from '../../assets/team/khadijatou-mbengue.jpg';

type TeamMember = {
  name: string;
  roleKey: string;
  image: string;
  descriptionKey: string;
  bioKey: string;
  expertiseKey: string;
  email: string;
  linkedin: string;
  /** Variables passees a i18n (ex. nombre d'annees d'experience). */
  tVars?: Record<string, string | number>;
};

const EMAIL = 'contact@adoc.com';

/**
 * Debut de carriere d'Ibrahima Gueye : avril 1992, Croix-Rouge francaise
 * (premier poste mentionne sur son CV). L'anciennete se recalcule seule.
 */
const IBRAHIMA_CAREER_START = 1992;
const IBRAHIMA_YEARS = new Date().getFullYear() - IBRAHIMA_CAREER_START;

// ───────────────────────── Niveau 1 : associé en tête
const DIRIGEANT: TeamMember = {
  name: 'Ibrahima Gueye',
  roleKey: 'team.levels.associes.role',
  image: photoIbrahima,
  descriptionKey: 'team.levels.associes.ibrahima.description',
  bioKey: 'team.levels.associes.ibrahima.bio',
  expertiseKey: 'team.levels.associes.ibrahima.expertise',
  email: EMAIL,
  linkedin: '#',
  tVars: { years: IBRAHIMA_YEARS },
};

// ───────────────────────── Niveau 2 : associé
const ASSOCIE: TeamMember = {
  name: 'Alpha Gueye',
  roleKey: 'team.levels.associes.role',
  image: photoAlpha,
  descriptionKey: 'team.levels.associes.alpha.description',
  bioKey: 'team.levels.associes.alpha.bio',
  expertiseKey: 'team.levels.associes.alpha.expertise',
  email: EMAIL,
  linkedin: '#',
};

// ───────────────────────── Niveau 3 : stagiaires + chef de mission
const NIVEAU_3: TeamMember[] = [
  {
    name: 'Mansour',
    roleKey: 'team.levels.stagiaires.role',
    image: photoMansour,
    descriptionKey: 'team.levels.stagiaires.mansour.description',
    bioKey: 'team.levels.stagiaires.mansour.bio',
    expertiseKey: 'team.levels.stagiaires.mansour.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Moustapha',
    roleKey: 'team.levels.stagiaires.role',
    image: photoMoustapha,
    descriptionKey: 'team.levels.stagiaires.moustapha.description',
    bioKey: 'team.levels.stagiaires.moustapha.bio',
    expertiseKey: 'team.levels.stagiaires.moustapha.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Diouck',
    roleKey: 'team.levels.stagiaires.role',
    image: photoDiouck,
    descriptionKey: 'team.levels.stagiaires.diouck.description',
    bioKey: 'team.levels.stagiaires.diouck.bio',
    expertiseKey: 'team.levels.stagiaires.diouck.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Massamba Fall',
    roleKey: 'team.levels.equipe.massamba.role',
    image: photoMassamba,
    descriptionKey: 'team.levels.equipe.massamba.description',
    bioKey: 'team.levels.equipe.massamba.bio',
    expertiseKey: 'team.levels.equipe.massamba.expertise',
    email: EMAIL,
    linkedin: '#',
  },
];

// ───────────────────────── Hors hiérarchie : les collaborateurs
const COLLABORATEURS: TeamMember[] = [
  {
    name: 'Mariama Diallo',
    roleKey: 'team.levels.equipe.mariama.role',
    image: photoMariama,
    descriptionKey: 'team.levels.equipe.mariama.description',
    bioKey: 'team.levels.equipe.mariama.bio',
    expertiseKey: 'team.levels.equipe.mariama.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Fatou Kine',
    roleKey: 'team.levels.equipe.fatoukine.role',
    image: photoKine,
    descriptionKey: 'team.levels.equipe.fatoukine.description',
    bioKey: 'team.levels.equipe.fatoukine.bio',
    expertiseKey: 'team.levels.equipe.fatoukine.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Fatou Sane',
    roleKey: 'team.levels.equipe.fatousane.role',
    image: photoFatousane,
    descriptionKey: 'team.levels.equipe.fatousane.description',
    bioKey: 'team.levels.equipe.fatousane.bio',
    expertiseKey: 'team.levels.equipe.fatousane.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Abdou',
    roleKey: 'team.levels.equipe.abdou.role',
    image: photoAbdou,
    descriptionKey: 'team.levels.equipe.abdou.description',
    bioKey: 'team.levels.equipe.abdou.bio',
    expertiseKey: 'team.levels.equipe.abdou.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Adama',
    roleKey: 'team.levels.equipe.adama.role',
    image: photoAdama,
    descriptionKey: 'team.levels.equipe.adama.description',
    bioKey: 'team.levels.equipe.adama.bio',
    expertiseKey: 'team.levels.equipe.adama.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Ndeye Fatou',
    roleKey: 'team.levels.equipe.ndeyefatou.role',
    image: photoNdeyeFatou,
    descriptionKey: 'team.levels.equipe.ndeyefatou.description',
    bioKey: 'team.levels.equipe.ndeyefatou.bio',
    expertiseKey: 'team.levels.equipe.ndeyefatou.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Ndeye Maguette',
    roleKey: 'team.levels.equipe.ndeyemaguette.role',
    image: photoNdeyeMaguette,
    descriptionKey: 'team.levels.equipe.ndeyemaguette.description',
    bioKey: 'team.levels.equipe.ndeyemaguette.bio',
    expertiseKey: 'team.levels.equipe.ndeyemaguette.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Kalidou Kane',
    roleKey: 'team.levels.equipe.kalidou.role',
    image: photoKalidou,
    descriptionKey: 'team.levels.equipe.kalidou.description',
    bioKey: 'team.levels.equipe.kalidou.bio',
    expertiseKey: 'team.levels.equipe.kalidou.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Khadijatou Mbengue',
    roleKey: 'team.levels.equipe.khadijatou.role',
    image: photoKhadijatou,
    descriptionKey: 'team.levels.equipe.khadijatou.description',
    bioKey: 'team.levels.equipe.khadijatou.bio',
    expertiseKey: 'team.levels.equipe.khadijatou.expertise',
    email: EMAIL,
    linkedin: '#',
  },
  {
    name: 'Mariame Diallo',
    roleKey: 'team.levels.equipe.mariame.role',
    image: photoMariame,
    descriptionKey: 'team.levels.equipe.mariame.description',
    bioKey: 'team.levels.equipe.mariame.bio',
    expertiseKey: 'team.levels.equipe.mariame.expertise',
    email: EMAIL,
    linkedin: '#',
  },
];

// Liste plate : sert d'index unique pour la modale
const ALL_MEMBERS = [DIRIGEANT, ASSOCIE, ...NIVEAU_3, ...COLLABORATEURS];
const indexOf = (member: TeamMember) => ALL_MEMBERS.indexOf(member);

/** Couleur des traits de l'organigramme. */
const LINE = 'bg-[#0A2F73]/25';

type CardSize = 'lg' | 'md' | 'sm';

const AVATAR: Record<CardSize, string> = {
  lg: 'w-32 h-32 sm:w-36 sm:h-36',
  md: 'w-24 h-24 sm:w-28 sm:h-28',
  sm: 'w-24 h-24',
};

function MemberCard({
  member,
  size = 'md',
  onClick,
  highlight = false,
}: {
  member: TeamMember;
  size?: CardSize;
  onClick?: () => void;
  highlight?: boolean;
}) {
  const { t } = useTranslation();
  // Seuls les membres de l'organigramme ont un CV : eux seuls ouvrent une fiche.
  const clickable = Boolean(onClick);

  return (
    <article
      onClick={onClick}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={[
        'group flex h-full flex-col items-center rounded-2xl border bg-white p-4 text-center transition-all duration-300 sm:p-5',
        clickable
          ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5F99]'
          : '',
        highlight
          ? 'border-[#0A2F73]/20 shadow-lg ring-1 ring-[#0A2F73]/10'
          : clickable
            ? 'border-gray-200/80 shadow-sm hover:border-[#0A2F73]/20'
            : 'border-gray-200/80 shadow-sm',
      ].join(' ')}
    >
      <div className={`relative mb-3 aspect-square shrink-0 overflow-hidden rounded-full ${AVATAR[size]}`}>
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F5F99] sm:text-[11px]">
        {t(member.roleKey)}
      </span>
      <h3 className="mt-1 text-sm font-bold text-[#0A2F73] sm:text-base">{member.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-600">
        {t(member.descriptionKey, member.tVars)}
      </p>
      {clickable && (
        <span className="mt-2 text-[10px] font-semibold text-[#3F5F99] opacity-0 transition-opacity group-hover:opacity-100 sm:text-[11px]">
          {t('team.cv.openProfile')} →
        </span>
      )}
    </article>
  );
}

/** Bloc titre de la fiche CV. */
function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h4>
      {children}
    </section>
  );
}

/** Trait vertical entre deux niveaux de l'organigramme. */
function Trunk({ className = '' }: { className?: string }) {
  return <div className={`mx-auto w-px ${LINE} ${className}`} aria-hidden="true" />;
}

export function TeamSection() {
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const expandedMember = expandedIndex !== null ? ALL_MEMBERS[expandedIndex] : null;
  const expandedCv = expandedMember ? TEAM_CV[expandedMember.name] : undefined;

  // ── Carrousel des collaborateurs : défilement natif (scroll-snap), pas de
  //    boucle d'animation JS. On avance d'une carte toutes les 4 s.
  const scrollByCard = useCallback((direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : node.clientWidth * 0.8;
    const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 8;
    if (direction === 1 && atEnd) node.scrollTo({ left: 0, behavior: 'smooth' });
    else node.scrollBy({ left: step * direction, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || expandedMember) return;
    const id = window.setInterval(() => scrollByCard(1), 4000);
    return () => window.clearInterval(id);
  }, [paused, expandedMember, scrollByCard]);

  return (
    <section id="team" className="overflow-hidden bg-white py-20">
      <div className="container mx-auto max-w-full px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold text-[#0A2F73] md:text-5xl">{t('team.title')}</h2>
          <div className="mx-auto mb-6 h-1.5 w-20 bg-[#3F5F99]" />
          <p className="mx-auto max-w-2xl px-2 text-lg text-gray-600 md:text-xl">
            {t('team.subtitle')}
          </p>
        </motion.div>

        {/* ════════════════ ORGANIGRAMME ════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl"
        >
          {/* ── Niveau 1 : associé en tête */}
          <div className="flex justify-center">
            <div className="w-64 max-w-full">
              <MemberCard member={DIRIGEANT} size="lg" highlight onClick={() => setExpandedIndex(indexOf(DIRIGEANT))} />
            </div>
          </div>

          <Trunk className="h-8 md:h-10" />

          {/* ── Niveau 2 : associé */}
          <div className="flex justify-center">
            <div className="w-64 max-w-full">
              <MemberCard member={ASSOCIE} size="lg" highlight onClick={() => setExpandedIndex(indexOf(ASSOCIE))} />
            </div>
          </div>

          <Trunk className="h-8 md:h-10" />

          {/* ── Niveau 3 : stagiaires + chef de mission, sur la même ligne.
                Les cellules sont collées (pas de gap) pour que les traits
                horizontaux se rejoignent ; l'espacement est mis en padding. */}
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {NIVEAU_3.map((member, i) => {
              const isFirst = i === 0;
              const isLast = i === NIVEAU_3.length - 1;
              return (
                <div
                  key={member.name}
                  className={[
                    'relative px-1.5 pt-10 sm:px-3',
                    // Trait horizontal : uniquement quand les 4 cartes tiennent
                    // sur une seule ligne (sm+). En dessous, on garde juste le
                    // tronc vertical, sinon la fourche se dédouble.
                    'before:absolute before:top-0 before:hidden before:h-px before:bg-[#0A2F73]/25 before:content-[""] sm:before:block',
                    isFirst ? 'sm:before:left-1/2 sm:before:right-0' : '',
                    isLast ? 'sm:before:left-0 sm:before:right-1/2' : '',
                    !isFirst && !isLast ? 'sm:before:left-0 sm:before:right-0' : '',
                    // Trait vertical qui descend vers la carte
                    'after:absolute after:left-1/2 after:top-0 after:h-10 after:w-px after:bg-[#0A2F73]/25 after:content-[""]',
                  ].join(' ')}
                >
                  <MemberCard
                    member={member}
                    size="sm"
                    onClick={() => setExpandedIndex(indexOf(member))}
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-[#3F5F99]">
            {t('team.levels.stagiaires.rowLabel')}
          </p>
        </motion.div>

        {/* ════════════════ COLLABORATEURS (hors hiérarchie) ════════════════ */}
        <div className="mt-16 md:mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3F5F99]">
              {t('team.levels.equipe.label')}
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label={t('team.previous')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#0A2F73] transition hover:border-[#0A2F73] hover:bg-[#0A2F73] hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label={t('team.next')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#0A2F73] transition hover:border-[#0A2F73] hover:bg-[#0A2F73] hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={scrollerRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {COLLABORATEURS.map((member) => (
              <div key={member.name} className="w-[220px] shrink-0 snap-start sm:w-[240px]">
                <MemberCard member={member} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════ MODALE PROFIL ════════════════ */}
      <AnimatePresence>
        {expandedMember && expandedIndex !== null && (
          <motion.div
            // au-dessus du ChatWidget (z-9999), sinon la bulle recouvre la fiche
            className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedIndex(null)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/30 bg-white shadow-2xl md:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(null)}
                aria-label={t('team.close')}
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0A2F73] shadow transition hover:bg-[#3F5F99] hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="grid h-full grid-cols-1 md:grid-cols-2">
                <div className="relative h-[280px] min-h-0 sm:h-[360px] md:h-auto md:min-h-[480px]">
                  <img
                    src={expandedMember.image}
                    alt={expandedMember.name}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2F73]/80 via-[#0A2F73]/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex gap-3">
                    <a
                      href={expandedMember.linkedin}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A2F73] transition-transform hover:scale-110"
                    >
                      <Linkedin size={22} />
                    </a>
                    <a
                      href={`mailto:${expandedMember.email}`}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A2F73] transition-transform hover:scale-110"
                    >
                      <Mail size={22} />
                    </a>
                  </div>
                </div>

                <div className="p-8 sm:p-10 md:max-h-[90vh] md:overflow-y-auto">
                  <span className="text-sm font-bold uppercase tracking-[0.25em] text-[#3F5F99]">
                    {t(expandedMember.roleKey)}
                  </span>
                  <h3 className="mt-3 text-3xl font-bold text-[#0A2F73] sm:text-4xl">
                    {expandedCv?.fullName ?? expandedMember.name}
                  </h3>
                  {expandedCv && (
                    <p className="mt-2 text-sm font-medium leading-snug text-[#3F5F99]">
                      {expandedCv.headline}
                    </p>
                  )}

                  <p className="mt-6 leading-relaxed text-gray-700">
                    {t(expandedMember.bioKey, expandedMember.tVars)}
                  </p>

                  {expandedCv && (
                    <>
                      {/* Positionnement : pour les profils que le CV classique dessert */}
                      {expandedCv.profile ? (
                        <div className="mt-6 rounded-2xl border border-[#0A2F73]/10 bg-[#0A2F73]/[0.04] p-5">
                          <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#3F5F99]">
                            {t('team.cv.profile')}
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-700">
                            {expandedCv.profile}
                          </p>
                        </div>
                      ) : null}

                      {/* Competences groupees (double metier) */}
                      {expandedCv.skillGroups?.length ? (
                        <CvSection title={t('team.cv.skills')}>
                          <div className="space-y-5">
                            {expandedCv.skillGroups.map((group) => (
                              <div key={group.label}>
                                <div className="mb-2 text-xs font-semibold text-[#0A2F73]">
                                  {group.label}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {group.items.map((item) => (
                                    <span
                                      key={item}
                                      className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CvSection>
                      ) : null}

                      {/* Realisations */}
                      {expandedCv.highlights?.length ? (
                        <CvSection title={t('team.cv.highlights')}>
                          <ul className="space-y-3">
                            {expandedCv.highlights.map((item) => (
                              <li
                                key={item.title}
                                className="rounded-xl border border-gray-200 bg-white p-4"
                              >
                                <div className="text-sm font-bold text-[#0A2F73]">{item.title}</div>
                                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                  {item.desc}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </CvSection>
                      ) : null}

                      {/* Parcours professionnel */}
                      {expandedCv.experience?.length ? (
                      <CvSection title={t('team.cv.career')}>
                        <ol className="space-y-4 border-l border-gray-200 pl-5">
                          {expandedCv.experience.map((exp) => (
                            <li key={exp.period + exp.org} className="relative">
                              <span
                                className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-[#3F5F99]"
                                aria-hidden="true"
                              />
                              <div className="text-xs font-semibold uppercase tracking-wider text-[#3F5F99]">
                                {exp.period}
                              </div>
                              <div className="mt-0.5 font-bold text-[#0A2F73]">{exp.role}</div>
                              <div className="mt-0.5 text-sm leading-relaxed text-gray-600">
                                {exp.org}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </CvSection>
                      ) : null}

                      {/* Formation */}
                      {expandedCv.education?.length ? (
                      <CvSection title={t('team.cv.education')}>
                        <ul className="space-y-2">
                          {expandedCv.education.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-relaxed text-gray-700"
                            >
                              <span
                                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#3F5F99]"
                                aria-hidden="true"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CvSection>
                      ) : null}

                      {/* Domaines d'intervention (liste plate) */}
                      {expandedCv.skills?.length ? (
                      <CvSection title={t('team.cv.skills')}>
                        <div className="flex flex-wrap gap-2">
                          {expandedCv.skills.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs text-gray-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </CvSection>
                      ) : null}

                      {expandedCv.affiliations?.length ? (
                        <CvSection title={t('team.cv.affiliations')}>
                          <p className="text-sm text-gray-700">
                            {expandedCv.affiliations.join(' · ')}
                          </p>
                        </CvSection>
                      ) : null}

                      {expandedCv.countries?.length ? (
                        <CvSection title={t('team.cv.countries')}>
                          <p className="text-sm text-gray-700">
                            {expandedCv.countries.join(' · ')}
                          </p>
                        </CvSection>
                      ) : null}

                      {expandedCv.languages?.length ? (
                        <CvSection title={t('team.cv.languages')}>
                          <p className="text-sm text-gray-700">
                            {expandedCv.languages.join(' · ')}
                          </p>
                        </CvSection>
                      ) : null}

                      {expandedCv.link ? (
                        <a
                          href={expandedCv.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0A2F73] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3F5F99]"
                        >
                          {t('team.cv.portfolio')}
                          <ExternalLink size={16} />
                        </a>
                      ) : null}
                    </>
                  )}

                  <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="italic leading-relaxed text-gray-600">
                      "{t(expandedMember.descriptionKey, expandedMember.tVars)}"
                    </p>
                  </div>
                  <div className="mt-8 text-sm text-gray-500">{t('team.closeHint')}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
