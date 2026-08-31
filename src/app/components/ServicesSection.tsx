import { motion } from 'motion/react';
import auditIcon from '@/assets/icone/audit.png';
import expertiseIcon from '@/assets/icone/expertise.png';
import conseilIcon from '@/assets/icone/conseil.png';
import restructurationIcon from '@/assets/icone/restructuration.png';
import secteurPublicIcon from '@/assets/icone/secteur-public.png';
import systemeInfoIcon from '@/assets/icone/systeme-info.png';

const services = [
  {
    id: 'strategie',
    title: 'STRATÉGIE & PERFORMANCE',
    icon: conseilIcon,
    accentFrom: '#0A2F73',
    accentTo: '#1a4a9e',
    items: [
      'Conseil stratégique et plans de développement',
      'Transformation et restructuration d\'entreprises',
      'Modélisation financière et business plans',
      'Évaluation d\'entreprises et due diligence',
      'Project finance et montages PPP',
      'Tableaux de bord et pilotage de la performance',
      'Accompagnement des directions générales',
    ],
  },
  {
    id: 'audit',
    title: 'AUDIT & ASSURANCE',
    icon: auditIcon,
    accentFrom: '#0c3580',
    accentTo: '#1d55b5',
    items: [
      'Commissariat aux comptes (OHADA / IFRS)',
      'Audit de performance et d\'efficacité',
      'Audit d\'investigation et forensic',
      'Audit des marchés publics',
      'Revue des systèmes de contrôle interne',
      'Audits spéciaux bailleurs de fonds',
    ],
  },
  {
    id: 'risques',
    title: 'RISQUES, GOUVERNANCE ET CONFORMITÉ',
    icon: restructurationIcon,
    accentFrom: '#102a6e',
    accentTo: '#2050a8',
    items: [
      'Cartographie et gestion des risques',
      'Gouvernance d\'entreprise et institutionnelle',
      'Conformité réglementaire (OHADA / BCEAO)',
      'Audit interne et dispositifs anti-fraude',
      'Politiques et gouvernance publique',
      'Études macro-économiques et sectorielles',
    ],
  },
  {
    id: 'public',
    title: 'SECTEUR PUBLIC ET DÉVELOPPEMENT',
    icon: secteurPublicIcon,
    accentFrom: '#083468',
    accentTo: '#154a96',
    items: [
      'Missions bailleurs de fonds (Banque mondiale, BAD, UE, BOAD…)',
      'Évaluation de programmes et projets de développement',
      'Audit des finances publiques',
      'Appui institutionnel et renforcement de capacités',
    ],
  },
  {
    id: 'capital',
    title: 'CAPITAL HUMAIN ET TRANSFORMATION',
    icon: systemeInfoIcon,
    accentFrom: '#0e3a88',
    accentTo: '#2560bc',
    items: [
      'Diagnostic et transformation organisationnelle',
      'Conduite du changement',
      'Externalisation DAF / Direction audit interne',
      'Formation des dirigeants et équipes',
      'Manuels de procédures et organigrammes',
    ],
  },
  {
    id: 'expertise',
    title: 'EXPERTISE COMPTABLE ET FISCALE',
    icon: expertiseIcon,
    accentFrom: '#0b3177',
    accentTo: '#1c4faa',
    items: [
      'Tenue et surveillance comptable (SYSCOHADA)',
      'Établissement des comptes annuels',
      'Déclarations fiscales et sociales',
      'Consolidation des comptes',
      'Expertise judiciaire et agence fiduciaire',
    ],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-widest uppercase mb-3">
            <span className="text-orange-500">ADOC</span>
            <span className="text-[#0A2F73]"> CONSULTING — Advisory · Audit · Strategy</span>
          </p>
          <h2 className="text-3xl md:text-5xl mb-4 text-[#0A2F73]">Nos Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Partenaire stratégique de la performance et de la gouvernance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 cursor-default"
            >
              {/* Header — toujours visible */}
              <div
                className="relative p-8 flex flex-col items-start gap-4 transition-all duration-500"
                style={{ background: `linear-gradient(135deg, ${service.accentFrom}, ${service.accentTo})` }}
              >
                {/* Icône */}
                <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/15 group-hover:bg-white/25 transition-colors duration-300 shrink-0">
                  <img
                    src={service.icon}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 object-contain brightness-0 invert"
                  />
                </div>

                {/* Titre */}
                <h3 className="text-white text-lg font-bold leading-snug tracking-wide">
                  {service.title}
                </h3>

                {/* Indicateur hover */}
                <span className="text-white/50 text-xs group-hover:opacity-0 transition-opacity duration-300">
                  Survolez pour découvrir →
                </span>
              </div>

              {/* Contenu — révélé au survol */}
              <div
                className="
                  max-h-0 overflow-hidden
                  group-hover:max-h-[480px]
                  transition-[max-height] duration-500 ease-in-out
                  bg-white
                "
              >
                <ul className="px-7 py-6 space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: service.accentFrom }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Barre décorative basse */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${service.accentFrom}, ${service.accentTo})` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
