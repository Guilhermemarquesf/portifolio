import express from 'express';
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

  app.use(express.json({ limit: '5mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/maps-config', (_req, res) => {
    res.json({
      apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
    });
  });

  // Google Maps Grounding via Gemini 4 Hydrogen (server-side)
  app.post('/api/maps-grounding', async (req, res) => {
    try {
      const { query, lat, lng, locationName } = req.body as {
        query?: string;
        lat?: number;
        lng?: number;
        locationName?: string;
      };

      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ error: 'Informe uma consulta de localização válida.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Chave GEMINI_API_KEY não configurada no servidor.' });
      }

      const contextualPrompt = locationName
        ? `Considerando a região de ${locationName} em Minas Gerais, Brasil: ${query.trim()}. Responda em português do Brasil de forma objetiva e útil para visitantes.`
        : `${query.trim()}. Responda em português do Brasil de forma objetiva e útil.`;

      const hasCoords = typeof lat === 'number' && typeof lng === 'number' && !Number.isNaN(lat) && !Number.isNaN(lng);

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: contextualPrompt,
        config: {
          tools: [{ googleMaps: {} }],
          ...(hasCoords
            ? {
                toolConfig: {
                  retrievalConfig: {
                    latLng: {
                      latitude: lat,
                      longitude: lng,
                    },
                  },
                },
              }
            : {}),
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const places = chunks
        .filter((chunk: any) => chunk?.maps?.uri || chunk?.maps?.title)
        .map((chunk: any) => ({
          title: chunk.maps?.title || 'Local no Google Maps',
          uri: chunk.maps?.uri || '',
          reviewSnippets: (chunk.maps?.placeAnswerSources?.reviewSnippets || [])
            .map((s: any) => s?.text || s?.reviewText || '')
            .filter(Boolean)
            .slice(0, 2),
        }));

      return res.json({
        text: response.text || '',
        places,
      });
    } catch (error: any) {
      console.warn('Erro no Maps Grounding:', error?.message);
      return res.status(500).json({
        error: error?.message || 'Não foi possível consultar os dados atualizados do Google Maps.',
      });
    }
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
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
