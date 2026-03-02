import { Routes, Route, Navigate } from 'react-router-dom';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ChatWidget } from '@/app/components/ChatWidget';
import { DiagnosticCTA } from '@/app/components/DiagnosticCTA';
import ScrollToTop from '@/app/components/ScrollToTop';

import { HomePage } from '@/app/pages/HomePage';
import { CabinetPage } from '@/app/pages/CabinetPage';
import { ExpertisePage } from '@/app/pages/ExpertisePage';
import { SecteursPage } from '@/app/pages/SecteursPage';
import { ReferencesPage } from '@/app/pages/ReferencesPage';
import { PublicationsPage } from '@/app/pages/PublicationsPage';
import { CarrieresPage } from '@/app/pages/CarrieresPage';
import { ContactPage } from '@/app/pages/ContactPage';

export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Gère le scroll automatique vers le haut à chaque changement de page */}
      <ScrollToTop />

      <Header />

      {/* Offset for fixed header + padding bottom for ChatWidget sur mobile */}
      <main className="pt-24 md:pt-28 pb-24 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/secteurs" element={<SecteursPage />} />
          <Route path="/references" element={<ReferencesPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/carrieres" element={<CarrieresPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Back-compat: if someone hits an old anchor URL, keep them on home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <DiagnosticCTA />

      <Footer />

      <ChatWidget />
    </div>
  );
}