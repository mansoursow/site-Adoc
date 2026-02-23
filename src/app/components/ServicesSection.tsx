import { motion } from 'motion/react';

// ✅ IMPORT DES ICÔNES (IMAGES)
import auditIcon from '@/assets/icone/audit.png';
import expertiseIcon from '@/assets/icone/expertise.png';
import conseilIcon from '@/assets/icone/conseil.png';
import restructurationIcon from '@/assets/icone/restructuration.png';
import secteurPublicIcon from '@/assets/icone/secteur-public.png';
import systemeInfoIcon from '@/assets/icone/systeme-info.png';

const services = [
  {
    icon: auditIcon,
    title: 'Audit & Commissariat aux comptes',
    description: 'Audit légal, contractuel et missions de commissariat aux comptes.',
  },
  {
    icon: expertiseIcon,
    title: 'Expertise comptable & Fiscalité',
    description: 'Tenue, révision comptable, fiscalité et établissement des états financiers.',
  },
  {
    icon: conseilIcon,
    title: 'Conseil stratégique & Organisation',
    description: 'Accompagnement des dirigeants dans leurs choix stratégiques et organisationnels.',
  },
  {
    icon: restructurationIcon,
    title: 'Transactions & Restructuration',
    description: 'Opérations de restructuration, évaluation et accompagnement stratégique.',
  },
  {
    icon: secteurPublicIcon,
    title: 'Secteur public & Politiques publiques',
    description: 'Audit, conseil et accompagnement des institutions publiques et parapubliques.',
  },
  {
    icon: systemeInfoIcon,
    title: 'Systèmes d’information & Transformation digitale',
    description: 'Modernisation des SI, accompagnement digital et gouvernance des données.',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* ===== TITRE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-[#0A2F73]">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des expertises complémentaires au service de votre performance
          </p>
        </motion.div>

        {/* ===== GRID SERVICES ===== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="
                bg-white p-8 rounded-2xl
                shadow-lg hover:shadow-xl
                transition-all duration-300
                group
              "
            >
              {/* ===== ICÔNE IMAGE ===== */}
              <div
                className="
                  w-20 h-20 mb-6
                  flex items-center justify-center
                  rounded-2xl
                  bg-gradient-to-br from-[#3F5F99]/10 to-[#0A2F73]/10
                  group-hover:scale-110
                  transition-transform duration-300
                "
              >
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-14 h-14 object-contain"
                />
              </div>

              {/* ===== TEXTE ===== */}
              <h3 className="text-xl font-bold mb-3 text-[#0A2F73]">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
