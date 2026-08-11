import crypto from 'crypto';

export function hashObject(obj: unknown): string {
  const str = JSON.stringify(obj || {});
  return crypto.createHash('md5').update(str).digest('hex');
}

export function generateId(prefix: string = ''): string {
  const id = crypto.randomBytes(6).toString('hex');
  return prefix ? `${prefix}_${id}` : id;
}
