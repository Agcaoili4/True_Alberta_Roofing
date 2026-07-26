import type { Request, Response, NextFunction } from 'express';
import type { SubmitResult } from '../services/estimateService.js';

// The controller depends only on this shape, not on how the service is built.
export type EstimateService = { submit(raw: unknown): Promise<SubmitResult> };

// Thin: hand the body to the service, map its result to a status code,
// and forward any thrown error to the error handler (→ 500).
export function submitEstimate(service: EstimateService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await service.submit(req.body);
      res.status(result.ok ? 201 : 400).json(result);
    } catch (err) {
      next(err);
    }
  };
}
