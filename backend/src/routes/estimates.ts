import { Router } from 'express';
import { submitEstimate, type EstimateService } from '../controllers/estimatesController.js';

export function createEstimatesRouter(service: EstimateService) {
  const router = Router();
  router.post('/estimates', submitEstimate(service));
  return router;
}
