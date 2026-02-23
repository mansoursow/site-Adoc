'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

const reasons = [
  {
    title: "Expertise Panafricaine",
    desc: "Une présence stratégique en zone UMEOA et CEMAC pour accompagner votre expansion régionale.",
    icon: <Globe className="text-[#E64501]" size={32} />,
  },
  {
    title: "Approche Sur-mesure",
    desc: "Nous ne croyons pas aux solutions standards. Chaque mission est adaptée à vos réalités locales.",
    icon: <Zap className="text-[#E64501]" size={32} />,
  },
  {
    title: "Rigueur & Conformité",
    desc: "Une méthodologie d'audit stricte garantissant la sécurité financière et fiscale de votre structure.",
    icon: <ShieldCheck className="text-[#0A2F73]" size={32} />,
  },
  {
    title: "Partenariat Durable",
    desc: "Plus qu'un prestataire, nous devenons un conseiller de confiance pour votre gouvernance.",
    icon: <Users className="text-[#0A2F73]" size={32} />,
  },
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E64501] mb-4">
              L'avantage ADOC
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-[#0A2F73] leading-tight">
              Pourquoi choisir notre cabinet pour vos enjeux stratégiques ?
            </h3>
          </div>
          <p className="text-[#0A2F73]/70 md:max-w-xs text-lg border-l-2 border-[#E64501] pl-4">
            L'excellence technique alliée à une connaissance profonde du marché africain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-transparent hover:border-[#0A2F73]/10 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6 w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
                {reason.icon}
              </div>
              <h4 className="text-xl font-bold text-[#0A2F73] mb-3">{reason.title}</h4>
              <p className="text-[#0A2F73]/70 text-sm leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}