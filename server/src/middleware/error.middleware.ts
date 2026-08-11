import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  console.error('[Unhandled Error]', err.message, err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}
