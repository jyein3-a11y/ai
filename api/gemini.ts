import { GoogleGenAI } from '@google/genai';

/**
 * Helper to safely extract JSON body across various Vercel / Node runtimes
 */
async function getRequestBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  try {
    const buffers: any[] = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

/**
 * Vercel Serverless Function / Backend API Route: /api/gemini
 * General server-to-server Gemini generation endpoint using the in-memory key.
 * Zero DB persistence - processed strictly in-memory.
 */
export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST 요청만 지원합니다.' });
  }

  try {
    const body = await getRequestBody(req);
    const { apiKey: providedKey, prompt, systemInstruction } = body || {};
    const rawKey = providedKey || process.env.GEMINI_API_KEY;

    if (!rawKey || typeof rawKey !== 'string' || !rawKey.trim()) {
      return res.status(401).json({
        success: false,
        error: 'Gemini API Key가 제공되지 않았습니다. 먼저 API Key를 등록해 주세요.',
      });
    }

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        error: '질문이나 요청 내용을 입력해 주세요.',
      });
    }

    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
    const masked = apiKey.length <= 8 ? '****' : `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
    console.log(`[API/Vercel] Gemini request received with key: ${masked}`);

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
      return res.status(200).json({
        success: true,
        text: textResponse,
      });
    }

    const errorMsg = lastError?.message || String(lastError || '응답 생성 실패');
    console.error('[API/Vercel] Gemini execution failed:', errorMsg);

    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('401')) {
      return res.status(401).json({
        success: false,
        error: '유효하지 않거나 만료된 API Key입니다.',
      });
    }

    if (errorMsg.includes('429') || errorMsg.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'API 호출 사용량이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Gemini AI 응답 생성에 실패했습니다. 다시 시도해 주세요.',
    });
  } catch (error: any) {
    console.error('[API/Vercel] Unexpected error in gemini route:', error);
    return res.status(500).json({
      success: false,
      error: 'Gemini 요청 처리 중 서버 오류가 발생했습니다.',
    });
  }
}
