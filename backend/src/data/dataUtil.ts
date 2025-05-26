import fs from 'fs';
import { DataStore, Session, SessionStore } from '../../../shared/interfaces';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// TODO: move this to a .env file! and put the .env in .gitignore
const secretKey = 'abcde12345';

export function generateUserId() {
  return uuidv4();
}

// UPDATED to use a JWT token instead!
export function generateSessionId(userId: string): string {
  const payload = { userId };
  // VERY INTERESTINGLY, we can define an optional expiry time:
  // const token = jwt.sign(payload, secretKey, { expiresIn: '24h' }); 
  // which may be of use in ensuring voters can vote only in a certain time frame?
  // although at the moment we aren't really considering the voting flow, only the 
  // create vote flow. but just something to note of course. 
  const token = jwt.sign(payload, secretKey); 
  return token;
}

// Verify a given token, use our secret key
// I know we said not to use try catch blocks, but I feel that it makes the
// implementation here neater. 
export function verifySessionId(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, secretKey) as { userId: string };
    return decoded;
  } catch (err) {
    console.error('Token verification failed:', err);
    return null;
  }
}


// we want to compute the hash of a username and zID.
// we don't need to hash passwords since they are not stored anywhere..
// note: the zid + zpass verification endpoint only takes the plaintext in
// for an MVP this is fine, but I was digging around the codebase for Notangles
// and I think they use OAuth for zid + zpass verification which is much more secure
// for a production level codebase. 
export function getHashOf(plaintext: string) {
  return crypto.createHash('sha256').update(plaintext).digest('hex');
}

import { getSessionData, getUserData } from '../data/dataStore';


export async function getzIdFromUserSessionId(userSessionId: string): Promise<string | null> {
  let userId: string | null = null;

  // find the userId corresponding to the sessionId
  await getSessionData(store => {
    const session = store.sessions.find(s => s.sessionId === userSessionId);
    if (session) {
      userId = session.userId;
    }
  });

  if (!userId) return null;

  // lookup the user's zID from the user database
  let zid: string | null = null;

  await getUserData(map => {
    const user = map.get(userId!);
    if (user) {
      zid = user.zid;
    }
  });

  return zid;
}
