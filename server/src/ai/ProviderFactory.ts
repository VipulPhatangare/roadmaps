import { AIProvider } from './AIProvider.interface';
import { GeminiProvider } from './GeminiProvider';
import { env } from '../config/env';

export class ProviderFactory {
  private static instance: AIProvider | null = null;

  static getProvider(): AIProvider {
    if (!this.instance) {
      if (env.aiProvider === 'gemini' || true) {
        this.instance = new GeminiProvider();
      }
    }
    return this.instance;
  }
}
