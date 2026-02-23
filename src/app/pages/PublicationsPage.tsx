'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, X, Clock, TrendingUp, Info, 
  MessageSquare, Coins, Send 
} from 'lucide-react';
import { useChat } from '@ai-sdk/react'; 
import { SalarySimulator } from '@/app/components/SalarySimulator';
import { TaxCalculator } from '@/app/components/TaxCalculator';

import image7 from '@/assets/gallery-cabinet/image7.jpg';

// ===================== UTILS =====================
function buildMonthGrid(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const firstW = (first.getDay() + 6) % 7;
  const dim = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstW; i++) cells.push({ day: null });
  for (let d = 1; d <= dim; d++) cells.push({ day: d });
  while (cells.length % 7 !== 0) cells.push({ day: null });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function useCountdown(target?: Date | null) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((x) => x + 1), 1000);
    return () => window.clearInterval(t);
  }, []);
  return useMemo(() => {
    if (!target) return null;
    const now = new Date();
    let diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [target, tick]);
}

function FiscalCalendar({ months }: { months: any[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const month = months.find((m) => m.monthIndex === selectedMonth) ?? months[0];
  const monthGrid = useMemo(() => buildMonthGrid(year, month.monthIndex), [year, month.monthIndex]);
  const highlightDays = useMemo(() => new Set(month.items.map((x: any) => x.day)), [month.items]);

  const allDeadlines = useMemo(() => {
    const flat: any[] = [];
    months.forEach((m) => {
      m.items.forEach((it: any) => {
        flat.push({ month: m, item: it, date: new Date(year, m.monthIndex, it.day, 23, 59) });
      });
    });
    return flat;
  }, [months, year]);

  const globalNext = useMemo(() => {
    const future = allDeadlines
      .filter((x) => x.date.getTime() >= now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return future[0] || null;
  }, [allDeadlines, now]);

  const countdownTarget = activeDay ? new Date(year, month.monthIndex, activeDay, 23, 59) : globalNext?.date;
  useCountdown(countdownTarget);
  const selectedDayItems = month.items.filter((it: any) => it.day === activeDay);

  return (
    <div id="fiscal" className="mt-10 scroll-mt-24">
      <div className="mb-8">
        <div className="text-sm font-semibold tracking-wide uppercase opacity-60 text-[#0A2F73]">Calendrier Officiel</div>
        <h2 className="mt-2 text-2xl md:text-4xl font-black text-[#0A2F73]">Échéances Fiscales & Sociales</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {months.map((m) => (
          <button 
            key={m.monthIndex} 
            type="button"
            onClick={(e) => { e.preventDefault(); setSelectedMonth(m.monthIndex); setActiveDay(null); }} 
            className={`rounded-full px-5 py-2 text-sm font-bold border transition-all ${m.monthIndex === selectedMonth ? 'bg-[#0A2F73] text-white shadow-lg' : 'bg-white text-[#0A2F73] hover:bg-gray-50'}`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[2.5rem] border lg:h-[650px] bg-white shadow-2xl">
        <div className="p-8 flex flex-col justify-between bg-slate-50">
          <div>
            <div className="text-[64px] font-black leading-none text-[#0A2F73]">{year}</div>
            <div className="text-2xl font-bold uppercase tracking-widest mt-2 text-[#E64501]">{month.name}</div>
            <div className="mt-8 rounded-3xl bg-white border p-6 shadow-sm">
              <div className="grid grid-cols-7 gap-2 text-[11px] font-black text-center opacity-30 mb-4">
                {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map(w => <div key={w}>{w}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthGrid.flat().map((c, idx) => {
                  const isHigh = c.day != null && highlightDays.has(c.day);
                  const isSelected = activeDay === c.day;
                  return (
                    <button 
                      key={idx} 
                      type="button"
                      disabled={!c.day}
                      onClick={(e) => { e.preventDefault(); c.day && setActiveDay(isSelected ? null : c.day); }}
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                        ${isSelected ? 'bg-[#E64501] text-white scale-110 shadow-lg' : isHigh ? 'bg-[#0A2F73] text-white' : 'text-[#0A2F73] hover:bg-gray-100'}
                        ${!c.day ? 'opacity-0' : 'opacity-100'}
                      `}
                    >
                      {c.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-[#0A2F73]/50 bg-white/50 p-3 rounded-xl border border-dashed">
            <Info size={14} /> CLIQUER SUR UN JOUR ENCERCLÉ POUR LES DÉTAILS
          </div>
        </div>

        <div className="flex flex-col h-full overflow-hidden relative bg-[#0A2F73]">
          <div className="absolute inset-0 z-0">
             <img src={image7} className="w-full h-full object-cover opacity-40 grayscale" alt="" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0A2F73] via-[#0A2F73]/50 to-[#0A2F73]/80" />
          </div>

          <div className="relative z-10 p-8 border-b border-white/10 text-white flex justify-between items-center bg-white/5 backdrop-blur-md">
            <span className="font-black text-xl tracking-tight">Détails de l'échéance</span>
            {activeDay && <span className="bg-[#E64501] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">{activeDay} {month.name}</span>}
          </div>
          
          <div className="relative z-10 flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar text-white">
            {activeDay ? (
              selectedDayItems.map((it: any, i: number) => (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={i} className="bg-white rounded-2xl p-6 border-l-4 border-[#E64501] shadow-xl text-[#0A2F73]">
                  <div className="text-[#0A2F73] font-black text-lg mb-4 uppercase tracking-tight italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E64501]" /> {it.title}
                  </div>
                  <div className="space-y-3 text-sm">
                     <p className="flex justify-between border-b pb-1"><span className="opacity-50 font-bold uppercase text-[10px]">Base:</span> <strong>{it.base}</strong></p>
                     <p className="flex justify-between border-b pb-1"><span className="opacity-50 font-bold uppercase text-[10px]">Limite:</span> <strong>{it.dateLimite}</strong></p>
                     <div className="mt-4 p-4 bg-slate-50 rounded-xl text-xs leading-relaxed italic border border-gray-100 font-medium">
                       {it.obs}
                     </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-white/30 text-center px-10">
                <Clock size={64} className="mb-6 opacity-10" />
                <p className="font-bold text-lg">Sélectionnez une date pour consulter les obligations légales.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Extrait le texte d'un message (format UIMessage avec parts). */
function getMessageText(m: { parts?: Array<{ type: string; text?: string }>; content?: string }) {
  if (typeof m.content === 'string') return m.content;
  if (!Array.isArray(m.parts)) return '';
  return m.parts
    .filter((p): p is { type: string; text: string } => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text)
    .join('');
}

// ===================== PAGE PRINCIPALE =====================
export function PublicationsPage() {
  const [activeTool, setActiveTool] = useState<'salary' | 'tax' | 'chatbot' | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const chat = useChat({
    api: '/api/chat',
  });
  const [inputValue, setInputValue] = useState('');

  const messages = chat.messages || [];
  const isLoading = chat.status === 'streaming' || chat.status === 'submitted';
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue('');
    chat.sendMessage({ text });
  };

  useEffect(() => {
    const tool = searchParams.get('tool');
    const hash = location.hash.replace('#', '');
    if (tool === 'paie' || hash === 'paie') setActiveTool('salary');
    if (tool === 'impot' || hash === 'impot') setActiveTool('tax');
    if (hash === 'chatbot') setActiveTool('chatbot');
    if (hash && !['chatbot', 'paie', 'impot'].includes(hash)) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchParams, location.hash]);

  const CGI_ITEMS = useMemo(() => [
    { title: "TVA", day: 15, base: "TVA nette due", dateLimite: "15 du mois", obs: "Art. 355 CGI - Mensuel" },
    { title: "Acompte IS", day: 15, base: "% du CA mensuel", dateLimite: "15 du mois", obs: "Art. 219 CGI - Mensuel" }
  ], []);

  const FISCAL_MONTHS = useMemo(() => {
    return [
      { name: 'Janvier', index: 0, items: [...CGI_ITEMS] },
      { name: 'Février', index: 1, items: [...CGI_ITEMS] },
      { name: 'Mars', index: 2, items: [...CGI_ITEMS] },
      { name: 'Avril', index: 3, items: [{ title: "Liasse Fiscale", day: 30, base: "Résultat annuel", dateLimite: "30 Avril", obs: "Déclaration de résultat" }, ...CGI_ITEMS] },
      { name: 'Mai', index: 4, items: [...CGI_ITEMS] },
      { name: 'Juin', index: 5, items: [...CGI_ITEMS] },
      { name: 'Juillet', index: 6, items: [...CGI_ITEMS] },
      { name: 'Août', index: 7, items: [...CGI_ITEMS] },
      { name: 'Septembre', index: 8, items: [...CGI_ITEMS] },
      { name: 'Octobre', index: 9, items: [...CGI_ITEMS] },
      { name: 'Novembre', index: 10, items: [...CGI_ITEMS] },
      { name: 'Décembre', index: 11, items: [...CGI_ITEMS] },
    ].map(m => ({ monthIndex: m.index, name: m.name, items: m.items }));
  }, [CGI_ITEMS]);

  return (
    <div className="bg-white min-h-screen">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black text-[#0A2F73] tracking-tighter mb-4">
            Publications <span className="text-[#E64501]">&</span> Outils
          </motion.h1>
          <FiscalCalendar months={FISCAL_MONTHS} />

          <div className="mt-32">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div whileHover={{ y: -8 }} onClick={() => setActiveTool('salary')} className="rounded-[2rem] p-8 bg-[#F8FAFC] border-2 border-dashed border-[#3F5F99]/20 cursor-pointer group">
                  <Calculator size={32} className="text-[#0A2F73] mb-6" />
                  <div className="font-black text-[#0A2F73] text-xl">Simulateur de Salaire</div>
                </motion.div>

                <motion.div whileHover={{ y: -8 }} onClick={() => setActiveTool('tax')} className="rounded-[2rem] p-8 bg-[#FFF7F5] border-2 border-dashed border-[#E64501]/20 cursor-pointer group">
                  <TrendingUp size={32} className="text-[#E64501] mb-6" />
                  <div className="font-black text-[#0A2F73] text-xl">Calculateur d'Impôts</div>
                </motion.div>

                <motion.div whileHover={{ y: -8 }} onClick={() => setActiveTool('chatbot')} className="rounded-[2rem] p-8 bg-[#F0F4FF] border border-[#0A2F73]/10 cursor-pointer group relative overflow-hidden">
                  <MessageSquare size={32} className="text-[#0A2F73] mb-6" />
                  <div className="font-black text-[#0A2F73] text-xl">Assistant IA ADOC</div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveTool(null)} className="absolute inset-0 bg-[#0A2F73]/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
              
              <div className="p-6 border-b flex justify-between items-center bg-white z-10">
                <h2 className="text-xl font-black text-[#0A2F73]">
                    {activeTool === 'salary' ? 'Simulateur de Paie' : activeTool === 'tax' ? "Calculateur d'Impôts" : "Assistant Fiscal IA ADOC"}
                </h2>
                <button type="button" onClick={() => setActiveTool(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} className="text-[#0A2F73]" /></button>
              </div>

              <div className="p-8 overflow-y-auto bg-slate-50/30 flex-grow">
                 {activeTool === 'salary' && <SalarySimulator />}
                 {activeTool === 'tax' && <TaxCalculator />}
                 
                 {activeTool === 'chatbot' && (
                   <div className="flex flex-col h-[500px] bg-white rounded-[2rem] border shadow-inner overflow-hidden">
                      {chat.error && (
                        <div className="mx-4 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
                          {chat.error.message}
                        </div>
                      )}
                      <div className="flex-grow p-6 overflow-y-auto space-y-4">
                        {messages.length === 0 && !chat.error && <p className="text-center opacity-20 italic mt-20">Posez vos questions sur le CGI Sénégalais...</p>}
                        {messages.map((m) => (
                          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#0A2F73] text-white' : 'bg-slate-100 text-[#0A2F73]'}`}>
                              {getMessageText(m)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Écrivez ici..."
                          className="flex-grow p-4 bg-slate-50 rounded-xl outline-none border border-transparent focus:border-[#0A2F73]/30 text-[#0A2F73]"
                          disabled={isLoading}
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !inputValue.trim()}
                          className={`p-4 rounded-xl shrink-0 ${inputValue.trim() ? 'bg-[#0A2F73] text-white hover:opacity-90' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        >
                          <Send size={20} />
                        </button>
                      </form>
                   </div>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}