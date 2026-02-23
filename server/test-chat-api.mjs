/**
 * Test rapide de l'API /api/chat (à lancer avec le serveur démarré sur le port 3001).
 * Usage: node server/test-chat-api.mjs
 */
const url = 'http://localhost:3001/api/chat';
const body = {
  messages: [
    { id: '1', role: 'user', parts: [{ type: 'text', text: 'Bonjour' }] },
  ],
};

console.log('Envoi POST', url, '...');
const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
console.log('Status:', res.status, res.statusText);
const text = await res.text();
if (text.length < 500) console.log('Body:', text);
else console.log('Body (stream,', text.length, 'car.):', text.slice(0, 200) + '...');
process.exit(res.ok ? 0 : 1);
