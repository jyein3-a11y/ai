import { GoogleGenAI } from '@google/genai';

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
    const rawKey = req.body?.apiKey || process.env.GEMINI_API_KEY;

    if (!rawKey || typeof rawKey !== 'string' || !rawKey.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Gemini API Key를 입력해 주세요.',
      });
    }

    const apiKey = rawKey.trim();

    // Check key format
    if (!apiKey.startsWith('AIzaSy') || apiKey.length < 30) {
      return res.status(400).json({
        success: false,
        error: '유효한 Google AI Studio API Key 형식이 아닙니다. ("AIzaSy..."로 시작하는 39자리 문자열)',
      });
    }

    // Mask key in logs
    const masked = apiKey.length <= 8 ? '****' : `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
    console.log(`[API/Vercel] Verifying Gemini API Key: ${masked}`);

    // Call Google GenAI server-to-server
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Ping',
    });

    if (response && response.text) {
      return res.status(200).json({
        success: true,
        message: 'Gemini API Key가 성공적으로 승인 및 활성화되었습니다.',
        model: 'gemini-3.8-flash',
        verifiedAt: new Date().toISOString(),
      });
    }

    return res.status(500).json({
      success: false,
      error: '응답을 수신하지 못했습니다. 잠시 후 다시 시도해 주세요.',
    });
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
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
  }
}
