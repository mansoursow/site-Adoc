import { HeroSection } from '@/app/components/HeroSection';
import { HeritageSection } from '@/app/components/HeritageSection';
import { WhyUsSection } from '@/app/components/WhyUsSection';
import { ToolsSimulationSection } from '@/app/components/ToolsSimulationSection';
import { ServicesSection } from '@/app/components/ServicesSection';
import { PartnersSection } from '@/app/components/PartnersSection';
import { TeamSection } from '@/app/components/TeamSection';

export function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Ancienneté du cabinet : depuis 1981, mise en avant juste sous le hero */}
      <HeritageSection />

      <WhyUsSection />

      <ToolsSimulationSection />

      {/* Aperçu des domaines / expertises */}
      <ServicesSection />
      
      {/* Logos / partenaires / confiance */}
      <PartnersSection />
      
      {/* Équipe (aperçu) */}
      <TeamSection />
    </div>
  );
}