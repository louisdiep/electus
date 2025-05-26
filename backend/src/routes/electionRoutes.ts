import { Router } from 'express';
import {joinVote, viewPositionsPublic } from '../../src/controllers/voterController';
import { activateElection, getResults, checkElectionSessionCode, endElection } from '../../src/controllers/voteCreateController';
const router = Router();

router.post('/activateSession/:electionId', activateElection);
router.post('/endElection/:electionId', endElection);

router.get('/results/:electionId', getResults);


router.post('/checkElectionSessionCode', checkElectionSessionCode);

router.post('/joinVote', joinVote );


router.post('/viewPositionsPublic', viewPositionsPublic );


export default router;
