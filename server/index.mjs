/**
 * Serveur API pour le chatbot IA (route /api/chat).
 * Charge OPENAI_API_KEY depuis un fichier .env à la racine ou dans server/
 */
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const envPaths = [
  path.join(projectRoot, '.env'),
  path.join(projectRoot, 'env'),
  path.join(__dirname, '.env'),
  path.join(process.cwd(), '.env'),
];

function loadEnvKey() {
  if (process.env.OPENAI_API_KEY?.trim()) return process.env.OPENAI_API_KEY.trim().replace(/^\uFEFF/, '');
  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) continue;
    try {
      const content = fs.readFileSync(envPath, 'utf-8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.replace(/^\uFEFF/, '').trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const match = trimmed.match(/^(OPENAI_API_KEY|OPENAI_KEY)\s*=\s*(.*)$/i);
        if (match) {
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (value) return value;
        }
      }
    } catch (_) {}
  }
  return '';
}

const openAIKey = loadEnvKey();
if (openAIKey) process.env.OPENAI_API_KEY = openAIKey;
const hasOpenAIKey = Boolean(openAIKey);

import express from 'express';
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

if (!hasOpenAIKey) {
  console.warn('[server] OPENAI_API_KEY non trouvée. Fichiers .env vérifiés:', envPaths.map((p) => fs.existsSync(p) ? p : null).filter(Boolean).join(' ; ') || 'aucun trouvé');
}

const app = express();
const PORT = Number(process.env.PORT || process.env.CHAT_API_PORT || 3001);
const distPath = path.join(projectRoot, 'dist');
const serveFrontend = fs.existsSync(distPath);

app.use(express.json());

// CORS : autoriser le front (Vite en dev) à appeler l'API
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const SYSTEM_PROMPT = `Tu es l'expert fiscal et juridique d'ADOC.

1) FISCALITÉ SÉNÉGALAISE
- Tu aides en priorité sur la fiscalité sénégalaise (CGI).
- Rappels critiques : plafond 5 parts, art. 174 (10-45%), impôt max 43% du RNI.

2) DROIT DES AFFAIRES / OHADA
- Tu peux aussi répondre sur le droit commercial général OHADA.

3) RÉFÉRENCES OFFICIELLES À CITER
- Pour le droit commercial général OHADA, renvoie vers : https://www.africa-laws.org/OHADA/ACTE%20UNIFORME%20R%C3%89VIS%C3%89%20PORTANT%20SUR%20LE%20DROIT%20COMMERCIAL%20G%C3%89N%C3%89RAL.pdf
- Pour la fiscalité et le Code général des impôts sénégalais, renvoie vers : https://kof-experts.sn/wp-content/uploads/2024/04/CGI-annote-Janvier-2023.pdf

Toujours :
- Réponds en langage clair, structuré, et en français.
- Lorsque tu cites le droit ou la fiscalité, mentionne les références d'articles (ex : "article 10 de l'Acte uniforme" ou "article 174 du CGI") et rappelle aux utilisateurs qu'ils peuvent consulter les textes officiels aux liens ci-dessus pour vérifier les détails.`;

// ====== Chargement des corpus juridiques / fiscaux (OHADA + CGI) ======
function loadJsonCorpus(filename) {
  try {
    const fullPath = path.join(__dirname, filename);
    if (!fs.existsSync(fullPath)) return [];
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.warn(`[server] Impossible de charger le corpus ${filename}:`, e.message);
    return [];
  }
}

// Format attendu dans les fichiers JSON:
// [{ "id": "art1", "titre": "Article 1", "texte": "Contenu..." }, ...]
const OHADA_CORPUS = loadJsonCorpus('ohada-commercial.json');
const CGI_CORPUS = loadJsonCorpus('cgi-annote.json');

function simpleSearch(corpus, question, maxResults = 4) {
  if (!Array.isArray(corpus) || !corpus.length || !question) return [];
  const q = String(question || '').toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const scored = corpus.map((doc) => {
    const text = `${doc.titre || ''}\n${doc.texte || ''}`.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (text.includes(w)) score += 1;
    }
    return { doc, score };
  });

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((x) => x.doc);
}

/** Normalise les messages pour convertToModelMessages (parts + role obligatoires). */
function normalizeMessages(messages) {
  return messages.map((m, i) => {
    const role = m.role === 'system' || m.role === 'assistant' ? m.role : 'user';
    let parts = m.parts;
    if (!Array.isArray(parts)) {
      const text = typeof m.content === 'string' ? m.content : (m.text ?? '');
      parts = text ? [{ type: 'text', text }] : [];
    }
    return { ...m, role, parts };
  });
}

/** Convertit des messages simples (role + content) en format attendu par streamText. */
function toSimpleModelMessages(messages) {
  return messages.map((m) => {
    const role = m.role === 'system' || m.role === 'assistant' ? m.role : 'user';
    const text = Array.isArray(m.parts)
      ? m.parts.filter((p) => p.type === 'text').map((p) => p.text).join('')
      : String(m.content ?? m.text ?? '');
    return { role, content: text };
  });
}

app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body || {};
    const messages = body.messages ?? body.message ?? [];
    const list = Array.isArray(messages) ? messages : [messages];

    if (list.length === 0) {
      res.status(400).json({ error: 'Body must contain a non-empty "messages" array.' });
      return;
    }

    const normalized = normalizeMessages(list);
    let modelMessages;

    try {
      modelMessages = await convertToModelMessages(normalized);
    } catch (convertErr) {
      console.warn('[api/chat] convertToModelMessages failed, using simple format:', convertErr.message);
      modelMessages = toSimpleModelMessages(normalized);
    }

    // ===== Enrichissement avec les textes OHADA / CGI =====
    const lastUser = [...modelMessages].reverse().find((m) => m.role === 'user');
    const userQuestion = lastUser
      ? String(lastUser.content || lastUser.text || '')
      : '';

    const ohadaHits = simpleSearch(OHADA_CORPUS, userQuestion, 4);
    const cgiHits = simpleSearch(CGI_CORPUS, userQuestion, 4);

    let contextBlocks = '';

    if (ohadaHits.length) {
      contextBlocks +=
        '\n\n[EXTRAITS OHADA – Acte uniforme sur le droit commercial général]\n' +
        ohadaHits
          .map(
            (a) =>
              `${a.titre || ''}\n${a.texte || ''}\n---`
          )
          .join('\n');
    }

    if (cgiHits.length) {
      contextBlocks +=
        '\n\n[EXTRAITS CODE GÉNÉRAL DES IMPÔTS (CGI)]\n' +
        cgiHits
          .map(
            (a) =>
              `${a.titre || ''}\n${a.texte || ''}\n---`
          )
          .join('\n');
    }

    const finalSystemPrompt =
      contextBlocks.trim().length > 0
        ? `${SYSTEM_PROMPT}\n\nTu disposes des extraits suivants. Utilise-les en priorité pour répondre de manière précise et cite les articles lorsque c'est pertinent :\n${contextBlocks}`
        : SYSTEM_PROMPT;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: finalSystemPrompt,
      messages: modelMessages,
    });

    result.pipeUIMessageStreamToResponse(res, {
      originalMessages: normalized,
    });
  } catch (err) {
    console.error('[api/chat] ERROR:', err.message || err);
    if (!res.headersSent) {
      let message = err.message || 'Erreur lors de la génération de la réponse.';
      if (!hasOpenAIKey) message = 'OPENAI_API_KEY manquante. Ajoutez-la dans un fichier .env à la racine.';
      else if (String(err.message || '').includes('401') || String(err.message || '').toLowerCase().includes('unauthorized')) message = 'Clé API OpenAI invalide. Vérifiez OPENAI_API_KEY dans .env.';
      res.status(500).json({ error: message });
    }
  }
});

/** Endpoint pour envoi des leads (ChatWidget formulaire) */
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'mouhamadoumansoursow@yahoo.com';

app.post('/api/contact-lead', async (req, res) => {
  try {
    const { fullName, phone, email, message, type } = req.body || {};
    if (!fullName?.trim() || !phone?.trim() || !email?.trim()) {
      res.status(400).json({ error: 'fullName, phone et email sont requis.' });
      return;
    }

    const nodemailer = (await import('nodemailer')).default;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mail.yahoo.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' }
        : undefined,
    });

    const subject = type === 'question'
      ? `[ADOC] Question expert-comptable - ${fullName}`
      : `[ADOC] Demande de rendez-vous - ${fullName}`;
    const text = [
      `Type: ${type === 'question' ? 'Question expert-comptable' : 'Prise de rendez-vous'}`,
      `Nom: ${fullName}`,
      `Téléphone: ${phone}`,
      `Email: ${email}`,
      message ? `Message: ${message}` : '',
    ].filter(Boolean).join('\n');

    if (process.env.SMTP_USER) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: CONTACT_EMAIL,
        subject,
        text,
      });
      res.json({ ok: true });
    } else {
      console.log('[contact-lead] SMTP non configuré. Données reçues:', { fullName, phone, email, message, type });
      res.status(503).json({ error: 'SMTP non configuré. Ajoutez SMTP_USER, SMTP_PASS et CONTACT_EMAIL dans .env' });
    }
  } catch (err) {
    console.error('[contact-lead] ERROR:', err.message || err);
    res.status(500).json({ error: err.message || 'Erreur lors de l\'envoi.' });
  }
});

app.get('/api/chat/health', (_req, res) => {
  const envChecked = envPaths.map((p) => ({ path: p, exists: fs.existsSync(p) }));
  res.json({
    ok: true,
    hasOpenAIKey: hasOpenAIKey,
    hint: hasOpenAIKey ? null : 'Créez un fichier .env à la racine (à côté de package.json) avec une ligne: OPENAI_API_KEY=sk-...',
    envChecked: hasOpenAIKey ? undefined : envChecked,
  });
});

// Si dist/ existe (après npm run build), servir le site + fallback SPA
if (serveFrontend) {
  app.use(express.static(distPath, { index: false }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  if (serveFrontend) {
    console.log(`Serveur: http://0.0.0.0:${PORT} (site + API)`);
  } else {
    console.log(`Chat API: http://localhost:${PORT} (POST /api/chat)`);
    if (!hasOpenAIKey) console.log('  → Ouvrez http://localhost:' + PORT + '/api/chat/health pour vérifier le chargement du .env');
  }
});
