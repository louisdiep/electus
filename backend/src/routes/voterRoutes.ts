import { Router } from 'express';
import { viewPositionsPublic, vote } from '../../src/controllers/voterController';
// import { ... } from '../../src/controllers/voterController.ts';
const router = Router();

router.post('/viewPositionsPublic', viewPositionsPublic );

router.post('/vote', vote );


export default router;
