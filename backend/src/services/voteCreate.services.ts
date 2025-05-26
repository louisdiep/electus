import { getElectionData, saveElectionDatabaseToFile } from '../data/dataStore';
import { Question, Election, QuestionType, Candidate, ElectionState } from '../../../shared/interfaces';
import { } from '../../../shared/interfaces';
import { StatusCodes } from 'http-status-codes';
import { validateSessionId, validateElectionId, validatePositionId } from './servicesUtil';
import { randomUUID } from 'crypto';

// helper functions to generate ids better since i noticed this was done quite poorly previously
const generateElectionId = () => parseInt(randomUUID().replace(/\D/g, '').slice(0, 9));
const generatePositionId = () => parseInt(randomUUID().replace(/\D/g, '').slice(0, 9));
const generateCandidateIndex = () => parseInt(randomUUID().replace(/\D/g, '').slice(0, 9));

/**
 * User creates a vote session.
 * @param userSessionId 
 * @param title 
 * @param description
 * @param images
 * @param startDate
 * @param endDate
 * @param zid_requirement
 * @param locationOfVote
 * @returns new election ID
 */

export interface CreateElectionProps {
  userSessionId: string;
  title: string;
  description: string;
  images: string[];
  startDate: Date;
  endDate: Date;
  zid_requirement: boolean;
  locationOfVote?: string;
}

/**
 * Creates a new election and returns its unique ID.
 */
export const createElection = async (
    props: CreateElectionProps
  ): Promise<number> => {
    const sessionValidation = await validateSessionId(props.userSessionId);
    if ('error' in sessionValidation) {
      throw new Error(sessionValidation.error);
    }
  
    const userId = sessionValidation.userId;
  
    if (props.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
  
    const newElectionId: number = generateElectionId();
  
    await getElectionData(map => {  
      const newElection: Election = {
        id: newElectionId,
        authUserId: userId,
        name: props.title,
        description: props.description,
        images: props.images,
        location: props.locationOfVote,
        date_time_start: props.startDate,
        date_time_end: props.endDate,
        requires_zid: props.zid_requirement,
        questions: [],
        // isActive: false,
        electionState: 0,
        voters: [],
      };
  
      map.set(newElectionId.toString(), newElection);
    });
  
    await saveElectionDatabaseToFile();
    return newElectionId;
  };

export interface ViewElectionsProps {
  userSessionId: string;
}
  
export const viewElections = async (
  props: ViewElectionsProps
): Promise<{ elections: Election[] }> => {
  const sessionValidation = await validateSessionId(props.userSessionId);
  if ('error' in sessionValidation) {
    throw new Error(sessionValidation.error);
  }

  const userId = sessionValidation.userId;

  const userElections: Election[] = [];

  await getElectionData(map => {
    for (const election of map.values()) {
      if (election.authUserId === userId) {
        userElections.push(election);
      }
    }
  });

  return { elections: userElections };
};  

// functionality for creating voting sessions is already done
// gonna add the functionality for:
// - viewing voting sessions, corresponding to the "Create Vote - View Voting Sessions"  page
// - viewing positions in a vote, corresponding to the "Create Vote - Add Positions"  page
// - adding a position to a vote, corresponding to the "Create Vote - Add Position"  page
// TODO: this is a stub for the addPosition HTTP route
export interface CreatePositionProps {
  userSessionId: string;
  voteId: number;
  title: string;
  questionType: QuestionType;
}

/**
 * Adds a new question/position to an election.
 */
export const createPosition = async (
  props: CreatePositionProps
): Promise<{ positionId: number }> => {
  const sessionValidation = await validateSessionId(props.userSessionId);
  if ('error' in sessionValidation) {
    throw new Error(sessionValidation.error);
  }

  const userId = sessionValidation.userId;

  const electionValidation = await validateElectionId(props.voteId, userId);
  if ('error' in electionValidation) {
    throw new Error(electionValidation.error);
  }

  const newQuestionId = generatePositionId();

  await getElectionData(map => {
    const election = map.get(String(props.voteId));
    if (!election) throw new Error('Election unexpectedly not found');

    const newQuestion = {
      id: newQuestionId,
      title: props.title,
      candidates: [],
      questionType: props.questionType, // store as string
      ballot: [],
    };

    election.questions.push(newQuestion);
  });

  await saveElectionDatabaseToFile();

  return { positionId: newQuestionId };
};

interface DeletePositionProps {
  userSessionId: string;
  voteId: number;
  positionId: number;
}

export const deletePosition = async (
  props: DeletePositionProps
): Promise<{ success: true }> => {
  const sessionValidation = await validateSessionId(props.userSessionId);
  if ('error' in sessionValidation) throw new Error(sessionValidation.error);

  const userId = sessionValidation.userId;

  const electionValidation = await validateElectionId(props.voteId, userId);
  if ('error' in electionValidation) throw new Error(electionValidation.error);

  await getElectionData(map => {
    const election = map.get(String(props.voteId));
    if (!election) throw new Error('Election unexpectedly not found');

    const index = election.questions.findIndex(q => q.id === props.positionId);
    if (index === -1) throw new Error('Position not found');

    election.questions.splice(index, 1);
  });

  await saveElectionDatabaseToFile();

  return { success: true };
};

// voteCreate.services.ts

interface ReorderPositionsProps {
  userSessionId: string;
  voteId: number;
  newOrder: number[]; // array of position IDs in the new desired order
}

export const reorderPositions = async ({
  userSessionId,
  voteId,
  newOrder,
}: ReorderPositionsProps): Promise<{ message: string }> => {
  const sessionValidation = await validateSessionId(userSessionId);
  if ('error' in sessionValidation) throw new Error(sessionValidation.error);

  const userId = sessionValidation.userId;
  const electionValidation = await validateElectionId(voteId, userId);
  if ('error' in electionValidation) throw new Error(electionValidation.error);

  await getElectionData(map => {
    const election = map.get(String(voteId));
    if (!election) throw new Error('Election not found');

    const idToPosition = new Map(
      election.questions.map(q => [q.id, q])
    );

    if (newOrder.length !== election.questions.length) {
      throw new Error('New order length does not match number of positions');
    }

    const reordered = newOrder.map(id => {
      const pos = idToPosition.get(id);
      if (!pos) throw new Error(`Invalid position ID: ${id}`);
      return pos;
    });

    election.questions = reordered;
  });

  await saveElectionDatabaseToFile();

  return { message: 'Positions reordered successfully' };
};


export interface ViewPositionsProps {
  userSessionId: string;
  voteId: number;
}

export const viewPositions = async (
  props: ViewPositionsProps
): Promise<{ positions: Question[] }> => {
  const sessionValidation = await validateSessionId(props.userSessionId);
  if ('error' in sessionValidation) {
    throw new Error(sessionValidation.error);
  }

  const userId = sessionValidation.userId;

  const electionValidation = await validateElectionId(props.voteId, userId);
  if ('error' in electionValidation) {
    throw new Error(electionValidation.error);
  }

  const election = electionValidation.election;

  return { positions: election.questions };
};

// functionality for creating votes is already done
// functionality for creating positions in a vote is already done
// gonna add the functionality for:
// - viewing candidates for a position, corresponding to the "Create Vote - Add Position"  page
// - adding candidates for a position, corresponding to the "Create Vote - Add Position"  page
// - editing candidates for a position, corresponding to the "Create Vote - Edit Candidate"  page


export interface CreateCandidateProps {
  userSessionId: string;
  voteId: number;
  positionId: number;
  name: string;
}

/**
 * Adds a new candidate to a given position in a vote.
 */
export const createCandidate = async (
  candidateData: CreateCandidateProps
): Promise<{ candidateIndex?: number; error?: string; status?: number }> => {
  // Validate session
  const sessionCheck = await validateSessionId(candidateData.userSessionId);
  if ('error' in sessionCheck) return sessionCheck;

  const userId = sessionCheck.userId;

  // Validate election ownership
  const electionCheck = await validateElectionId(candidateData.voteId, userId);
  if ('error' in electionCheck) return electionCheck;

  const { election } = electionCheck;

  // Validate position exists
  const positionCheck = validatePositionId(election, candidateData.positionId);
  if ('error' in positionCheck) return positionCheck;

  const newCandidateIndex = generateCandidateIndex();

    // Modify election database
    await getElectionData(map => {
      const updatedElection = map.get(String(candidateData.voteId));
      if (!updatedElection) throw new Error('Election unexpectedly missing from database');
  
      const position = updatedElection.questions.find(q => q.id === candidateData.positionId);
      if (!position) throw new Error('Position unexpectedly missing');
  
      
  
      const newCandidate: Candidate = {
        name: candidateData.name,
        description: '',
        image: '',
        candidateIndex: newCandidateIndex,
      };
  
      position.candidates.push(newCandidate);
    });
  
    await saveElectionDatabaseToFile();
  
    return { candidateIndex: newCandidateIndex };
  };

export interface EditCandidateProps {
  userSessionId: string;
  voteId: number;
  positionId: number;
  candidateIndex: number;
  name: string;
  description: string;
  image: string;
}

/**
 * Edits an existing candidate's details (name, description, image).
 */
export const editCandidate = async (
  candidateData: EditCandidateProps
): Promise<{ error?: string; status?: number } | 0> => {
  // Validate session
  const sessionCheck = await validateSessionId(candidateData.userSessionId);
  if ('error' in sessionCheck) return sessionCheck;

  const userId = sessionCheck.userId;

  // Validate election ownership
  const electionCheck = await validateElectionId(candidateData.voteId, userId);
  if ('error' in electionCheck) return electionCheck;

  const { election } = electionCheck;

  // Validate position
  const positionCheck = validatePositionId(election, candidateData.positionId);
  if ('error' in positionCheck) return positionCheck;

  const { position } = positionCheck;

  // Mutate candidate
  let found = false;

  await getElectionData(map => {
    const storedElection = map.get(String(candidateData.voteId));
    if (!storedElection) throw new Error('Election unexpectedly missing');

    const storedPosition = storedElection.questions.find(q => q.id === candidateData.positionId);
    if (!storedPosition) throw new Error('Position unexpectedly missing');

    const candidate = storedPosition.candidates.find(
      c => c.candidateIndex === candidateData.candidateIndex
    );

    if (!candidate) return;

    candidate.name = candidateData.name;
    candidate.description = candidateData.description;
    candidate.image = candidateData.image;
    found = true;
  });

  if (!found) {
    return { error: 'Candidate not found', status: StatusCodes.NOT_FOUND };
  }

  await saveElectionDatabaseToFile();
  return 0;
};

export interface DeleteCandidateProps {
  userSessionId: string;
  voteId: number;
  positionId: number;
  candidateIndex: number;
}

/**
 * Deletes a candidate from a position within an election.
 */
export const deleteCandidate = async (
  candidateData: DeleteCandidateProps
): Promise<{ error?: string; status?: number } | 0> => {
  // Validate session
  const sessionCheck = await validateSessionId(candidateData.userSessionId);
  if ('error' in sessionCheck) return sessionCheck;

  const userId = sessionCheck.userId;

  // Validate election ownership
  const electionCheck = await validateElectionId(candidateData.voteId, userId);
  if ('error' in electionCheck) return electionCheck;

  const { election } = electionCheck;

  // Validate position
  const positionCheck = validatePositionId(election, candidateData.positionId);
  if ('error' in positionCheck) return positionCheck;

  const { position } = positionCheck;

  let removed = false;

  await getElectionData(map => {
    const storedElection = map.get(String(candidateData.voteId));
    if (!storedElection) throw new Error('Election unexpectedly missing');

    const storedPosition = storedElection.questions.find(q => q.id === candidateData.positionId);
    if (!storedPosition) throw new Error('Position unexpectedly missing');

    const foundIndex = storedPosition.candidates.findIndex(
      c => c.candidateIndex === candidateData.candidateIndex
    );

    if (foundIndex === -1) return;

    storedPosition.candidates.splice(foundIndex, 1);
    removed = true;
  });

  if (!removed) {
    return { error: 'Candidate not found', status: StatusCodes.NOT_FOUND };
  }

  await saveElectionDatabaseToFile();
  return 0;
};


export interface ViewCandidateProps {
  userSessionId: string;
  voteId: number;
  positionId: number;
}

/**
 * Returns the list of candidates for a specific position in an election.
 */
export const viewCandidates = async (
  positionData: ViewCandidateProps
): Promise<{ error?: string; status?: number } | any[]> => {
  const sessionCheck = await validateSessionId(positionData.userSessionId);
  if ('error' in sessionCheck) return sessionCheck;

  const userId = sessionCheck.userId;

  const electionCheck = await validateElectionId(
    positionData.voteId,
    userId
  );
  if ('error' in electionCheck) return electionCheck;

  const positionCheck = validatePositionId(
    electionCheck.election,
    positionData.positionId
  );
  if ('error' in positionCheck) return positionCheck;

  const { position } = positionCheck;
  return position.candidates;
};

interface DeleteAllCandidatesProps {
  userSessionId: string;
  voteId: number;
  positionId: number;
}

/**
 * Deletes all candidates from a specified position in an election.
 */
export const deleteAllCandidates = async (
  positionData: DeleteAllCandidatesProps
): Promise<{ error?: string; status?: number } | any[]> => {
  const sessionCheck = await validateSessionId(positionData.userSessionId);
  if ('error' in sessionCheck) return sessionCheck;

  const userId = sessionCheck.userId;

  const electionCheck = await validateElectionId(
    positionData.voteId,
    userId
  );
  if ('error' in electionCheck) return electionCheck;

  const positionCheck = validatePositionId(
    electionCheck.election,
    positionData.positionId
  );
  if ('error' in positionCheck) return positionCheck;

  let newCandidateList: any[] = [];

  await getElectionData(map => {
    const storedElection = map.get(String(positionData.voteId));
    if (!storedElection) throw new Error('Election unexpectedly missing');

    const storedPosition = storedElection.questions.find(q => q.id === positionData.positionId);
    if (!storedPosition) throw new Error('Position unexpectedly missing');

    storedPosition.candidates = [];
    newCandidateList = storedPosition.candidates;
  });

  await saveElectionDatabaseToFile();

  return newCandidateList;
};

export interface ViewElectionsProps {
  userSessionId: string;
}
  
/**
 * Checks if a Voting Session Exists
 */
export async function authValidSession(electionID: string): Promise<{ error?: string; status?: number } | void> {
  console.log("Checking if election id is valid")
  let found = false;

  // Example: call getElectionData
  await getElectionData((map) => {
  // Instant lookup:
   const election = map.get(electionID);
  if (election) {
    // Found the election, do something
    console.log('Election found:', election);
    found = true
  } else {
    // Not found
  }
});

  if (!found) {
    return {
      error: 'Invalid electionID',
      status: StatusCodes.UNAUTHORIZED,
    };
  }
}