import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || '4001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roadmap_ai',
  jwtSecret: process.env.JWT_SECRET || 'roadmap_ai_jwt_super_secret_2026_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
  geminiRpm: parseInt(process.env.GEMINI_RPM || '60'),
  roadmapApiKey: process.env.ROADMAP_API_KEY || 'default_secret_api_key_2026',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

export function validateEnv() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[ENV] Warning: GEMINI_API_KEY is missing');
  }
}
