import { Request, Response, NextFunction } from 'express';

export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const { number } = req.body;

  if (number !== undefined) {
    /*As i used fibnocci recursion after 45 app is silently stop as response time 
    is taking more,so according to my bench mark test it can validate high cpu work upto
    45 */

    //According to me the validated Input number must be between 1 and 45
    if (typeof number !== 'number' || number < 1 || number > 45) {
      return res.status(400).json({
        error: 'Invalid number. Must be between 1 and 45',
      });
    }
  }
  next();
}
