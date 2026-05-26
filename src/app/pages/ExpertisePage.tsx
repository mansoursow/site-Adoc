import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import watermarkImage from '@/assets/gallery hero/image4.jpg';

const pillars = [
  {
    id: 'sur-mesure',
    number: '01',
    title: 'Approche Sur-Mesure',
    intro:
      "Chez ADOC Consulting, chaque mission est conçue selon les spécificités, les enjeux et les objectifs propres à nos clients. Nous considérons qu'aucune organisation ne peut être traitée à travers des solutions standardisées ou des approches génériques.",
    body: [
      {
        type: 'paragraph',
        text: "Notre démarche repose sur une analyse approfondie des besoins, des contraintes opérationnelles et du contexte stratégique afin de construire des solutions adaptées, pragmatiques et directement opérationnelles.",
      },
      {
        type: 'label',
        text: 'Cette approche personnalisée permet :',
      },
      {
        type: 'bullets',
        items: [
          "une meilleure compréhension des enjeux métiers ;",
          "des recommandations concrètes et applicables ;",
          "une forte appropriation des solutions par les équipes ;",
          "une amélioration durable de la performance et de la gouvernance.",
        ],
      },
      {
        type: 'paragraph',
        text: "Nous mobilisons des équipes pluridisciplinaires capables d'intégrer à la fois les dimensions financières, organisationnelles, réglementaires, technologiques et stratégiques de chaque mission.",
      },
      {
        type: 'paragraph',
        text: "ADOC Consulting privilégie ainsi une approche agile, collaborative et orientée impact afin d'apporter des réponses à forte valeur ajoutée adaptées aux réalités de chaque organisation.",
      },
    ],
  },
  {
    id: 'rigueur',
    number: '02',
    title: 'Rigueur & Conformité',
    intro:
      "Chez ADOC Consulting, la rigueur constitue le fondement de chacune de nos interventions. Nos méthodologies s'appuient sur les meilleures pratiques internationales en matière d'audit, de contrôle interne, de gestion des risques et de conformité réglementaire.",
    body: [
      {
        type: 'paragraph',
        text: "Nous accompagnons les entreprises, institutions financières, structures publiques et organisations internationales dans la sécurisation de leurs opérations financières, fiscales et administratives. Notre approche vise à garantir la fiabilité de l'information financière, la conformité réglementaire et la maîtrise des risques opérationnels.",
      },
      {
        type: 'paragraph',
        text: "Grâce à une approche structurée et indépendante, nous aidons nos clients à renforcer leur gouvernance, améliorer leurs dispositifs de contrôle interne et prévenir les risques de fraude, de non-conformité et de défaillance organisationnelle.",
      },
      {
        type: 'label',
        text: 'Nos équipes interviennent notamment sur :',
      },
      {
        type: 'bullets',
        items: [
          "les audits financiers et réglementaires ;",
          "la conformité OHADA, fiscale et prudentielle ;",
          "les dispositifs de contrôle interne ;",
          "la gestion des risques ;",
          "les audits de conformité et d'investigation ;",
          "la sécurisation des processus financiers et opérationnels.",
        ],
      },
      {
        type: 'paragraph',
        text: "ADOC Consulting place ainsi la confiance, l'éthique et la transparence au cœur de ses engagements.",
      },
    ],
  },
  {
    id: 'partenariat',
    number: '03',
    title: 'Partenariat Durable',
    intro:
      "ADOC Consulting développe avec ses clients des relations fondées sur la confiance, la proximité et la création de valeur à long terme. Au-delà d'une prestation ponctuelle, nous nous positionnons comme un partenaire stratégique engagé aux côtés des dirigeants et des institutions dans leurs projets de transformation et de développement.",
    body: [
      {
        type: 'paragraph',
        text: "Notre approche privilégie une compréhension approfondie des enjeux de chaque organisation afin de proposer des solutions adaptées, réalistes et durables. Nous accompagnons nos clients dans leurs décisions stratégiques en leur apportant une expertise multidisciplinaire et une vision orientée résultats.",
      },
      {
        type: 'label',
        text: 'Cette relation de partenariat repose sur :',
      },
      {
        type: 'bullets',
        items: [
          "une forte implication des équipes dirigeantes ;",
          "une approche collaborative et pragmatique ;",
          "une disponibilité permanente ;",
          "une confidentialité absolue ;",
          "un accompagnement continu dans le temps.",
        ],
      },
      {
        type: 'paragraph',
        text: "Notre objectif est d'établir des relations de confiance durables permettant à nos clients de sécuriser leur croissance, renforcer leur gouvernance et améliorer durablement leurs performances.",
      },
    ],
  },
  {
    id: 'panafricaine',
    number: '04',
    title: 'Expertise Panafricaine',
    intro:
      "ADOC Consulting dispose d'une expérience reconnue dans l'accompagnement des organisations opérant en Afrique de l'Ouest et en Afrique centrale. Grâce à une parfaite maîtrise des environnements réglementaires, économiques et institutionnels africains, le cabinet accompagne ses clients dans leurs projets de développement régional et transfrontalier.",
    body: [
      {
        type: 'label',
        text: "Nos équipes interviennent dans plusieurs secteurs stratégiques :",
      },
      {
        type: 'bullets',
        items: [
          "énergie et ressources naturelles ;",
          "secteur public et parapublic ;",
          "banques et institutions financières ;",
          "infrastructures et projets de développement ;",
          "télécommunications ;",
          "industries et services.",
        ],
      },
      {
        type: 'label',
        text: "Notre expertise couvre notamment les espaces :",
      },
      {
        type: 'bullets',
        items: [
          "UEMOA ;",
          "CEMAC ;",
          "OHADA ;",
          "projets financés par les bailleurs internationaux.",
        ],
      },
      {
        type: 'paragraph',
        text: "Cette présence régionale nous permet de proposer des solutions adaptées aux réalités locales tout en respectant les standards internationaux de qualité, de gouvernance et de performance.",
      },
      {
        type: 'paragraph',
        text: "ADOC Consulting met ainsi à disposition de ses clients une expertise panafricaine combinant proximité terrain, vision stratégique et excellence technique.",
      },
    ],
  },
];

type BodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'label'; text: string }
  | { type: 'bullets'; items: string[] };

function PillarCard({ pillar, index }: { pillar: typeof pillars[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="group relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 overflow-hidden transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Barre supérieure orange → bleu */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E64501] via-[#E64501] to-[#0A2F73]" />

      <div className="p-8">
        {/* Numéro + Titre */}
        <div className="flex items-start gap-5 mb-5">
          <span className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#E64501] to-[#bf3800] text-white text-sm font-black shadow-md">
            {pillar.number}
          </span>
          <h2 className="text-2xl font-black text-[#0A2F73] leading-tight pt-1">
            {pillar.title}
          </h2>
        </div>

        {/* Séparateur orange */}
        <div className="w-12 h-[3px] bg-[#E64501] rounded-full mb-5" />

        {/* Intro — toujours visible */}
        <p className="text-gray-700 leading-relaxed text-[0.95rem]">{pillar.intro}</p>

        {/* Contenu expandable */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
                {(pillar.body as BodyBlock[]).map((block, i) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p key={i} className="text-gray-700 leading-relaxed text-[0.95rem]">
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'label') {
                    return (
                      <p key={i} className="text-[#0A2F73] font-semibold text-[0.95rem] mt-2">
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === 'bullets') {
                    return (
                      <ul key={i} className="space-y-2 pl-1">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-gray-700 text-[0.9rem]">
                            <span className="mt-[6px] w-2 h-2 rounded-full bg-[#E64501] shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#E64501] hover:text-[#F55A15] transition-colors duration-200"
          aria-expanded={open}
        >
          <span>{open ? 'Réduire' : 'Lire la suite'}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 6L8 11L13 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </button>
      </div>
    </motion.div>
  );
}

export function ExpertisePage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      {/* Filigrane background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src={watermarkImage}
          alt=""
          className="w-full h-full object-cover opacity-[0.35] grayscale"
        />
        <div className="absolute inset-0 bg-white/25" />
      </div>

      {/* Dégradé supérieur */}
      <div className="fixed top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#0A2F73]/12 to-transparent z-0 pointer-events-none" />

      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-6">

          {/* En-tête */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <p className="text-sm font-semibold tracking-widest uppercase mb-3">
              <span className="text-[#E64501]">ADOC</span>
              <span className="text-[#0A2F73]"> CONSULTING — Advisory · Audit · Strategy</span>
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-[#0A2F73] mb-4">
              {t('expertisePage.title')}
            </h1>
            <div className="w-16 h-1 bg-[#E64501] rounded-full" />
          </motion.div>

          {/* Grille 4 piliers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar, i) => (
              <PillarCard key={pillar.id} pillar={pillar} index={i} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/references"
              className="inline-flex items-center justify-center rounded-xl bg-[#0A2F73] text-white px-8 py-4 font-bold hover:bg-[#1a4a9e] transition shadow-lg"
            >
              {t('expertisePage.seeReferences')}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#E64501] text-[#E64501] bg-white/30 backdrop-blur-md px-8 py-4 font-bold hover:bg-[#E64501]/5 transition"
            >
              {t('expertisePage.requestMeeting')}
            </Link>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
