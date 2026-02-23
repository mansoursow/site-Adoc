'use client';

import { useEffect, useMemo, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Coins, Calendar, Calculator, MessageSquare, FileText } from 'lucide-react';
import logo from '../../assets/logo.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fonction pour gérer la navigation vers les ancres ou l'ouverture des outils
  const handleSubItemClick = (to: string) => {
    setIsMenuOpen(false);
    
    // Si c'est une ancre
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      
      // Si on est déjà sur la bonne page, on scroll ou on laisse l'URL changer
      if (location.pathname === path) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    
    navigate(to);
  };

  const menuItems = useMemo(
    () => [
      { name: 'Accueil', to: '/' },
      { name: 'Le cabinet', to: '/cabinet' },
      { name: 'Expertise', to: '/expertise' },
      { name: 'Références', to: '/references' },
      { 
        name: 'Publications', 
        to: '/publications',
        subItems: [
          { name: 'Calendrier fiscal & social', to: '/publications#fiscal', icon: <Calendar size={16} /> },
          { name: 'Calendrier immobilier', to: '/publications#immo', icon: <Calendar size={16} /> },
          { name: 'Simulateur paie', to: '/publications#paie', icon: <Calculator size={16} /> },
          { name: 'Calculateur impôt', to: '/publications#impot', icon: <Calculator size={16} /> },
          { name: 'Notes techniques', to: '/publications#notes', icon: <FileText size={16} /> },
          // ✅ CORRECTION : Pointe maintenant vers l'ancre de la page publications
          { name: 'Chatbot IA', to: '/publications#chatbot', icon: <MessageSquare size={16} /> },
          { name: 'Gagner de l\'argent (ADOC Crypto)', to: '/crypto', icon: <Coins size={16} className="text-yellow-500" /> },
        ]
      },
      { name: 'Carrières', to: '/carrieres' },
    ],
    []
  );

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative flex items-center gap-1',
      'font-semibold',
      'tracking-wide',
      'text-sm md:text-[15px]',
      'transition-colors py-2',
      isActive ? 'text-[#E64501]' : 'text-[#0A2F73]',
      'hover:text-[#E64501]',
    ].join(' ');

  return (
    <header className={['fixed top-0 w-full z-50 transition-all duration-300', scrolled ? 'border-b border-white/20' : 'border-b border-transparent'].join(' ')}>
      {/* GLASS BACKGROUND */}
      {scrolled && (
        <>
          <div className="absolute inset-0 -z-10 bg-white/75 backdrop-blur-2xl" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0A2F73]/5 to-transparent" />
        </>
      )}

      <div className="relative container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="ADOC Consulting" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <NavLink to={item.to} className={navLinkClass}>
                  {item.name}
                  {item.subItems && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                </NavLink>

                {/* Dropdown Desktop */}
                {item.subItems && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                    <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-2 min-w-[280px]">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.name}
                          type="button"
                          onClick={() => handleSubItemClick(sub.to)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#0A2F73]/5 text-[#0A2F73] hover:text-[#E64501] transition-all group/item text-left"
                        >
                          <span className="text-[#0A2F73]/50 group-hover/item:text-[#E64501] transition-colors">
                            {sub.icon}
                          </span>
                          <span className="text-sm font-bold">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link to="/contact" className="ml-2 inline-flex items-center justify-center rounded-xl px-6 py-2.5 font-bold transition border bg-[#0A2F73] text-white border-[#0A2F73] hover:bg-[#E64501] hover:border-[#E64501] shadow-lg shadow-blue-900/10">
              Nous consulter
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button type="button" onClick={() => setIsMenuOpen((v) => !v)} className="lg:hidden transition text-[#0A2F73] hover:text-[#E64501] p-2" aria-label="Menu">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-6 flex flex-col gap-1 rounded-2xl bg-white/98 border border-white/30 backdrop-blur-3xl px-4 py-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.name} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => [
                      'py-3 font-bold transition-colors flex-grow',
                      isActive ? 'text-[#E64501]' : 'text-[#0A2F73]'
                    ].join(' ')}
                    onClick={() => !item.subItems && setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                  {item.subItems && (
                    <button 
                      type="button"
                      onClick={() => setOpenSubMenu(!openSubMenu)}
                      className="p-3 text-[#0A2F73]"
                    >
                      <ChevronDown size={20} className={openSubMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </button>
                  )}
                </div>

                {/* Submenu Mobile */}
                {item.subItems && openSubMenu && (
                  <div className="flex flex-col gap-1 ml-4 border-l-2 border-[#E64501]/20 pl-4 mb-2">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.name}
                        type="button"
                        onClick={() => handleSubItemClick(sub.to)}
                        className="py-3 text-[13px] font-bold text-[#0A2F73]/70 hover:text-[#E64501] flex items-center gap-3 text-left"
                      >
                        <span className="opacity-50">{sub.icon}</span>
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-4 font-bold transition bg-[#0A2F73] text-white hover:bg-[#E64501] shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Nous consulter
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}