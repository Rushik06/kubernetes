import { Request, Response, NextFunction } from 'express';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const { number } = req.body;

  if (number !== undefined) {
    if (typeof number !== 'number' || number < 1 || number > 45) {
      return res.status(400).json({
        error: 'Invalid number. Must be between 1 and 45',
      });
    }
  }
  next();
}
