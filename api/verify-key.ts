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
 * Vercel Serverless Function / Backend API Route: /api/verify-key
 * Validates client-provided Gemini API Key server-to-server.
 * Zero DB persistence - processed strictly in-memory.
 */
export default async function handler(req: any, res: any) {
  // CORS Headers for Vercel / Cloud deployments
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
    const rawKey = body?.apiKey || process.env.GEMINI_API_KEY;

    if (!rawKey || typeof rawKey !== 'string' || !rawKey.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API Key를 입력해 주세요.',
      });
    }

    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

    // Check key format
    if (apiKey.length < 20) {
      return res.status(400).json({
        success: false,
        error: '유효한 Google AI Studio API Key 형식이 아닙니다. 발급받은 키를 다시 확인해 주세요.',
      });
    }

    // Mask key in logs
    const masked = apiKey.length <= 8 ? '****' : `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
    console.log(`[API/Vercel] Verifying Gemini API Key: ${masked}`);

    // Call Google GenAI server-to-server with model fallback
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
        // If authentication failed directly, stop trying other models
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
      return res.status(200).json({
        success: true,
        message: 'Gemini API Key가 성공적으로 승인 및 활성화되었습니다.',
        model: verifiedModel,
        verifiedAt: new Date().toISOString(),
      });
    }

    const errorMsg = lastError?.message || String(lastError || '응답을 수신하지 못했습니다.');
    console.error('[API/Vercel] Gemini verification failed:', errorMsg);

    if (
      errorMsg.includes('API_KEY_INVALID') ||
      errorMsg.includes('400') ||
      errorMsg.includes('401') ||
      errorMsg.includes('unregistered')
    ) {
      return res.status(401).json({
        success: false,
        error: '유효하지 않은 API Key입니다. Google AI Studio에서 발급받은 키를 다시 확인해 주세요.',
      });
    }

    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
      return res.status(429).json({
        success: false,
        error: 'Gemini API 호출 한도(Quota)를 초과했습니다. 잠시 후 다시 시도해 주세요.',
      });
    }

    if (errorMsg.includes('PERMISSION_DENIED') || errorMsg.includes('403')) {
      return res.status(403).json({
        success: false,
        error: '해당 API Key의 접근 권한이 거부되었습니다. 프로젝트 API 활성화 여부를 확인해 주세요.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Google Gemini 서버와의 통신에 실패했습니다. 네트워크 상태 또는 잠시 후 다시 시도해 주세요.',
    });
  } catch (error: any) {
    console.error('[API/Vercel] Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'API Key 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    });
  }
}
