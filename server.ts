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

      const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

      // Sanity check length
      if (apiKey.length < 20) {
        return res.status(400).json({
          success: false,
          error: '유효한 Google AI Studio API Key 형식이 아닙니다. 발급받은 키를 다시 확인해 주세요.'
        });
      }

      // Safe server logging (masked key only)
      console.log(`[API] Verifying Gemini API Key: ${maskKey(apiKey)}`);

      // Initialize Google GenAI with the in-memory key
      const ai = new GoogleGenAI({ apiKey });
      const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
      let verifiedModel = 'gemini-3.8-flash';
      let verified = false;
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: 'Ping',
          });

          if (response && (response.text !== undefined || (response as any).candidates)) {
            verifiedModel = model;
            verified = true;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const msg = err?.message || String(err);
          if (
            msg.includes('API_KEY_INVALID') ||
            msg.includes('400') ||
            msg.includes('401') ||
            msg.includes('PERMISSION_DENIED') ||
            msg.includes('403')
          ) {
            break;
          }
        }
      }

      if (verified) {
        return res.json({
          success: true,
          message: 'Gemini API Key가 성공적으로 승인 및 활성화되었습니다.',
          model: verifiedModel,
          verifiedAt: new Date().toISOString()
        });
      }

      const errorMsg = lastError?.message || String(lastError || '응답을 수신하지 못했습니다.');
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
    } catch (error: any) {
      console.error('[API] Unexpected error in verify-key:', error);
      return res.status(500).json({
        success: false,
        error: 'API Key 검증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
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

      const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
      console.log(`[API] Gemini request received with key: ${maskKey(apiKey)}`);

      const ai = new GoogleGenAI({ apiKey });
      const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];
      let textResponse = '';
      let success = false;
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: prompt.trim(),
            config: systemInstruction
              ? { systemInstruction: String(systemInstruction) }
              : undefined,
          });

          if (response && response.text) {
            textResponse = response.text;
            success = true;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const msg = err?.message || String(err);
          if (msg.includes('API_KEY_INVALID') || msg.includes('401') || msg.includes('PERMISSION_DENIED')) {
            break;
          }
        }
      }

      if (success) {
        return res.json({
          success: true,
          text: textResponse
        });
      }

      const errorMsg = lastError?.message || String(lastError || 'Gemini AI 응답 생성에 실패했습니다.');
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
    } catch (error: any) {
      console.error('[API] Unexpected error in gemini route:', error);
      return res.status(500).json({
        success: false,
        error: 'Gemini 처리 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
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
