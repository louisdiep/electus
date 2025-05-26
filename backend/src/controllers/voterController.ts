import { Request, Response, NextFunction } from 'express';
import * as voterServices from '../services/voter.services'
import * as electionSessionService from '../services/electionSession.services'
import { voteProps } from '../services/voter.services';



  export const joinVote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionCode , sessionId } = req.body;

    if (!sessionCode || !sessionId) {
      res.status(400).json({ error: 'Missing election sessionCode or sessionID' });
      return;
    }

    try {
      const result = await electionSessionService.addUsertoActiveElectionSession(sessionCode, sessionId);

   res.status(200).json({ results: result });
    } catch (e) {
      next(e);
    }
                   

  };

  export const viewPositionsPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
          const { userSessionId, sessionCode } = req.body;

  
    if (!userSessionId || !sessionCode) {
      res.status(400).json({ error: 'Missing user session ID or sessionCode' });
      return;
    }
  
    try {
      const result = await voterServices.viewPositions(
        userSessionId,
        sessionCode,
      );
  
      res.status(200).json({ result });
    } catch (e) {
      next(e);
    }
  };

  export const vote = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
        const { userSessionId, sessionCode, positionId, preferences } = req.body;
        
        const props:voteProps ={ 
                userSessionId,
                sessionCode,
                positionId,
                preferences
        }
    if (!userSessionId) {
      res.status(400).json({ error: 'Missing user session ID ' });
      return;
    }
    if (!sessionCode) {
      res.status(400).json({ error: 'Missing user sessionCode ' });
      return;
    }
    if (!positionId) {
      res.status(400).json({ error: 'Missing user positionId ' });
      return;
    }
    if (!preferences) {
      res.status(400).json({ error: 'Missing user preferences ' });
      return;
    }
  
    try {
      const result = await voterServices.vote(props);

      res.status(200).json({ result });
    } catch (e) {
      next(e);
    }
  };
  
