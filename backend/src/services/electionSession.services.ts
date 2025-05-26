import { error } from "node:console";
import { getHashOf } from "src/data/dataUtil";
import { getElectionData, getSessionData, saveElectionDatabaseToFile } from "../data/dataStore";
import { Ballot, ElectionState, Voter } from '../../../shared/interfaces';
import { StatusCodes } from "http-status-codes";
import { validateElectionId } from "./servicesUtil";
import { checkElectionSessionCode } from "src/controllers/voteCreateController";

/**
 * Get election status.
 * An election is ready to start if it has at least one position
 */
export function isElectionActive(electionId: string): boolean {
    return true;
}

/**
 * Start an election - should return a code to join the election
 * This function is called once authorised votes have been added to the election.
 * sanity check the election TODO: 
 *  - at least one position,
 *  - at least two candidates in each position
 * check electionId is valid
 * side effect: place session code into election.sessionCode. 
 * side effect: update election.isActive to true
 * return: session code
 */
export async function activateElectionSession(electionId: string): Promise<string> {
    let sessionCode: string = '';
    // get election data
    await getElectionData(electionDatabase => {
        // check if election has atleast one pos
        // check if question has atleast two candidates
        // check if election is valid



        // If election is waitingtoStart create id

        // if election is already going return existing id

        // if election has stopped return error


        const election = electionDatabase.get(String(electionId));
        if (!election) {
            throw new Error("invalid election id");
        }

        if (election.electionState === 0) {
          election.electionState = 1;
          sessionCode = Math.random().toString(36).slice(2, 7);
          // add verification to make sure it is unique
          election.sessionCode = sessionCode;

        } else if (election.electionState === 1) {
          sessionCode = String(election.sessionCode)
        } else {
          sessionCode = "Already started"
        }


    })

    await saveElectionDatabaseToFile();

    // return ses
    return sessionCode;
}

/**
 * Add users to authorised voters in this active election
 * note that a userId is a hashed zId.
 * error checks:
 *  - session code refers to this election and is valid
 *  - userSessionId is valid
 * side effect: add user to election.voters
 * return true if successful, false otherwise
//  */
export async function addUsertoActiveElectionSession(sessionCode: string, userSessionId: string) {
    // get election data
        const validelection = await doesElectionExist(sessionCode);

        if (!validelection) {
            throw new Error("invalid election id");
        }
        let userId = '';
        await getSessionData((store) => {
    // Search for the session with matching sessionId
            const session = store.sessions.find(s => s.sessionId === userSessionId);
          if (session) {
            userId = session.userId;
          }
        });
        if (userId == '') {
            throw new Error("invalid user session code");
        }
        
        await getElectionData((map) => {
    for (const election of map.values()) {

      if (election.sessionCode === sessionCode) {

       const voterExists = election.voters.some(v => v.zid === userId);
    if (voterExists) {
      console.log('Voter already registered in this election');
      return; // or throw an error if preferred
    }
            const newVoter: Voter = { zid: userId };


    // Add the new voter
    election.voters.push(newVoter);
      }
    }
  });
        
    

    await saveElectionDatabaseToFile();

    // return ses
    return true;
}

/**
 * Delete zId from authorised votes in election
 * return boolean
 */
// export const deleteVoter = (electionId: string, sessionCode: string, userSessionId: string): boolean => {
//     return true;
// }


/**
 * End an election
 * checks if election session is live
 * side effects: update electionState to 2 (stopped)
 */
export const endElection = (electionId: string): boolean => {
    try {
        getElectionData((electionDatabase) => {
            const election = electionDatabase.get(String(electionId));
            if (!election) {
                throw new Error("Invalid election ID");
            }

            if (election.electionState !== 1) {
                throw new Error("Election is not currently active");
            }

            // Set the election state to 'stopped'
            election.electionState = 2;
        });

        saveElectionDatabaseToFile(); // Persist the changes
        return true;

    } catch (error) {
        console.error("Failed to end election:", error);
        return false;
    }
};


/**
 * Get results of an election. Election must have ended
 * 
 * have helper function to calculate winner for preferential votes
 * take in question and returns winner
 * 
 * return hashmap: 
 *  key: question, value: winner (string)
 */
export const getResult = async (electionId: string) => {
    const resultMap: Record<string, string> = {}; // key: question, value: winner

    // get election data
    await getElectionData(electionDatabase => {

        console.log(electionDatabase)

        const election = electionDatabase.get(electionId);
        // console.log([...electionDatabase.keys()]);
        if (!election) {
            throw new Error("invalid election id");
        }

        if (election.electionState !== 2) {
            throw new Error("election not ended");
        }

        const questions = election.questions;

        for (const q of questions) {
            const winnerId = calculatePreferentialVotingWinner(q.ballot);
            if (winnerId === -1) {
                resultMap[q.title] = "None";
            }
            const winnerObj = q.candidates.find(c => c.candidateIndex === winnerId);
            if (winnerObj) {
                resultMap[q.title] = winnerObj.name;
            }
        }


    })

    await saveElectionDatabaseToFile();

    return resultMap;
}

function calculatePreferentialVotingWinner(ballots: Ballot[]): number {
  // Flatten all preferences to find max candidate index
  const numCandidates = Math.max(...ballots.flatMap(b => b.preferences)) + 1;

  let activeCandidates = new Set<number>();
  for (let i = 0; i < numCandidates; i++) {
    activeCandidates.add(i);
  }

  while (true) {
    const voteCount = new Map<number, number>();
    for (const candidate of activeCandidates) {
      voteCount.set(candidate, 0);
    }

    // Count votes for the highest-ranked active candidate on each ballot
    for (const ballot of ballots) {
      const topChoice = ballot.preferences.find(c => activeCandidates.has(c));
      if (topChoice !== undefined) {
        voteCount.set(topChoice, (voteCount.get(topChoice) || 0) + 1);
      }
    }

    const totalVotes = [...voteCount.values()].reduce((a, b) => a + b, 0);

    for (const [candidate, count] of voteCount) {
      if (count > totalVotes / 2) {
        return candidate;
      }
    }

    const minVotes = Math.min(...voteCount.values());

    for (const [candidate, count] of voteCount) {
      if (count === minVotes) {
        activeCandidates.delete(candidate);
      }
    }

    if (activeCandidates.size === 1) {
      return [...activeCandidates][0];
    }

    if (activeCandidates.size === 0) {
      return -1;
    }
  }
}

/**
 * Checks if a Voting Session corresponding to a session code exists
 */
export async function doesElectionExist(sessionCode: string) {
  let exists = null;
//console.log("HELLO WORLD")
  await getElectionData((map) => {
    for (const election of map.values()) {
   //   console.log(election.sessionCode)
    //  console.log(sessionCode)
    //  console.log("HELLO WORLD 2")
      if (election.sessionCode === sessionCode) {
        exists = election;
        break; 
      }
    }
  });

  return exists;
}