type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export function log(level: LogLevel, context: string, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}] [${context}]`;
  if (level === 'ERROR') {
    console.error(`${prefix} ${message}`, data ? JSON.stringify(data) : '');
  } else if (level === 'WARN') {
    console.warn(`${prefix} ${message}`, data ? JSON.stringify(data) : '');
  } else {
    console.log(`${prefix} ${message}`, data !== undefined ? data : '');
  }
}
