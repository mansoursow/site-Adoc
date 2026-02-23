import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    messages: [
      {
        role: 'system',
        content: `Tu es l'expert fiscal d'ADOC. Ton rôle est d'aider les utilisateurs avec la fiscalité sénégalaise (CGI 2025). 
        Règles critiques : Plafond 5 parts, Art. 174 (10-45%), impôt max 43% du RNI.`
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}