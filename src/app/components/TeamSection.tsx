import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, Mail, X } from 'lucide-react';

// Niveau 1 - Associés
import photoIbrahima from '../../assets/team/ibrahima.png';
import photoAlpha from '../../assets/team/alpha.png';

// Niveau 2 - Stagiaires
import photoMansour from '../../assets/team/mansour.png';
import photoMoustapha from '../../assets/team/moustapha.jpg';
import photoDiouck from '../../assets/team/Diouck.avif';

// Niveau 3 - Équipe
import photoMariama from '../../assets/team/mariama.png';
import photoKine from '../../assets/team/kine.png';
import photoFatousane from '../../assets/team/fatousane.png';
import photoAbdou from '../../assets/team/abdou.png';
import photoAdama from '../../assets/team/adama.jpg';
import photoNdeyeFatou from '../../assets/team/ndeyefatou.png';
import photoNdeyeMaguette from '../../assets/team/ndeyemaguette.jpg';

// Types pour le membre d'équipe
type TeamMember = {
  name: string;
  roleKey: string;
  image: string;
  descriptionKey: string;
  bioKey: string;
  expertiseKey: string;
  email: string;
  linkedin: string;
};

// Niveau 1 : Associés (2 colonnes)
const LEVEL_1_ASSOCIES: TeamMember[] = [
  {
    name: 'Ibrahima Gueye',
    roleKey: 'team.levels.associes.role',
    image: photoIbrahima,
    descriptionKey: 'team.levels.associes.ibrahima.description',
    bioKey: 'team.levels.associes.ibrahima.bio',
    expertiseKey: 'team.levels.associes.ibrahima.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Alpha Gueye',
    roleKey: 'team.levels.associes.role',
    image: photoAlpha,
    descriptionKey: 'team.levels.associes.alpha.description',
    bioKey: 'team.levels.associes.alpha.bio',
    expertiseKey: 'team.levels.associes.alpha.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
];

// Niveau 2 : Experts-Comptables Stagiaires (3 colonnes)
const LEVEL_2_STAGIAIRES: TeamMember[] = [
  {
    name: 'Mansour',
    roleKey: 'team.levels.stagiaires.role',
    image: photoMansour,
    descriptionKey: 'team.levels.stagiaires.mansour.description',
    bioKey: 'team.levels.stagiaires.mansour.bio',
    expertiseKey: 'team.levels.stagiaires.mansour.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Moustapha',
    roleKey: 'team.levels.stagiaires.role',
    image: photoMoustapha,
    descriptionKey: 'team.levels.stagiaires.moustapha.description',
    bioKey: 'team.levels.stagiaires.moustapha.bio',
    expertiseKey: 'team.levels.stagiaires.moustapha.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Diouck',
    roleKey: 'team.levels.stagiaires.role',
    image: photoDiouck,
    descriptionKey: 'team.levels.stagiaires.diouck.description',
    bioKey: 'team.levels.stagiaires.diouck.bio',
    expertiseKey: 'team.levels.stagiaires.diouck.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
];

// Niveau 3 : Reste de l'équipe (grille 4-5 colonnes)
const LEVEL_3_EQUIPE: TeamMember[] = [
  {
    name: 'Mariama Diallo',
    roleKey: 'team.levels.equipe.mariama.role',
    image: photoMariama,
    descriptionKey: 'team.levels.equipe.mariama.description',
    bioKey: 'team.levels.equipe.mariama.bio',
    expertiseKey: 'team.levels.equipe.mariama.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Fatou Kine',
    roleKey: 'team.levels.equipe.fatoukine.role',
    image: photoKine,
    descriptionKey: 'team.levels.equipe.fatoukine.description',
    bioKey: 'team.levels.equipe.fatoukine.bio',
    expertiseKey: 'team.levels.equipe.fatoukine.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Fatou Sane',
    roleKey: 'team.levels.equipe.fatousane.role',
    image: photoFatousane,
    descriptionKey: 'team.levels.equipe.fatousane.description',
    bioKey: 'team.levels.equipe.fatousane.bio',
    expertiseKey: 'team.levels.equipe.fatousane.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Abdou',
    roleKey: 'team.levels.equipe.abdou.role',
    image: photoAbdou,
    descriptionKey: 'team.levels.equipe.abdou.description',
    bioKey: 'team.levels.equipe.abdou.bio',
    expertiseKey: 'team.levels.equipe.abdou.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Adama',
    roleKey: 'team.levels.equipe.adama.role',
    image: photoAdama,
    descriptionKey: 'team.levels.equipe.adama.description',
    bioKey: 'team.levels.equipe.adama.bio',
    expertiseKey: 'team.levels.equipe.adama.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Ndeye Fatou',
    roleKey: 'team.levels.equipe.ndeyefatou.role',
    image: photoNdeyeFatou,
    descriptionKey: 'team.levels.equipe.ndeyefatou.description',
    bioKey: 'team.levels.equipe.ndeyefatou.bio',
    expertiseKey: 'team.levels.equipe.ndeyefatou.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Ndeye Maguette',
    roleKey: 'team.levels.equipe.ndeyemaguette.role',
    image: photoNdeyeMaguette,
    descriptionKey: 'team.levels.equipe.ndeyemaguette.description',
    bioKey: 'team.levels.equipe.ndeyemaguette.bio',
    expertiseKey: 'team.levels.equipe.ndeyemaguette.expertise',
    email: 'contact@adoc.com',
    linkedin: '#',
  },
];

// Liste plate pour le modal (index global)
const ALL_MEMBERS = [...LEVEL_1_ASSOCIES, ...LEVEL_2_STAGIAIRES, ...LEVEL_3_EQUIPE];

function MemberCard({
  member,
  size,
  onClick,
}: {
  member: TeamMember;
  size: 'lg' | 'md' | 'sm';
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const sizeClasses = {
    lg: 'w-44 h-44 sm:w-48 sm:h-48',
    md: 'w-36 h-36 sm:w-40 sm:h-40',
    sm: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}
      className="group cursor-pointer bg-gray-50 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:bg-white transition-all duration-300 border border-transparent hover:border-[#0A2F73]/10 flex flex-col items-center text-center"
    >
      <div
        className={`relative mx-auto rounded-full overflow-hidden flex-shrink-0 mb-3 aspect-square ${sizeClasses[size]}`}
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <span className="text-[#3F5F99] font-bold tracking-wider uppercase text-[10px] sm:text-xs">
        {t(member.roleKey)}
      </span>
      <h3 className="text-base sm:text-lg font-bold text-[#0A2F73] mt-1 mb-1">{member.name}</h3>
      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
        {t(member.descriptionKey)}
      </p>
      <p className="mt-2 text-[10px] sm:text-xs text-[#3F5F99] font-medium">{t('team.hint')}</p>
    </motion.article>
  );
}

export function TeamSection() {
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const expandedMember = expandedIndex !== null ? ALL_MEMBERS[expandedIndex] : null;

  return (
    <section id="team" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0A2F73]">{t('team.title')}</h2>
          <div className="w-20 h-1.5 bg-[#3F5F99] mx-auto mb-6" />
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            {t('team.subtitle')}
          </p>
        </motion.div>

        {/* Structure pyramidale - flex flex-col items-center */}
        <div className="flex flex-col items-center gap-12 md:gap-16">
          {/* Niveau 1 : Associés - 2 colonnes, max-w-2xl */}
          <div className="w-full flex flex-col items-center gap-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3F5F99]">
              {t('team.levels.associes.label')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto w-full">
              {LEVEL_1_ASSOCIES.map((member, i) => (
                <MemberCard
                  key={member.name}
                  member={member}
                  size="lg"
                  onClick={() => setExpandedIndex(ALL_MEMBERS.indexOf(member))}
                />
              ))}
            </div>
          </div>

          {/* Niveau 2 : Stagiaires - 3 colonnes, max-w-3xl */}
          <div className="w-full flex flex-col items-center gap-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3F5F99]">
              {t('team.levels.stagiaires.label')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto w-full">
              {LEVEL_2_STAGIAIRES.map((member) => (
                <MemberCard
                  key={member.name}
                  member={member}
                  size="md"
                  onClick={() => setExpandedIndex(ALL_MEMBERS.indexOf(member))}
                />
              ))}
            </div>
          </div>

          {/* Niveau 3 : Reste de l'équipe - grille 4-5 colonnes */}
          <div className="w-full flex flex-col items-center gap-6">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3F5F99]">
              {t('team.levels.equipe.label')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto w-full">
              {LEVEL_3_EQUIPE.map((member) => (
                <MemberCard
                  key={member.name}
                  member={member}
                  size="sm"
                  onClick={() => setExpandedIndex(ALL_MEMBERS.indexOf(member))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal profil complet */}
      <AnimatePresence>
        {expandedMember && expandedIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
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
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/30"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(null)}
                aria-label={t('team.close')}
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow flex items-center justify-center text-[#0A2F73] hover:bg-[#3F5F99] hover:text-white transition"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[280px] sm:h-[360px] md:h-[480px] min-h-0">
                  <img
                    src={expandedMember.image}
                    alt={expandedMember.name}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2F73]/80 via-[#0A2F73]/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex gap-3">
                    <a
                      href={expandedMember.linkedin}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0A2F73] hover:scale-110 transition-transform"
                    >
                      <Linkedin size={22} />
                    </a>
                    <a
                      href={`mailto:${expandedMember.email}`}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0A2F73] hover:scale-110 transition-transform"
                    >
                      <Mail size={22} />
                    </a>
                  </div>
                </div>

                <div className="p-8 sm:p-10">
                  <span className="text-[#3F5F99] font-bold tracking-[0.25em] uppercase text-sm">
                    {t(expandedMember.roleKey)}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-bold text-[#0A2F73] mt-3">
                    {expandedMember.name}
                  </h3>
                  <p className="mt-6 text-gray-700 text-lg leading-relaxed">
                    {t(expandedMember.bioKey)}
                  </p>
                  {(t(expandedMember.expertiseKey, { returnObjects: true }) as string[])?.length ? (
                    <div className="mt-8">
                      <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        {t('team.expertiseLabel')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(t(expandedMember.expertiseKey, { returnObjects: true }) as string[]).map(
                          (item) => (
                            <span
                              key={item}
                              className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-200"
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-10 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <p className="text-gray-600 italic leading-relaxed">
                      "{t(expandedMember.descriptionKey)}"
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
