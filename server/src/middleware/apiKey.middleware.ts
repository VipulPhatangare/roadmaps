import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const apiKeyHeader = req.headers['x-api-key'];
  const authHeader = req.headers.authorization;
  const queryApiKey = req.query.apiKey || req.query.api_key || req.query.key;

  let providedKey: string | undefined;

  if (typeof apiKeyHeader === 'string') {
    providedKey = apiKeyHeader;
  } else if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      providedKey = authHeader.substring(7).trim();
    } else {
      providedKey = authHeader.trim();
    }
  } else if (typeof queryApiKey === 'string') {
    providedKey = queryApiKey;
  }

  if (!providedKey || providedKey !== env.roadmapApiKey) {
    res.status(401).json({
      success: false,
      message: 'Invalid or missing API key. Provide key via x-api-key header, Authorization header, or apiKey query param.',
    });
    return;
  }

  next();
}
