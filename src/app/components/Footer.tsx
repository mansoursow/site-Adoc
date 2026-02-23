import logo from '../../assets/logo.png';
// 1. Importez l'image du QR Code
import waqr from '../../assets/WAQR.png'; 
import { Linkedin, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A2F73] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logo} alt="ADOC" className="h-16 mb-4 brightness-0 invert" />
            <p className="text-gray-300">
              Votre partenaire de confiance en expertise comptable depuis plus de 20 ans.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">Expertise Comptable</a></li>
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">Conseil Fiscal</a></li>
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">Audit & Commissariat</a></li>
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">Gestion Sociale</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">À propos</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#team" className="hover:text-[#3F5F99] transition-colors">Notre Équipe</a></li>
              <li><a href="#" className="hover:text-[#3F5F99] transition-colors">Nos Valeurs</a></li>
              <li><a href="#" className="hover:text-[#3F5F99] transition-colors">Actualités</a></li>
              <li><a href="#" className="hover:text-[#3F5F99] transition-colors">Carrières</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#3F5F99] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#3F5F99] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#3F5F99] transition-colors">
                <Twitter size={20} />
              </a>
            </div>
            
            {/* 2. Affichage du QR Code WhatsApp */}
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">Contactez-nous sur WhatsApp :</p>
              <img 
                src={waqr} 
                alt="WhatsApp QR Code" 
                className="w-32 h-32 rounded-lg border-2 border-white/10 p-1 bg-white" 
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-300">
          <p>© 2026 ADOC Audit & Conseil. Tous droits réservés.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#3F5F99] transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-[#3F5F99] transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}