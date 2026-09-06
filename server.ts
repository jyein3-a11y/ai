import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with size limit
  app.use(express.json({ limit: '1mb' }));

  // CORS headers for safety and compatibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Helper: Mask API Key for safe logs
  const maskKey = (key: string) => {
    if (!key || typeof key !== 'string') return '[EMPTY]';
    if (key.length <= 8) return '****';
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  /**
   * 1. API Route: /api/verify-key
   * Validates client-provided Gemini API Key server-to-server.
   * Zero DB persistence - processed strictly in-memory.
   */
  app.post('/api/verify-key', async (req, res) => {
    try {
      const rawKey = req.body?.apiKey || process.env.GEMINI_API_KEY;

      if (!rawKey || typeof rawKey !== 'string' || !rawKey.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Gemini API Key를 입력해 주세요.'
        });
      }

      const apiKey = rawKey.trim();

      // Quick client key pattern sanity check (AIzaSy...)
      if (!apiKey.startsWith('AIzaSy') || apiKey.length < 30) {
        return res.status(400).json({
          success: false,
          error: '유효한 Google AI Studio API Key 형식이 아닙니다. ("AIzaSy..."로 시작하는 39자리 문자열)'
        });
      }

      // Safe server logging (masked key only)
      console.log(`[API] Verifying Gemini API Key: ${maskKey(apiKey)}`);

      // Initialize Google GenAI with the in-memory key
      const ai = new GoogleGenAI({ apiKey });

      // Run a lightweight probe to confirm model access & quota
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping',
      });

      if (response && response.text) {
        return res.json({
          success: true,
          message: 'Gemini API Key가 성공적으로 승인 및 활성화되었습니다.',
          model: 'gemini-3.8-flash',
          verifiedAt: new Date().toISOString()
        });
      }

      return res.status(500).json({
        success: false,
        error: '응답을 수신하지 못했습니다. 잠시 후 다시 시도해 주세요.'
      });
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      console.error('[API] Gemini verification failed:', errorMsg);

      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('400') || errorMsg.includes('401') || errorMsg.includes('unregistered')) {
        return res.status(401).json({
          success: false,
          error: '유효하지 않은 API Key입니다. Google AI Studio에서 발급받은 키를 다시 확인해 주세요.'
        });
      }

      if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
        return res.status(429).json({
          success: false,
          error: 'Gemini API 호출 한도(Quota)를 초과했습니다. 잠시 후 다시 시도해 주세요.'
        });
      }

      if (errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('403')) {
        return res.status(403).json({
          success: false,
          error: '해당 API Key의 접근 권한이 거부되었습니다. 프로젝트 API 활성화 여부를 확인해 주세요.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Google Gemini 서버와의 통신에 실패했습니다. 네트워크 상태 또는 잠시 후 다시 시도해 주세요.'
      });
    }
  });

  /**
   * 2. API Route: /api/gemini
   * General server-to-server Gemini generation endpoint using the in-memory key.
   */
  app.post('/api/gemini', async (req, res) => {
    try {
      const { apiKey: providedKey, prompt, systemInstruction } = req.body;
      const rawKey = providedKey || process.env.GEMINI_API_KEY;

      if (!rawKey || typeof rawKey !== 'string' || !rawKey.trim()) {
        return res.status(401).json({
          success: false,
          error: 'Gemini API Key가 제공되지 않았습니다. 먼저 API Key를 등록해 주세요.'
        });
      }

      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({
          success: false,
          error: '질문이나 요청 내용을 입력해 주세요.'
        });
      }

      const apiKey = rawKey.trim();
      console.log(`[API] Gemini request received with key: ${maskKey(apiKey)}`);

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt.trim(),
        config: systemInstruction
          ? { systemInstruction: String(systemInstruction) }
          : undefined,
      });

      return res.json({
        success: true,
        text: response.text || ''
      });
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      console.error('[API] Gemini execution failed:', errorMsg);

      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401')) {
        return res.status(401).json({
          success: false,
          error: '유효하지 않거나 만료된 API Key입니다.'
        });
      }

      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        return res.status(429).json({
          success: false,
          error: 'API 호출 사용량이 초과되었습니다. 잠시 후 다시 시도해 주세요.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Gemini AI 응답 생성에 실패했습니다. 다시 시도해 주세요.'
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Ready and listening on port ${PORT}`);
  });
}

startServer();
