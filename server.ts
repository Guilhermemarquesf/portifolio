import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();

  // Allow larger payload for audio base64 data
  app.use(express.json({ limit: '25mb' }));

  // Audio Transcription endpoint using model gemini-3.5-transcribe
  app.post('/api/transcribe', async (req: Request, res: Response) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body;

      if (!audioBase64) {
        return res.status(400).json({ error: 'Nenhum áudio fornecido para transcrição.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'Chave GEMINI_API_KEY não configurada no servidor.',
        });
      }

      // Normalize mimeType for Gemini API
      let cleanMime = (mimeType || 'audio/webm').split(';')[0].trim().toLowerCase();
      if (cleanMime === 'audio/m4a' || cleanMime === 'audio/x-m4a') {
        cleanMime = 'audio/mp4';
      } else if (cleanMime === 'audio/mp3') {
        cleanMime = 'audio/mpeg';
      }

      const audioPart = {
        inlineData: {
          mimeType: cleanMime,
          data: audioBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: [
          audioPart,
          'Transcreva este áudio de forma fiel e exata em português do Brasil. Retorne apenas o texto transcrito, sem introduções, aspas ou explicações adicionais.',
        ],
      });

      const transcript = response.text?.trim() || '';
      return res.json({ transcript });
    } catch (error: any) {
      console.warn('Aviso no processamento da transcrição de áudio:', error?.message);
      return res.status(500).json({
        error: error?.message || 'Falha ao processar a transcrição com Gemini 3.5 Transcribe.',
      });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', model: 'gemini-3.5-transcribe' });
  });

  app.get('/api/maps-config', (_req, res) => {
    res.json({
      apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
    });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT} com transcrição de áudio Gemini 3.5 Transcribe`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
