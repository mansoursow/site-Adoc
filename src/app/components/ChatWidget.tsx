'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from '@formspree/react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';

const FORMSPREE_FORM_ID = 'mjgelepz';

type FlowType = 'rdv' | 'question' | null;
type QuestionPhase = 'asking' | 'redirect_choice' | 'collecting_contacts' | null;
type FormStep = 'name' | 'phone' | 'email';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

function getMessageText(m: { parts?: Array<{ type: string; text?: string }>; content?: string }) {
  if (typeof m.content === 'string') return m.content;
  if (!Array.isArray(m?.parts)) return '';
  return (m.parts as Array<{ type: string; text?: string }>)
    .filter((p) => p.type === 'text' && typeof p.text === 'string')
    .map((p) => p.text as string)
    .join('');
}

export function ChatWidget() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [flowType, setFlowType] = useState<FlowType>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [questionPhase, setQuestionPhase] = useState<QuestionPhase>(null);
  const [formStep, setFormStep] = useState<FormStep>('name');
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '' });
  const [inputValue, setInputValue] = useState('');
  const [state, handleFormspreeSubmit] = useForm(FORMSPREE_FORM_ID);
  const formRef = useRef<HTMLFormElement>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const hasSubmittedRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const tooltipShownRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addedAiCountRef = useRef(0);
  const redirectShownRef = useRef(false);

  const chat = useChat({ api: '/api/chat' });
  const isAiTyping = chat.status === 'streaming' || chat.status === 'submitted';
  const isSubmitting = state.submitting;

  useEffect(() => {
    if (state.succeeded && hasSubmittedRef.current) setSubmitted(true);
  }, [state.succeeded]);

  const addMessage = useCallback((role: 'user' | 'bot', content: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role, content }]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, formStep, submitted, flowType, scrollToBottom, chat.messages]);

  const handleChoice = useCallback(
    (type: FlowType) => {
      setFlowType(type);
      if (type === 'rdv') {
        addMessage('bot', t('publications.rdvIntro'));
        addMessage('bot', t('publications.formAskName'));
        setFormStep('name');
      }
      if (type === 'question') {
        setQuestionPhase('asking');
        addMessage('bot', t('publications.chatbotPlaceholder'));
      }
    },
    [addMessage, t]
  );

  const submitLead = useCallback(
    (data: { fullName: string; phone: string; email: string; conversation?: string }) => {
      const form = formRef.current;
      if (!form) return;
      hasSubmittedRef.current = true;
      (form.elements.namedItem('fullName') as HTMLInputElement).value = data.fullName;
      (form.elements.namedItem('phone') as HTMLInputElement).value = data.phone;
      (form.elements.namedItem('email') as HTMLInputElement).value = data.email;
      (form.elements.namedItem('type') as HTMLInputElement).value = flowType || '';
      (form.elements.namedItem('conversation') as HTMLInputElement).value = data.conversation || '';
      form.requestSubmit();
    },
    [flowType]
  );

  const resetFlow = useCallback(() => {
    hasSubmittedRef.current = false;
    setSubmitted(false);
    setFlowType(null);
    setMessages([]);
    setQuestionPhase(null);
    setFormStep('name');
    setFormData({ fullName: '', phone: '', email: '' });
    setInputValue('');
    addedAiCountRef.current = 0;
    redirectShownRef.current = false;
    chat.setMessages([]);
  }, [chat]);

  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    window.addEventListener('openChatWidget', onOpen);
    return () => window.removeEventListener('openChatWidget', onOpen);
  }, []);

  useEffect(() => {
    if (location.hash === '#chatbot') setIsOpen(true);
  }, [location.hash]);

  useEffect(() => {
    if (tooltipShownRef.current || tooltipDismissed || isOpen) return;
    const checkTooltip = () => {
      const inactiveMs = Date.now() - lastActivityRef.current;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      if (inactiveMs >= 5000 || scrollPercent >= 70) {
        tooltipShownRef.current = true;
        setShowTooltip(true);
      }
    };
    const timer = window.setInterval(checkTooltip, 1000);
    const onActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('click', onActivity);
    window.addEventListener('keydown', onActivity);
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('click', onActivity);
      window.removeEventListener('keydown', onActivity);
    };
  }, [isOpen, tooltipDismissed]);

  const dismissTooltip = () => {
    setShowTooltip(false);
    setTooltipDismissed(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (flowType === 'rdv') {
      setInputValue('');
      if (formStep === 'name') {
        addMessage('user', val);
        setFormData((d) => ({ ...d, fullName: val }));
        addMessage('bot', t('publications.formAskPhone'));
        setFormStep('phone');
      } else if (formStep === 'phone') {
        addMessage('user', val);
        setFormData((d) => ({ ...d, phone: val }));
        addMessage('bot', t('publications.formAskEmail'));
        setFormStep('email');
      } else if (formStep === 'email') {
        addMessage('user', val);
        setFormData((d) => ({ ...d, email: val }));
        const allMsgs = [...messages, { id: '', role: 'user' as const, content: val }];
        const conversation = allMsgs
          .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Bot'}: ${m.content}`)
          .join('\n');
        submitLead({
          fullName: formData.fullName,
          phone: formData.phone,
          email: val,
          conversation,
        });
      }
      return;
    }

    if (flowType === 'question' && questionPhase === 'collecting_contacts') {
      addMessage('user', val);
      setInputValue('');
      if (formStep === 'name') {
        setFormData((d) => ({ ...d, fullName: val }));
        addMessage('bot', t('publications.formAskPhone'));
        setFormStep('phone');
      } else if (formStep === 'phone') {
        setFormData((d) => ({ ...d, phone: val }));
        addMessage('bot', t('publications.formAskEmail'));
        setFormStep('email');
      } else if (formStep === 'email') {
        addMessage('user', val);
        setFormData((d) => ({ ...d, email: val }));
        const aiHistory = chat.messages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'IA'}: ${getMessageText(m)}`)
          .join('\n');
        const fullHistory = [...messages, { id: '', role: 'user' as const, content: val }]
          .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Bot'}: ${m.content}`)
          .join('\n');
        submitLead({
          fullName: formData.fullName,
          phone: formData.phone,
          email: val,
          conversation: `=== Échanges IA ===\n${aiHistory}\n\n=== Suite conversation ===\n${fullHistory}`,
        });
      }
      return;
    }

    if (flowType === 'question' && questionPhase === 'asking') {
      addMessage('user', val);
      setInputValue('');
      chat.sendMessage({ text: val });
    }
  };

  useEffect(() => {
    if (
      flowType !== 'question' ||
      questionPhase !== 'asking' ||
      chat.status !== 'ready'
    )
      return;
    const assistantMsgs = chat.messages.filter((m) => m.role === 'assistant');
    if (assistantMsgs.length <= addedAiCountRef.current) return;
    const nextMsg = assistantMsgs[addedAiCountRef.current];
    const text = getMessageText(nextMsg);
    if (text) {
      addedAiCountRef.current += 1;
      addMessage('bot', text);
    }
  }, [chat.messages, chat.status, flowType, questionPhase, addMessage]);

  useEffect(() => {
    if (
      flowType !== 'question' ||
      questionPhase !== 'asking' ||
      chat.status !== 'ready' ||
      redirectShownRef.current
    )
      return;
    const assistantCount = chat.messages.filter((m) => m.role === 'assistant').length;
    if (assistantCount >= 2) {
      redirectShownRef.current = true;
      setQuestionPhase('redirect_choice');
      addMessage('bot', t('publications.questionRedirect'));
    }
  }, [chat.messages, chat.status, flowType, questionPhase, addMessage, t]);

  const handleRedirectChoice = (yes: boolean) => {
    if (yes) {
      setQuestionPhase('collecting_contacts');
      setFormStep('name');
      addMessage('bot', t('publications.formAskName'));
    } else {
      addMessage('bot', t('publications.questionNoThanks'));
      setTimeout(() => {
        setFlowType(null);
        setQuestionPhase(null);
        setMessages([]);
      }, 800);
    }
  };

  const showChoice = isOpen && !flowType && !submitted;
  const showThanks = isOpen && submitted;
  const submitError = state.errors?.length
    ? (state.errors as Array<{ message?: string }>)
        .map((e) => e.message || '')
        .filter(Boolean)
        .join(' • ') || null
    : null;

  const showInput =
    isOpen &&
    !submitted &&
    ((flowType === 'rdv') ||
      (flowType === 'question' && questionPhase === 'collecting_contacts') ||
      (flowType === 'question' && questionPhase === 'asking'));
  const showRedirectButtons = flowType === 'question' && questionPhase === 'redirect_choice';
  const disableInput = flowType === 'question' && questionPhase === 'asking' && isAiTyping;

  return (
    <>
      <div className="fixed bottom-6 right-4 sm:right-6 z-[9998] flex flex-col items-end gap-2">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="max-w-[280px] rounded-2xl bg-white px-4 py-3 shadow-xl border border-gray-100 text-sm text-[#0A2F73]"
            >
              <p className="font-medium mb-3">{t('publications.chatbotTooltip')}</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(true);
                    handleChoice('rdv');
                    dismissTooltip();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[#0A2F73]/5 border border-[#0A2F73]/10 text-[#0A2F73] text-sm font-medium hover:bg-[#0A2F73]/10 transition-all"
                >
                  {t('publications.quickReplyRdv')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(true);
                    handleChoice('question');
                    dismissTooltip();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[#E64501]/5 border border-[#E64501]/20 text-[#0A2F73] text-sm font-medium hover:bg-[#E64501]/10 transition-all"
                >
                  {t('publications.quickReplyQuestion')}
                </button>
              </div>
              <button
                type="button"
                onClick={dismissTooltip}
                className="mt-2 text-xs text-[#E64501] font-bold hover:underline"
              >
                {t('publications.close')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => {
            if (isOpen) {
              resetFlow();
              setIsOpen(false);
            } else {
              setIsOpen(true);
              dismissTooltip();
            }
          }}
          className="w-14 h-14 rounded-full bg-[#0A2F73] text-white shadow-xl shadow-[#0A2F73]/30 flex items-center justify-center hover:bg-[#E64501] hover:shadow-[#E64501]/30 transition-colors focus:outline-none focus:ring-4 focus:ring-[#0A2F73]/30"
          aria-label={t('publications.modalChatbot')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <Bot size={24} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 sm:right-6 sm:bottom-24 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] sm:max-w-[380px] h-[min(500px,75vh)] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#0A2F73] text-white shrink-0">
              <span className="font-bold text-base">{t('publications.modalChatbot')}</span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  resetFlow();
                }}
                className="p-2 -mr-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {showChoice && (
                <div className="space-y-2">
                  <p className="text-xs text-[#0A2F73]/50 font-medium mb-3">{t('publications.chooseOption')}</p>
                  <button
                    type="button"
                    onClick={() => handleChoice('rdv')}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#0A2F73]/10 text-[#0A2F73] text-sm font-medium hover:bg-[#0A2F73]/5 hover:border-[#0A2F73]/20 transition-all"
                  >
                    {t('publications.quickReplyRdv')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChoice('question')}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white border border-[#E64501]/20 text-[#0A2F73] text-sm font-medium hover:bg-[#E64501]/5 hover:border-[#E64501]/30 transition-all"
                  >
                    {t('publications.quickReplyQuestion')}
                  </button>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                      m.role === 'user'
                        ? 'bg-[#0A2F73] text-white rounded-br-md'
                        : 'bg-white text-[#0A2F73] border border-gray-100 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-sm text-sm text-[#0A2F73]/60 italic">
                    {t('publications.typingIndicator')}
                  </div>
                </div>
              )}

              {showRedirectButtons && (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleRedirectChoice(true)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-[#0A2F73] text-white text-sm font-medium hover:bg-[#0A2F73]/90 transition-all"
                  >
                    {t('publications.questionRedirectYes')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRedirectChoice(false)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-white border border-gray-200 text-[#0A2F73] text-sm font-medium hover:bg-slate-50 transition-all"
                  >
                    {t('publications.questionRedirectNo')}
                  </button>
                </div>
              )}

              {showThanks && (
                <div className="px-4 py-4 rounded-2xl rounded-bl-md bg-[#0A2F73]/10 border border-[#0A2F73]/10 text-[#0A2F73] text-sm font-medium">
                  {t('publications.formThanks')}
                </div>
              )}

              {submitError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {submitError}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form ref={formRef} onSubmit={handleFormspreeSubmit} className="hidden" aria-hidden>
              <input name="fullName" readOnly />
              <input name="phone" readOnly />
              <input name="email" readOnly />
              <input name="type" readOnly />
              <input name="conversation" readOnly />
            </form>

            {showInput && !showRedirectButtons && (
              <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100 shrink-0 flex gap-2">
                <input
                  type={formStep === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    formStep === 'name'
                      ? 'Ex: Jean Dupont'
                      : formStep === 'phone'
                        ? 'Ex: +221 77 123 45 67'
                        : formStep === 'email'
                          ? 'votre@email.com'
                          : t('publications.chatbotInputPlaceholder')
                  }
                  className="flex-1 min-h-[44px] px-4 py-3 bg-slate-50 rounded-xl outline-none border border-transparent focus:border-[#0A2F73]/30 text-[#0A2F73] text-base placeholder:text-gray-400 transition-colors"
                  disabled={disableInput || isSubmitting}
                  autoComplete={formStep === 'email' ? 'email' : formStep === 'name' ? 'name' : 'tel'}
                />
                <button
                  type="submit"
                  disabled={disableInput || isSubmitting || !inputValue.trim()}
                  className={`p-3 rounded-xl shrink-0 transition-all min-h-[44px] flex items-center justify-center ${
                    inputValue.trim()
                      ? 'bg-[#0A2F73] text-white hover:bg-[#E64501]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                </button>
              </form>
            )}

            {showThanks && (
              <div className="p-4 shrink-0">
                <button
                  type="button"
                  onClick={resetFlow}
                  className="w-full py-3 rounded-xl bg-[#0A2F73] text-white font-bold hover:bg-[#E64501] transition-colors"
                >
                  {t('publications.newRequest')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
