'use client';

import { motion } from 'framer-motion';
import { 
  Building2, Zap, BarChart3, Cpu, Factory, Stethoscope, 
  Hotel, Users2, Plus, ArrowUpRight, MapPin 
} from 'lucide-react';

// ✅ Importation de l'image spécifiée
import watermarkTop from '@/assets/gallery hero/image3.jpg';

const sectors = [
  {
    fullTitle: 'Institutions & Projets',
    desc: 'Audit de projets financés par les bailleurs de fonds (Banque Mondiale, BAD) et organismes publics.',
    icon: <Building2 size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Énergie & Mines',
    desc: 'Expertise fiscale et réglementaire pour les industries extractives et projets d’énergies.',
    icon: <Zap size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Finance & Assurance',
    desc: 'Audit légal, revue de conformité et gestion des risques financiers.',
    icon: <BarChart3 size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Télécoms & Tech',
    desc: 'Accompagnement des startups et opérateurs dans leur structuration digitale.',
    icon: <Cpu size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Industrie & BTP',
    desc: 'Optimisation des coûts de revient et audit de chantiers complexes.',
    icon: <Factory size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Santé & Social',
    desc: 'Conseil stratégique pour les cliniques : gestion budgétaire et conformité.',
    icon: <Stethoscope size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'Hôtellerie & Immo',
    desc: 'Structuration de véhicules d’investissement et audit de gestion hôtelière.',
    icon: <Hotel size={32} strokeWidth={1.5} />
  },
  {
    fullTitle: 'PME & Groupes',
    desc: 'Transmission d’entreprise, gouvernance familiale et externalisation.',
    icon: <Users2 size={32} strokeWidth={1.5} />
  },
];

const referenceCategories = [
  { title: 'Institutions publiques', items: ['IGE, ARCOP, ADS, ADPME'] },
  { title: 'Projets internationaux', items: ['Banque Mondiale, ONU'] },
  { title: 'Groupes privés', items: ['SAR, CBAO'] },
  { title: 'ONG & bailleurs', items: ['Care International, Amnesty International'] },
];

export function ReferencesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* ================= FILIGRANE BACKGROUND FIXE ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={watermarkTop} 
          alt="" 
          className="w-full h-full object-cover opacity-[0.45] grayscale" 
        />
        {/* Overlay pour garder le texte lisible */}
        <div className="absolute inset-0 bg-white/30" />
      </div>

      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-6">
          
          {/* ================= HEADER SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-[#0A2F73] tracking-tight">
              Secteurs <span className="text-[#E64501]">&</span> Références
            </h1>
            <p className="mt-6 max-w-2xl text-[#0A2F73] text-lg font-semibold bg-white/10 backdrop-blur-sm inline-block rounded-lg">
              Une expertise sectorielle pointue appuyée par des interventions majeures auprès d'institutions de premier plan.
            </p>
          </motion.div>

          {/* ================= 1. SECTEURS D'INTERVENTION ================= */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-[#3F5F99] uppercase tracking-[0.2em] mb-10">
              Nos pôles d'expertise
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sectors.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative h-[280px] cursor-pointer"
                >
                  {/* Carte transparente avec flou */}
                  <div className="absolute inset-0 rounded-3xl border border-white/40 bg-white/40 backdrop-blur-md transition-all duration-300 group-hover:border-[#0A2F73]/40 group-hover:bg-white/60 group-hover:shadow-xl shadow-sm" />
                  
                  <div className="relative h-full p-6 flex flex-col z-10">
                    <div className="mb-4 text-[#0A2F73] bg-[#0A2F73]/10 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-[#0A2F73] group-hover:text-white transition-all duration-300">
                      {s.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#0A2F73] leading-tight mb-3">
                      {s.fullTitle}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#0A2F73] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {s.desc}
                    </p>
                    <div className="mt-auto pt-4 border-t border-[#0A2F73]/10 flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-[#0A2F73]/60">Expertise ADOC</span>
                      <Plus className="w-4 h-4 text-[#0A2F73] group-hover:rotate-90 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <hr className="my-20 border-[#0A2F73]/10" />

          {/* ================= 2. RÉFÉRENCES CLIENTS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-[#3F5F99] uppercase tracking-[0.2em] mb-10">
                Ils nous font confiance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {referenceCategories.map((c, idx) => (
                  <motion.div 
                    key={idx} 
                    className="rounded-2xl border border-white/50 p-6 bg-white/30 backdrop-blur-md shadow-sm"
                  >
                    <div className="text-md font-bold text-[#0A2F73] mb-4 border-b border-[#0A2F73]/10 pb-3 uppercase tracking-wider">{c.title}</div>
                    <ul className="space-y-3">
                      {c.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-3 text-[#0A2F73] text-sm font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E64501]" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-[#3F5F99] uppercase tracking-[0.2em] mb-10">
                Presse
              </h2>
              <motion.a 
                href="https://lemarche.finance/le-cabinet-dexpertise-comptable-adoc-ouvre-un-bureau-a-ndjamena/"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-3xl border border-white/50 overflow-hidden bg-white/40 backdrop-blur-md hover:bg-white/60 hover:shadow-2xl transition-all duration-500"
              >
                <div className="bg-[#0A2F73] p-6 text-white flex items-center justify-between">
                  <MapPin size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Actualité 2024</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0A2F73] group-hover:text-[#E64501] transition-colors">
                    Ouverture d'un bureau à N’Djamena
                  </h3>
                  <p className="mt-3 text-sm text-[#0A2F73] font-medium leading-relaxed">
                    Expansion stratégique en zone CEMAC pour accompagner les acteurs économiques tchadiens.
                  </p>
                  <div className="mt-6 flex items-center text-[#E64501] font-bold text-xs uppercase tracking-widest">
                    Lire l'article <ArrowUpRight size={14} className="ml-2" />
                  </div>
                </div>
              </motion.a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}