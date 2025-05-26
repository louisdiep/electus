import { Router } from 'express';
import { register, login, logout, checkSession  } from '../controllers/authController';
import {createElection, viewElections, createPosition, deletePosition, reorderPositions, viewPositions, createCandidate, editCandidate, viewCandidates, deleteCandidate } from '../controllers/voteCreateController'
// import {} from '../controllers/voteCreateController';
// import { createVoteSession, createPosition, createCandidate, editCandidate, deleteCandidate, viewCandidates, } from '../controllers/voteCreateController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/checkSession',checkSession );

// TODO: move these to a new file called createVoteRoutes.ts or something
// because this functionality is separate from auth
router.post('/createElection', createElection);
router.get('/viewElections', viewElections);

// Routes for positions
router.post('/createPosition', createPosition);
router.delete('/deletePosition/:voteId/:positionId', deletePosition);
router.post('/reorderPositions', reorderPositions);
router.get('/viewPositions/:voteId', viewPositions);


// Routes for candidates
router.post('/createCandidate', createCandidate);
router.post('/editCandidate', editCandidate);
router.get('/votes/:voteId/positions/:positionId/candidates', viewCandidates);
router.delete('/votes/:voteId/positions/:positionId/candidates/:candidateIndex', deleteCandidate);


export default router;
