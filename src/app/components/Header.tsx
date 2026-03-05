'use client';

import { useEffect, useMemo, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, ChevronDown, ChevronRight, Calendar, Calculator, CalendarDays, Percent } from 'lucide-react';
import logo from '../../assets/logo.png';

export function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<'publications' | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const setLang = (lang: 'fr' | 'en') => {
    i18n.changeLanguage(lang);
    if (typeof localStorage !== 'undefined') localStorage.setItem('lang', lang);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubItemClick = (to: string) => {
    setIsMenuOpen(false);
    setOpenSubMenu(null);
    if (to.includes('#')) {
      const [path, hash] = to.split('#');
      if (location.pathname === path) {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    navigate(to);
  };

  const publicationsMenu = useMemo(
    () => ({
      nameKey: 'nav.publications',
      to: '/publications',
      groups: [
        {
          labelKey: 'nav.agendas',
          icon: CalendarDays,
          items: [
            { nameKey: 'nav.calendarFiscal', to: '/publications#fiscal', icon: Calendar },
            { nameKey: 'nav.calendarImmo', to: '/publications#immo', icon: Calendar },
          ],
        },
        {
          labelKey: 'nav.simulateurs',
          icon: Calculator,
          items: [
            { nameKey: 'nav.simulatorPay', to: '/publications#paie', icon: Calculator },
            { nameKey: 'nav.calculatorTax', to: '/publications#impot', icon: Calculator },
            { nameKey: 'nav.simulatorTEG', to: '/publications#tegtaeg', icon: Percent },
            { nameKey: 'nav.ratios', to: '/publications#ratios', icon: Percent },
            { nameKey: 'nav.simulatorLicenciement', to: '/publications#licenciement', icon: Calculator },
            { nameKey: 'nav.simulatorFinCDD', to: '/publications#findcdd', icon: Calculator },
            { nameKey: 'nav.simulatorCongeMaternite', to: '/publications#congematernite', icon: Calculator },
            { nameKey: 'nav.simulatorRetenueAbsence', to: '/publications#retenueabsence', icon: Calculator },
            { nameKey: 'nav.simulatorFormeSociale', to: '/publications#formesociale', icon: Calculator },
          ],
        },
        {
          labelKey: 'nav.publicationsSection',
          icon: Calendar,
          items: [
            { nameKey: 'nav.technicalNotes', to: '/publications#quitus', icon: Calendar },
            { nameKey: 'nav.codeInvestissements', to: '/publications#code-investissements', icon: Calendar },
            { nameKey: 'nav.startupAct', to: '/publications#startup-act', icon: Calendar },
          ],
        },
      ],
    }),
    []
  );

  const menuItems = useMemo(
    () => [
      { nameKey: 'nav.home', to: '/' },
      { nameKey: 'nav.cabinet', to: '/cabinet' },
      { nameKey: 'nav.expertise', to: '/expertise' },
      { nameKey: 'nav.references', to: '/references' },
      publicationsMenu,
      { nameKey: 'nav.careers', to: '/carrieres' },
    ],
    [publicationsMenu]
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
            <img src={logo} alt={t('nav.logoAlt')} className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" role="menubar">
            {menuItems.map((item) => {
              const hasDropdown = 'groups' in item && item.groups;
              return (
                <div key={item.nameKey} className="relative group" role="none">
                  <NavLink
                    to={item.to}
                    className={navLinkClass}
                    role="menuitem"
                    onMouseEnter={(e) => hasDropdown && (e.currentTarget as HTMLElement).focus()}
                  >
                    {t(item.nameKey)}
                    {hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" aria-hidden />}
                  </NavLink>

                  {/* Mega dropdown Publications */}
                  {hasDropdown && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-200 z-[100]"
                      role="menu"
                    >
                      <div className="bg-white border border-[#0A2F73]/10 shadow-xl rounded-xl overflow-hidden min-w-[420px] flex">
                        {item.groups.map((group) => {
                          const GroupIcon = group.icon;
                          return (
                            <div key={group.labelKey} className="flex-1 p-4 first:border-r border-[#0A2F73]/10">
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#0A2F73]/10">
                                <GroupIcon size={18} className="text-[#0A2F73]/70" aria-hidden />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#0A2F73]/70">{t(group.labelKey)}</span>
                              </div>
                              <ul className="space-y-0.5" role="group">
                                {group.items.map((sub) => {
                                  const SubIcon = sub.icon;
                                  return (
                                    <li key={sub.nameKey} role="none">
                                      <button
                                        type="button"
                                        onClick={() => handleSubItemClick(sub.to)}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0A2F73] hover:bg-[#0A2F73]/5 hover:text-[#E64501] focus:bg-[#0A2F73]/5 focus:text-[#E64501] focus:outline-none focus:ring-2 focus:ring-[#0A2F73]/30 transition-all text-left group/item"
                                      >
                                        <SubIcon size={16} className="text-[#0A2F73]/50 group-hover/item:text-[#E64501] shrink-0" aria-hidden />
                                        <span>{t(sub.nameKey)}</span>
                                        <ChevronRight size={14} className="ml-auto opacity-40 group-hover/item:opacity-100 group-hover/item:text-[#E64501]" aria-hidden />
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="ml-2 flex items-center gap-2">
              <button type="button" onClick={() => setLang('fr')} className={`px-2 py-1 rounded text-sm font-bold ${i18n.language === 'fr' ? 'bg-[#0A2F73] text-white' : 'text-[#0A2F73] hover:bg-gray-100'}`} aria-label={t('nav.langFr')}>FR</button>
              <span className="text-gray-300">|</span>
              <button type="button" onClick={() => setLang('en')} className={`px-2 py-1 rounded text-sm font-bold ${i18n.language === 'en' ? 'bg-[#0A2F73] text-white' : 'text-[#0A2F73] hover:bg-gray-100'}`} aria-label={t('nav.langEn')}>EN</button>
            </div>
            <Link to="/contact" className="ml-2 inline-flex items-center justify-center rounded-xl px-6 py-2.5 font-bold transition border bg-[#0A2F73] text-white border-[#0A2F73] hover:bg-[#E64501] hover:border-[#E64501] shadow-lg shadow-blue-900/10">
              {t('nav.contactUs')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button type="button" onClick={() => setIsMenuOpen((v) => !v)} className="lg:hidden transition text-[#0A2F73] hover:text-[#E64501] p-2" aria-label={t('nav.menu')}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-6 flex flex-col gap-1 rounded-2xl bg-white/98 border border-white/30 backdrop-blur-3xl px-4 py-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            {menuItems.map((item) => {
              const hasGroups = 'groups' in item && item.groups;
              const isPubOpen = openSubMenu === 'publications';
              return (
                <div key={item.nameKey} className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => [
                        'py-3 font-bold transition-colors flex-grow',
                        isActive ? 'text-[#E64501]' : 'text-[#0A2F73]'
                      ].join(' ')}
                      onClick={() => !hasGroups && setIsMenuOpen(false)}
                    >
                      {t(item.nameKey)}
                    </NavLink>
                    {hasGroups && (
                      <button
                        type="button"
                        onClick={() => setOpenSubMenu(isPubOpen ? null : 'publications')}
                        className="p-3 text-[#0A2F73]"
                        aria-expanded={isPubOpen}
                        aria-controls="pub-submenu-mobile"
                      >
                        <ChevronDown size={20} className={isPubOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                      </button>
                    )}
                  </div>

                  {/* Submenu Mobile - Publications groups */}
                  {hasGroups && isPubOpen && (
                    <div id="pub-submenu-mobile" className="flex flex-col gap-4 ml-4 border-l-2 border-[#0A2F73]/20 pl-4 mb-2">
                      {item.groups.map((group) => {
                        const GroupIcon = group.icon;
                        return (
                          <div key={group.labelKey}>
                            <div className="flex items-center gap-2 py-1 mb-1">
                              <GroupIcon size={16} className="text-[#0A2F73]/70" />
                              <span className="text-xs font-bold uppercase tracking-wider text-[#0A2F73]/70">{t(group.labelKey)}</span>
                            </div>
                            <ul className="space-y-0">
                              {group.items.map((sub) => {
                                const SubIcon = sub.icon;
                                return (
                                  <li key={sub.nameKey}>
                                    <button
                                      type="button"
                                      onClick={() => handleSubItemClick(sub.to)}
                                      className="w-full py-2.5 text-[13px] font-semibold text-[#0A2F73]/80 hover:text-[#E64501] flex items-center gap-2 text-left"
                                    >
                                      <SubIcon size={14} className="opacity-60 shrink-0" />
                                      {t(sub.nameKey)}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-4 flex items-center gap-2">
              <button type="button" onClick={() => setLang('fr')} className={`px-3 py-2 rounded-lg text-sm font-bold ${i18n.language === 'fr' ? 'bg-[#0A2F73] text-white' : 'text-[#0A2F73] bg-gray-100'}`} aria-label={t('nav.langFr')}>FR</button>
              <button type="button" onClick={() => setLang('en')} className={`px-3 py-2 rounded-lg text-sm font-bold ${i18n.language === 'en' ? 'bg-[#0A2F73] text-white' : 'text-[#0A2F73] bg-gray-100'}`} aria-label={t('nav.langEn')}>EN</button>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-4 font-bold transition bg-[#0A2F73] text-white hover:bg-[#E64501] shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.contactUs')}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}