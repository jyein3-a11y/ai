/**
 * Client service to communicate with backend API Routes (/api/verify-key and /api/gemini).
 * Prevents CORS issues and keeps Google API calls server-to-server.
 * No persistent storage (localStorage/sessionStorage) is used; all keys remain in-memory.
 */

export interface VerificationResult {
  success: boolean;
  message?: string;
  error?: string;
  model?: string;
}

export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Sanitize API Key (trim whitespace and remove accidental enclosing quotes)
 */
export function sanitizeApiKey(key: string): string {
  return (key || '').trim().replace(/^["']|["']$/g, '');
}

/**
 * Verifies the Gemini API Key.
 * 1. Attempts server-to-server proxy via /api/verify-key (CORS-free, keeps keys out of browser direct network log if supported)
 * 2. If the backend route is unavailable (e.g., 404 or HTML response on static Vercel build),
 *    gracefully falls back to direct Google Generative Language API verification.
 */
export async function verifyGeminiApiKey(apiKey: string): Promise<VerificationResult> {
  const sanitized = sanitizeApiKey(apiKey);
  if (!sanitized) {
    return {
      success: false,
      error: 'API Key를 입력해 주세요.',
    };
  }

  if (sanitized.length < 20) {
    return {
      success: false,
      error: 'API Key 형식이 올바르지 않습니다. Google AI Studio에서 발급받은 키를 다시 확인해 주세요.',
    };
  }

  // 1. Try Backend Serverless Route (/api/verify-key)
  try {
    const response = await fetch('/api/verify-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: sanitized }),
    });

    const contentType = response.headers.get('content-type') || '';

    // If server responded with JSON
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data?.success) {
        return {
          success: true,
          message: data.message || 'Gemini API Key 유효성 검증이 완료되었습니다.',
          model: data.model || 'gemini-3.8-flash',
        };
      }
      if (!response.ok && data?.error) {
        return {
          success: false,
          error: data.error,
        };
      }
    }
  } catch (err) {
    console.warn('[GeminiApi] Backend /api/verify-key failed or unavailable, falling back to direct probe:', err);
  }

  // 2. Client-side Direct Fallback (For static Vercel deploys or when /api route is not configured)
  try {
    // Google AI Studio allows direct CORS GET on /models endpoint with key
    const directUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(sanitized)}`;
    const directRes = await fetch(directUrl);
    const directData = await directRes.json().catch(() => null);

    if (directRes.ok && directData && Array.isArray(directData.models)) {
      return {
        success: true,
        message: 'Gemini API Key가 성공적으로 승인 및 활성화되었습니다.',
        model: 'gemini-2.5-flash',
      };
    }

    if (directData?.error) {
      const errMsg = directData.error.message || directData.error.status || '';
      if (errMsg.includes('API_KEY_INVALID') || directRes.status === 400 || directRes.status === 401) {
        return {
          success: false,
          error: '유효하지 않은 API Key입니다. Google AI Studio에서 키를 다시 확인해 주세요.',
        };
      }
      if (directRes.status === 429) {
        return {
          success: false,
          error: 'Gemini API 호출 한도(Quota)를 초과했습니다. 잠시 후 다시 시도해 주세요.',
        };
      }
      if (directRes.status === 403) {
        return {
          success: false,
          error: 'API 접근 권한이 없습니다. Generative Language API 활성화 상태를 확인해 주세요.',
        };
      }
      return {
        success: false,
        error: `인증 실패: ${errMsg}`,
      };
    }

    return {
      success: false,
      error: 'Google 서버로부터 응답을 받지 못했습니다. 네트워크 연결 및 API Key를 확인해 주세요.',
    };
  } catch (directErr: any) {
    return {
      success: false,
      error: 'API Key 검증 서버 및 Google 서비스에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.',
    };
  }
}

/**
 * Calls Gemini AI to generate response.
 * First tries backend proxy /api/gemini; if unavailable, falls back to direct call.
 */
export async function callGemini(
  apiKey: string,
  prompt: string,
  systemInstruction?: string
): Promise<GeminiResponse> {
  const sanitized = sanitizeApiKey(apiKey);
  if (!sanitized) {
    return {
      success: false,
      error: '승인된 API Key가 없습니다. 먼저 API Key를 활성화해 주세요.',
    };
  }

  // 1. Try Backend Proxy (/api/gemini)
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: sanitized,
        prompt,
        systemInstruction,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data?.success) {
        return {
          success: true,
          text: data.text,
        };
      }
      if (!response.ok && data?.error) {
        return {
          success: false,
          error: data.error,
        };
      }
    }
  } catch (err) {
    console.warn('[GeminiApi] Backend /api/gemini failed, attempting direct fallback:', err);
  }

  // 2. Direct Fallback to Google Generative Language API
  try {
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let lastError = '응답 생성 실패';

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(sanitized)}`;
        const payload: any = {
          contents: [{ parts: [{ text: prompt }] }],
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }],
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const resData = await res.json().catch(() => null);
        if (res.ok && resData?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return {
            success: true,
            text: resData.candidates[0].content.parts[0].text,
          };
        }

        if (resData?.error) {
          lastError = resData.error.message || lastError;
          if (res.status === 400 || res.status === 401 || res.status === 403) {
            break; // Stop trying other models for auth failures
          }
        }
      } catch (e: any) {
        lastError = e?.message || lastError;
      }
    }

    return {
      success: false,
      error: `AI 응답 실패: ${lastError}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Google Gemini 서버와의 통신에 실패했습니다.',
    };
  }
}
