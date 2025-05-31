import { Request } from 'express';
import morgan from 'morgan';

morgan.token('time', () => {
  return new Date().toISOString();
});

morgan.token('req-body', (req: Request) => {
  if (req.method === 'GET') return '';
  const sanitizedBody = { ...req.body };

  const sensitiveFields = ['password', 'token', 'authorization', 'credit_card'];
  sensitiveFields.forEach((field) => {
    if (sanitizedBody[field]) sanitizedBody[field] = '[FILTERED]';
  });
  return JSON.stringify(sanitizedBody);
});

const customFormat =
  ':time [:status] ":method :url" :response-time ms - :res[content-length] - :req-body';

export const morganMiddleware = morgan(customFormat, {
  skip: (req: Request) => {
    return req.url.includes('healthCheck');
  },
});
