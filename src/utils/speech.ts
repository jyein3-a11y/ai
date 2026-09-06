/**
 * TTS (Text-to-Speech) 음성 읽어주기 유틸리티
 * Web Speech API 기반 한국어 음성 지원
 */

class SpeechService {
  private isEnabled: boolean = true;
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean, text: string) => void> = new Set();
  private currentText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voice cache warmup
      };
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public subscribe(listener: (speaking: boolean, text: string) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean, text: string) {
    this.isSpeaking = speaking;
    this.currentText = text;
    this.listeners.forEach((listener) => listener(speaking, text));
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify(false, '');
  }

  public speak(text: string, force: boolean = false) {
    if (!this.isEnabled && !force) {
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech API is not supported in this environment.');
      return;
    }

    // Cancel current utterance
    window.speechSynthesis.cancel();

    // Clean text for speech: remove markdown, brackets, emoji symbols that sound strange
    const cleanedText = text
      .replace(/[🔊🙋🏠💼🆘🛏❓✅📞💬👤📅❌↩️]/g, '')
      .replace(/\[|\]/g, '')
      .replace(/☐/g, '')
      .replace(/#/g, '')
      .replace(/\*/g, '')
      .replace(/①|②|③|④|⑤/g, '')
      .trim();

    if (!cleanedText) return;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.95; // Slightly slower, clear pace for accessibility
    utterance.pitch = 1.0;

    // Try finding Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.includes('ko') || v.lang.includes('KR'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utterance.onstart = () => {
      this.notify(true, cleanedText);
    };

    utterance.onend = () => {
      this.notify(false, '');
    };

    utterance.onerror = () => {
      this.notify(false, '');
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('TTS speak error:', e);
      this.notify(false, '');
    }
  }
}

export const speechService = new SpeechService();
