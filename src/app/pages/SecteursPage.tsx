'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Zap, 
  BarChart3, 
  Cpu, 
  Factory, 
  Stethoscope, 
  Hotel, 
  Users2,
  Plus 
} from 'lucide-react';

const sectors = [
  {
    fullTitle: 'Institutions & Projets de développement',
    desc: 'Audit de projets financés par les bailleurs de fonds (Banque Mondiale, BAD) et accompagnement des organismes publics.',
    icon: <Building2 size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Énergie, mines & ressources naturelles',
    desc: 'Expertise fiscale et réglementaire pour les industries extractives et les projets d’énergies renouvelables.',
    icon: <Zap size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Finance & assurance',
    desc: 'Audit légal, revue de conformité et gestion des risques pour les établissements financiers.',
    icon: <BarChart3 size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Télécoms & technologies',
    desc: 'Accompagnement des startups et opérateurs dans leur structuration financière et digitale.',
    icon: <Cpu size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Industrie & BTP',
    desc: 'Optimisation des coûts de revient, audit de chantiers et gestion du cycle d’exploitation.',
    icon: <Factory size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Santé & services sociaux',
    desc: 'Conseil stratégique pour les cliniques : gestion budgétaire et conformité sociale.',
    icon: <Stethoscope size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Hôtellerie & immobilier',
    desc: 'Structuration de véhicules d’investissement immobilier et audit de gestion hôtelière.',
    icon: <Hotel size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'PME & groupes familiaux',
    desc: 'Transmission d’entreprise, gouvernance familiale et externalisation comptable.',
    icon: <Users2 size={32} strokeWidth={1.5} />
  },
];

export function SecteursPage() {
  const { t } = useTranslation();
  const sectorsData = t('secteursPage.sectors', { returnObjects: true }) as { fullTitle: string; desc: string }[];
  const sectors = sectorsData.map((s, i) => ({
    ...s,
    icon: [<Building2 size={32} strokeWidth={1.5} key="1" />, <Zap size={32} strokeWidth={1.5} key="2" />, <BarChart3 size={32} strokeWidth={1.5} key="3" />, <Cpu size={32} strokeWidth={1.5} key="4" />, <Factory size={32} strokeWidth={1.5} key="5" />, <Stethoscope size={32} strokeWidth={1.5} key="6" />, <Hotel size={32} strokeWidth={1.5} key="7" />, <Users2 size={32} strokeWidth={1.5} key="8" />][i]
  }));
  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-[#0A2F73] tracking-tight">
              {t('secteursPage.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-[#0A2F73]/70 text-lg">
              {t('secteursPage.subtitle')}{' '}
              <span className="block mt-2 font-bold text-[#3F5F99]">{t('secteursPage.subtitleHint')}</span>
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sectors.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative h-[340px] cursor-pointer"
              >
                {/* FOND DE LA CARTE */}
                <div className="absolute inset-0 rounded-3xl border border-[#C9C9C9]/50 bg-white transition-all duration-300 group-hover:bg-[#F8FAFC] group-hover:border-[#0A2F73]/40 group-hover:shadow-xl shadow-sm" />

                {/* CONTENU */}
                <div className="relative h-full p-8 flex flex-col z-10">
                  <div className="mb-4">
                    {/* ICONE EN COULEUR DU SITE */}
                    <div className="mb-6 text-[#0A2F73] bg-[#0A2F73]/5 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-[#0A2F73] group-hover:text-white transition-all duration-300">
                      {s.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#0A2F73] leading-tight transition-all">
                      {s.fullTitle}
                    </h3>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="flex-grow">
                    <p className="text-sm leading-relaxed text-[#0A2F73] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-medium italic">
                      {s.desc}
                    </p>
                  </div>

                  {/* INDICATEUR BAS */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#C9C9C9]/30">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0A2F73]/40">
                      Expertise ADOC
                    </span>
                    <Plus className="w-5 h-5 text-[#0A2F73] group-hover:rotate-90 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}