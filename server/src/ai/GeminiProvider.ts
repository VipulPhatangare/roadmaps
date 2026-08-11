import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIStructuredOptions } from './AIProvider.interface';
import { env } from '../config/env';
import { log } from '../utils/logger';

export class GeminiProvider implements AIProvider {
  public name = 'Google Gemini';
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }

  async generateStructured<T>(options: AIStructuredOptions): Promise<T> {
    const modelName = env.geminiModel || 'gemini-2.5-flash';
    const fullPrompt = `${options.systemPrompt}\n\nUSER REQUEST:\n${options.userPrompt}\n\nCRITICAL: Return ONLY raw, valid JSON matching the required schema. Do NOT wrap in markdown or markdown backticks.`;

    log('DEBUG', 'GeminiProvider', `Calling ${modelName}...`);

    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: fullPrompt,
        config: {
          temperature: options.temperature ?? 0.2,
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const cleanJsonStr = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();

      return JSON.parse(cleanJsonStr) as T;
    } catch (err: any) {
      log('ERROR', 'GeminiProvider', `Gemini API call failed: ${err.message}`);
      throw new Error(`Gemini Provider Error: ${err.message}`);
    }
  }
}
