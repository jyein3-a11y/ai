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

export async function verifyGeminiApiKey(apiKey: string): Promise<VerificationResult> {
  const trimmed = (apiKey || '').trim();
  if (!trimmed) {
    return {
      success: false,
      error: 'API Key를 입력해 주세요.'
    };
  }

  if (!trimmed.startsWith('AIzaSy') || trimmed.length < 30) {
    return {
      success: false,
      error: 'Google AI Studio API Key 형식이 아닙니다. ("AIzaSy..."로 시작하는 39자리 문자열)'
    };
  }

  try {
    const response = await fetch('/api/verify-key', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ apiKey: trimmed }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `인증 실패 (상태 코드: ${response.status})`
      };
    }

    if (data?.success) {
      return {
        success: true,
        message: data.message || 'Gemini API Key 유효성 검증이 완료되었습니다.',
        model: data.model,
      };
    }

    return {
      success: false,
      error: data?.error || '알 수 없는 검증 오류가 발생했습니다.'
    };
  } catch (err: any) {
    return {
      success: false,
      error: '백엔드 서버와 통신할 수 없습니다. 네트워크 연결 상태를 확인해 주세요.'
    };
  }
}

export async function callGemini(
  apiKey: string,
  prompt: string,
  systemInstruction?: string
): Promise<GeminiResponse> {
  const trimmedKey = (apiKey || '').trim();
  if (!trimmedKey) {
    return {
      success: false,
      error: '승인된 API Key가 없습니다. 먼저 API Key를 활성화해 주세요.'
    };
  }

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: trimmedKey,
        prompt,
        systemInstruction,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `요청 실패 (상태 코드: ${response.status})`
      };
    }

    if (data?.success) {
      return {
        success: true,
        text: data.text
      };
    }

    return {
      success: false,
      error: data?.error || 'AI 응답 수신에 실패했습니다.'
    };
  } catch (err: any) {
    return {
      success: false,
      error: '서버와의 통신 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    };
  }
}
