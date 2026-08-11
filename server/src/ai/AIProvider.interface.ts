export interface AIStructuredOptions {
  model?: 'fast' | 'reasoning';
  systemPrompt: string;
  userPrompt: string;
  outputSchema?: object;
  maxTokens?: number;
  temperature?: number;
}

export interface AIProvider {
  name: string;
  generateStructured<T>(options: AIStructuredOptions): Promise<T>;
}
