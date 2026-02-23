import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, Mail, ChevronLeft, ChevronRight, X } from 'lucide-react';

import photoIbrahima from '../../assets/team/ibrahima.png';
import photoAlpha from '../../assets/team/alpha.png';
import photoKine from '../../assets/team/kine.png';
import photoMariama from '../../assets/team/mariama.png';
import photofatousane from '../../assets/team/fatousane.png';


const team = [
  {
    name: 'Ibrahima Gueye',
    role: 'Expert-Comptable Associée',
    image: photoIbrahima,
    description: "Plus de 15 ans d'expérience en audit et conseil financier",
    // ✅ Tu peux enrichir ici
    bio: `Ibrahima accompagne les entreprises sur leurs enjeux de fiabilisation financière, d’audit légal et contractuel,
ainsi que sur la structuration des process de contrôle interne.`,
    expertise: ['Audit légal', 'Conseil financier', 'Contrôle interne', 'Reporting'],
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Alpha Gueye',
    role: 'Expert-Comptable Associé',
    image: photoAlpha,
    description: 'Spécialiste en fiscalité et optimisation des entreprises',
    bio: `Alpha intervient sur l’optimisation fiscale, la structuration juridique des groupes et l’accompagnement stratégique
des dirigeants (croissance, restructuration, conformité).`,
    expertise: ['Fiscalité', 'Structuration', 'Optimisation', 'Conseil stratégique'],
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Mariama Diallo',
    role: 'Responsable Audit',
    image: photoMariama,
    description: 'Experte en commissariat aux comptes et contrôle interne',
    bio: `Mariama pilote les missions d’audit, la planification et le suivi qualité, avec une approche orientée risques
et amélioration continue.`,
    expertise: ['Audit', 'CAC', 'Gestion des risques', 'Qualité'],
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Fatou Kine',
    role: 'Auditrice',
    image: photoKine,
    description: 'Spécialiste en paie et gestion des ressources humaines',
    bio: `Fatou intervient sur les missions RH, paie, conformité sociale et l’accompagnement des équipes sur la mise en place
de procédures et outils.`,
    expertise: ['Paie', 'RH', 'Conformité sociale', 'Process'],
    email: 'contact@adoc.com',
    linkedin: '#',
  },
  {
    name: 'Fatou Sane',
    role: 'Auditrice',
    image: photofatousane,
    description: 'Spécialiste en paie et gestion des ressources humaines',
    bio: `Fatou intervient sur les missions RH, paie, conformité sociale et l’accompagnement des équipes sur la mise en place
de procédures et outils.`,
    expertise: ['Paie', 'RH', 'Conformité sociale', 'Process'],
    email: 'contact@adoc.com',
    linkedin: '#',
  },
];

export function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === team.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? team.length - 1 : prevIndex - 1));
  };

  // ✅ fermeture au clavier (ESC)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedIndex(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const member = team[currentIndex];
  const expandedMember = expandedIndex !== null ? team[expandedIndex] : null;

  return (
    <section id="team" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#0A2F73]">Notre Équipe</h2>
          <div className="w-20 h-1.5 bg-[#3F5F99] mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Des experts passionnés à votre service</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Flèche Gauche */}
          <button
            onClick={prevSlide}
            aria-label="Précédent"
            className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-xl text-[#0A2F73] hover:bg-[#3F5F99] hover:text-white transition-all border border-gray-100"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Container du membre actif */}
          <div className="overflow-hidden px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                // ✅ hover group sur toute la carte
                className="group flex flex-col md:flex-row items-center gap-12 bg-gray-50 p-8 rounded-3xl"
                // ✅ desktop hover => open
                onMouseEnter={() => setExpandedIndex(currentIndex)}
                // ✅ mobile/tap => open
                onClick={() => setExpandedIndex(currentIndex)}
                role="button"
                tabIndex={0}
              >
                {/* Image */}
                <div className="w-full md:w-1/2 relative">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="
                        w-full h-[400px] object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-105
                      "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A2F73]/70 to-transparent" />

                    {/* Icônes */}
                    <div className="absolute inset-0 flex items-end justify-center pb-8 gap-6 z-10">
                      <a
                        href={member.linkedin}
                        aria-label="LinkedIn"
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0A2F73] hover:scale-110 transition-transform"
                      >
                        <Linkedin size={22} />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        aria-label="Email"
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#0A2F73] hover:scale-110 transition-transform"
                      >
                        <Mail size={22} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div className="w-full md:w-1/2 text-left">
                  <span className="text-[#3F5F99] font-bold tracking-[0.2em] uppercase text-sm">
                    {member.role}
                  </span>
                  <h3 className="text-3xl font-bold text-[#0A2F73] mt-2 mb-4">{member.name}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-[#3F5F99] pl-6 py-2">
                    "{member.description}"
                  </p>

                  {/* Hint */}
                  <div className="mt-6 text-sm text-gray-500">
                    Survolez / cliquez pour voir le profil complet →
                  </div>

                  {/* Indicateurs */}
                  <div className="flex gap-2 mt-6">
                    {team.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 transition-all duration-300 rounded-full ${
                          index === currentIndex ? 'w-8 bg-[#3F5F99]' : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Flèche Droite */}
          <button
            onClick={nextSlide}
            aria-label="Suivant"
            className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-xl text-[#0A2F73] hover:bg-[#3F5F99] hover:text-white transition-all border border-gray-100"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* ✅ OVERLAY FULLSCREEN (profil complet) */}
    {/* ✅ OVERLAY FULLSCREEN (profil complet) */}
{/* ✅ OVERLAY FULLSCREEN (profil complet) */}
<AnimatePresence>
  {expandedMember && (
    <motion.div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setExpandedIndex(null)}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* modal */}
      <motion.div
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.98, y: 8, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/30"
        onClick={(e) => e.stopPropagation()} 
        onMouseLeave={() => setExpandedIndex(null)} // ✅ Fermeture auto quand la souris sort
      >
        {/* Close */}
        <button
          onClick={() => setExpandedIndex(null)}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white shadow flex items-center justify-center text-[#0A2F73] hover:bg-[#3F5F99] hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: photo big */}
          <div className="relative h-[360px] md:h-[560px]">
            <img
              src={expandedMember.image}
              alt={expandedMember.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2F73]/80 via-[#0A2F73]/30 to-transparent" />

            {/* Actions (LinkedIn / Mail) */}
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

          {/* Right: content (C'est ici que les descriptions reviennent) */}
          <div className="p-8 sm:p-10">
            <span className="text-[#3F5F99] font-bold tracking-[0.25em] uppercase text-sm">
              {expandedMember.role}
            </span>

            <h3 className="text-4xl font-bold text-[#0A2F73] mt-3">
              {expandedMember.name}
            </h3>

            <p className="mt-6 text-gray-700 text-lg leading-relaxed">
              {expandedMember.bio || expandedMember.description}
            </p>

            {/* Domaines d'expertise */}
            {expandedMember.expertise?.length ? (
              <div className="mt-8">
                <div className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                  Domaines d’expertise
                </div>
                <div className="flex flex-wrap gap-2">
                  {expandedMember.expertise.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm border border-gray-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Bloc Citation */}
            <div className="mt-10 p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <p className="text-gray-600 italic leading-relaxed">
                “{expandedMember.description}”
              </p>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              Astuce : Sortez la souris de la fenêtre pour fermer.
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </section>
  );
}
