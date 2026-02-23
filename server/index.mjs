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

const SYSTEM_PROMPT = `Tu es l'expert fiscal d'ADOC. Ton rôle est d'aider les utilisateurs avec la fiscalité sénégalaise (CGI 2025). 
Règles critiques : Plafond 5 parts, Art. 174 (10-45%), impôt max 43% du RNI.`;

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

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
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
