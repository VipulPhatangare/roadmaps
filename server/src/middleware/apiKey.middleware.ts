import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { User } from '../models/User.model';

export async function apiKeyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  if (!providedKey) {
    res.status(401).json({
      success: false,
      message: 'Missing API key. Provide key via x-api-key header, Authorization header, or apiKey query param.',
    });
    return;
  }

  // 1. Check against env variable fallback
  if (providedKey === env.roadmapApiKey) {
    return next();
  }

  // 2. Check against database users
  try {
    const user = await User.findOne({ apiKey: providedKey });
    if (user) {
      return next();
    }
  } catch (err) {
    // Continue to error handling
  }

  res.status(401).json({
    success: false,
    message: 'Invalid API key.',
  });
}
