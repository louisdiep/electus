import { getUserData, getElectionData, getSessionData } from '../data/dataStore';
import { User, Election, Candidate, Question } from '../../../shared/interfaces';
import { StatusCodes } from 'http-status-codes';

export async function validateUserId(authuserId: string): Promise<
  | { user: { userId: string; name: string } }
  | { error: string; status: number }
> {
  let foundUser: { userId: string; name: string } | null = null;

  await getUserData(map => {
    const user = map.get(authuserId);
    if (user) {
      foundUser = { userId: authuserId, name: user.name };
    }
  });
  

  if (!foundUser) {
    return { error: 'User not registered', status: StatusCodes.NOT_FOUND };
  }

  return { user: foundUser };
}

export async function validateElectionId(
  voteId: number,
  authuserId: string
): Promise<
  | { election: Election }
  | { error: string; status: number }
> {
  let result: { election: Election } | { error: string; status: number } = {
    error: 'Election not found',
    status: StatusCodes.NOT_FOUND,
  };

  await getElectionData(map => {
    for (const election of map.values()) {
      if (election.id === voteId) {
        if (election.authUserId !== authuserId) {
          result = {
            error: 'You do not own this election',
            status: StatusCodes.FORBIDDEN,
          };
        } else {
          result = { election };
        }
        break;
      }
    }
  });

  return result;
}

export function validatePositionId(
  election: Election,
  positionId: number
): { position: Question } | { error: string; status: number } {
  const position = election.questions.find(q => q.id === positionId);

  if (!position) {
    return { error: 'Position not found in election', status: StatusCodes.NOT_FOUND };
  }

  return { position };
}

/**
 * Validates a session ID and returns the associated user ID.
 */
export async function validateSessionId(
  sessionId: string
): Promise<{ userId: string } | { error: string; status: number }> {
  let sessionUserId: string | null = null;

  await getSessionData(store => {
    const session = store.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      sessionUserId = session.userId;
    }
  });

  if (!sessionUserId) {
    return { error: 'Invalid session ID', status: StatusCodes.UNAUTHORIZED };
  }

  return { userId: sessionUserId };
}