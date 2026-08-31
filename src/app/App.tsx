import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { DiagnosticCTA } from '@/app/components/DiagnosticCTA';
import ScrollToTop from '@/app/components/ScrollToTop';

import { HomePage } from '@/app/pages/HomePage';

// Les autres pages sont chargées à la demande : la page d'accueil n'embarque
// plus les simulateurs (xlsx, recharts…) ni les galeries des pages internes.
const CabinetPage = lazy(() =>
  import('@/app/pages/CabinetPage').then((m) => ({ default: m.CabinetPage }))
);
const ExpertisePage = lazy(() =>
  import('@/app/pages/ExpertisePage').then((m) => ({ default: m.ExpertisePage }))
);
const SecteursPage = lazy(() =>
  import('@/app/pages/SecteursPage').then((m) => ({ default: m.SecteursPage }))
);
const ReferencesPage = lazy(() =>
  import('@/app/pages/ReferencesPage').then((m) => ({ default: m.ReferencesPage }))
);
const PublicationsPage = lazy(() =>
  import('@/app/pages/PublicationsPage').then((m) => ({ default: m.PublicationsPage }))
);
const CarrieresPage = lazy(() =>
  import('@/app/pages/CarrieresPage').then((m) => ({ default: m.CarrieresPage }))
);
const ContactPage = lazy(() =>
  import('@/app/pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);

// Le chat embarque le SDK IA : inutile au premier rendu.
const ChatWidget = lazy(() =>
  import('@/app/components/ChatWidget').then((m) => ({ default: m.ChatWidget }))
);

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A2F73]/15 border-t-[#0A2F73]" />
      <span className="sr-only">Chargement…</span>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Gère le scroll automatique vers le haut à chaque changement de page */}
      <ScrollToTop />

      <Header />

      {/* Offset for fixed header + padding bottom for ChatWidget sur mobile */}
      <main className="pt-24 md:pt-28 pb-24 md:pb-0">
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
      </main>

      <DiagnosticCTA />

      <Footer />

      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}
