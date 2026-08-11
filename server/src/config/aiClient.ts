import { GoogleGenAI } from '@google/genai';
import { env } from './env';
import { log } from '../utils/logger';

export async function generateContentWithRetry(prompt: string, maxRetries: number = 5): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  let attempt = 0;
  let delayMs = 10000; // 10 seconds initial delay on rate limits to clear 5 RPM window

  while (attempt < maxRetries) {
    try {
      attempt++;
      const response = await ai.models.generateContent({
        model: env.geminiModel || 'gemini-3.6-flash',
        contents: prompt,
      });

      if (response.text) {
        return response.text;
      }
      throw new Error('Empty response from Gemini API');
    } catch (err: any) {
      const isRateLimitOr503 =
        err.message?.includes('503') ||
        err.message?.includes('429') ||
        err.message?.includes('UNAVAILABLE') ||
        err.message?.includes('RESOURCE_EXHAUSTED') ||
        err.message?.includes('high demand');

      if (isRateLimitOr503 && attempt < maxRetries) {
        log('WARN', 'AIClient', `Gemini 429/503 rate limit encountered (Attempt ${attempt}/${maxRetries}). Retrying in ${delayMs / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs += 10000; // Step up retry delay: 10s, 20s, 30s
      } else {
        log('ERROR', 'AIClient', `Gemini API call failed on attempt ${attempt}: ${err.message}`);
        throw err;
      }
    }
  }

  throw new Error(`Failed to generate content after ${maxRetries} attempts`);
}
