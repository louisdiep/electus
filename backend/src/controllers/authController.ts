import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.services';

// all business logic is handled in ../services/auth.services.ts

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { zId, zPass } = req.body;

  // console.log("Calling Reg REs");
  // console.log("FOUND AUTH: ")
  // console.log(req.body)
  // console.table([zId, zPass])

  if (!zId || !zPass) {
    console.log("no valid zipass")
    res.status(400).json({ error: 'zID and zPass are required' });
    return;
  }

  const result = await authService.authRegister(zId, zPass);

  console.log("RESULT")
  console.log(result)
  console.log("\n\n")
  if ('error' in result) {
    console.log("found error")

    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }
  console.log("return 200")

  res.status(200).json({ sessionId: result.sessionId });
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { zId, zPass } = req.body;

  // console.log("Calling auth");
  // console.log("FOUND AUTH: ")
  // console.log(req.body)
  // console.table([zId, zPass])

  if (!zId || !zPass) {
    res.status(400).json({ error: 'zID and zPass are required' });
    return;
  }


  const result = await authService.authLogin(zId, zPass);
  if ('error' in result) {
    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }

  res.status(200).json({ sessionId: result.sessionId });
};


export const logout = async (req: Request, res: Response) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    res.status(400).json({ error: 'Missing session token' });
    return;
  }

  const result = await authService.authLogout(sessionId);

  if (result?.error) {
    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }

  res.status(200).json({ message: 'Logged out successfully' });
};


export const checkSession = async (req: Request, res: Response, next: NextFunction) => {
  const { sessionId } = req.body;

  // if (!sessionId) {
  //   res.status(400).json({ error: 'Missing session token' });
  //   return;
  // }

  const result = await authService.authValidSession(sessionId);

  if (result?.error) {
    res.status(result.status ?? 500).json({ error: result.error });
    return;
  }

  res.status(200).json({ message: 'Session is valid' });
};
