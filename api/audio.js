import { config as dotenvConfig } from 'dotenv';
import { synthesizeKokoro } from '../lib/kokoro.js';
import { synthesizeSupertonic } from '../lib/supertonic/engine.js';

dotenvConfig();
dotenvConfig({ path: 'api/.env', override: false });

// English is Kokoro. Every other language in the menu is spoken by Supertonic 3.
const KOKORO_LANGS = new Set(['en']);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }

    const text = String(body?.text || '').replace(/\s+/g, ' ').trim().slice(0, 1800);
    const lang = String(body?.lang || 'en').toLowerCase();
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const useKokoro = KOKORO_LANGS.has(lang);
    console.log(`Speaking with ${useKokoro ? 'Kokoro' : 'Supertonic'} (${lang})`);
    const buffer = useKokoro
      ? await synthesizeKokoro(text)
      : await synthesizeSupertonic(text, lang);

    if (!buffer || buffer.length < 44) {
      throw new Error('Speech engine returned empty audio');
    }

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('X-Speech-Engine', useKokoro ? 'kokoro' : 'supertonic');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Error generating audio:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate audio',
    });
  }
}
