import { HeroSection } from '@/app/components/HeroSection';
import { WhyUsSection } from '@/app/components/WhyUsSection'; // 👈 Nouvel import
import { ServicesSection } from '@/app/components/ServicesSection';
import { PartnersSection } from '@/app/components/PartnersSection';
import { TeamSection } from '@/app/components/TeamSection';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      
      {/* Nouvelle section ajoutée ici */}
      <WhyUsSection /> 

      {/* Aperçu des domaines / expertises */}
      <ServicesSection />
      
      {/* Logos / partenaires / confiance */}
      <PartnersSection />
      
      {/* Équipe (aperçu) */}
      <TeamSection />
    </div>
  );
}