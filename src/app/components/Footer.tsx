import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.png';
import waqr from '../../assets/WAQR.png';
import { Linkedin, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#0A2F73] text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-full overflow-hidden">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logo} alt="ADOC" className="h-16 mb-4 brightness-0 invert" />
            <p className="text-gray-300">{t('footer.tagline')}</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">{t('footer.expertiseComptable')}</a></li>
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">{t('footer.conseilFiscal')}</a></li>
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">{t('footer.auditCommissariat')}</a></li>
              <li><a href="#services" className="hover:text-[#3F5F99] transition-colors">{t('footer.gestionSociale')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.about')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#team" className="hover:text-[#3F5F99] transition-colors">{t('footer.ourTeam')}</a></li>
              <li><a href="#" className="hover:text-[#3F5F99] transition-colors">{t('footer.ourValues')}</a></li>
              <li><a href="#" className="hover:text-[#3F5F99] transition-colors">{t('footer.news')}</a></li>
              <li><a href="#" className="hover:text-[#3F5F99] transition-colors">{t('footer.careers')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.follow')}</h4>
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
            
            <div className="mt-4">
              <p className="text-sm text-gray-300 mb-2">{t('footer.contactWhatsApp')}</p>
              <img 
                src={waqr} 
                alt="WhatsApp QR Code" 
                className="w-32 h-32 rounded-lg border-2 border-white/10 p-1 bg-white" 
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-300">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#3F5F99] transition-colors">{t('footer.legal')}</a>
            <a href="#" className="hover:text-[#3F5F99] transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}