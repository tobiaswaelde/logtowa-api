import { Request, Response } from 'express';
import * as qs from 'qs';

export const customQueryParser = (req: Request, res: Response, next: (error?: any) => void) => {
  const rawQuery = req.url.split('?')[1] ?? '';
  req.query = qs.parse(rawQuery, { depth: Infinity });
  next();
};
