import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// ✅ Importation de l'image
import watermarkImage from '@/assets/gallery hero/image4.jpg';

const blocks = [
  {
    title: 'Audit & Commissariat',
    items: ['Audit légal', 'Audit contractuel', 'Audit de projets & bailleurs', 'Audit public & conformité'],
  },
  {
    title: 'Expertise comptable & fiscalité',
    items: ['Externalisation', 'Reporting', 'Fiscalité nationale & internationale'],
  },
  {
    title: 'Conseil stratégique & organisation',
    items: ['Diagnostic', 'Restructuration', 'Performance', 'Gouvernance'],
  },
  {
    title: 'Transactions & évaluation',
    items: ['Due diligence', 'Fusions & acquisitions', 'Évaluations'],
  },
  {
    title: 'Secteur public & politiques publiques',
    items: ['Finances publiques', 'Marchés publics', 'Stratégies sectorielles'],
  },
  {
    title: 'Digital & systèmes d’information',
    items: ['Audit SI', 'Organisation comptable', 'Outils de gestion'],
  },
];

export function ExpertisePage() {
  return (
    <div className="relative min-h-screen">
      
      {/* ================= FILIGRANE BACKGROUND FIXE ================= */}
      {/* Le "fixed" permet à l'image de rester immobile pendant le scroll */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={watermarkImage} 
          alt="" 
          className="w-full h-full object-cover opacity-[0.4] grayscale" 
        />
        {/* Overlay pour adoucir l'image et assurer la lisibilité */}
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* ================= DÉGRADÉ SUPÉRIEUR ================= */}
      <div className="fixed top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#0A2F73]/10 to-transparent z-0 pointer-events-none" />

      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black text-[#0A2F73] mb-12"
          >
            Expertises
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {blocks.map((b) => (
              <motion.div 
                key={b.title} 
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                // bg-white/40 pour la transparence et backdrop-blur-xl pour l'effet givré
                className="rounded-2xl border border-white/40 p-8 shadow-xl bg-white/40 backdrop-blur-xl transition-all duration-300"
              >
                <div className="text-xl font-bold text-[#0A2F73]">{b.title}</div>
                <ul className="mt-4 space-y-2 text-[#0A2F73] font-medium">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start">
                      <span className="mr-2 text-[#3F5F99] font-bold">•</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            <Link
              to="/references"
              className="inline-flex items-center justify-center rounded-xl bg-[#0A2F73] text-white px-8 py-4 font-bold hover:bg-[#3F5F99] transition shadow-lg"
            >
              Voir nos références
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border-2 border-[#0A2F73] text-[#0A2F73] bg-white/20 backdrop-blur-md px-8 py-4 font-bold hover:bg-white/40 transition"
            >
              Demander un entretien confidentiel
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}