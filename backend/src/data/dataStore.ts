import { DataStore, Election, Session, SessionStore, User, Userv2 } from '../../../shared/interfaces';
import {generateUserId, generateSessionId, verifySessionId, getHashOf} from './dataUtil';
import { promises as fs, write } from 'fs';
// to create & share one instance of Mutex & Semaphore
const { Mutex, Semaphore } = require('async-mutex');

const writeMutex = new Mutex();
const readSemaphore = new Semaphore(10); // allow 10 ppl to acess

export let sessionDatabase: SessionStore = { sessions: [] };
export let userDatabase: Map<string, Userv2> = new Map();
export let electionDatabase: Map<string, Election> = new Map();

// const SESSION_PATH = "./src/data/sessions.json";
const USER_DATABASE_PATH = './src/data/userDatabase.json';
const ELECTION_DATABASE_PATH = './src/data/electionDatabase.json';
const SESSION_DATABASE_PATH = './src/data/sessions.json';
// importing instance of mutex & semaphore

// TODO: move this to a .env file! and put the .env in .gitignore
const secretKey = 'abcde12345';



////////////////////////////// SESSION UTILS  ////////////////////////////////
/**
 * Creates and registers a session for a given userId.
 * Returns the generated sessionId (JWT).
 */
export async function createAndStoreSession(userId: string): Promise<string> {
  const sessionId = generateSessionId(userId);
  const session: Session = {
    sessionId,
    userId,
    createdAt: new Date(),
  };

  await getSessionData(store => {
    store.sessions.push(session);
  });

  await saveSessionToFile();
  return sessionId;
}

// ///////////////// USER_DB RELATED FUNCTIONALITY /////////////////

// create a getUserData function to modify
/** 
Example usage:
The key idea is when we try to modify the database, it is wrapped in this
getter function, which handles concurrency.
  await getUserData(map => {
    userAlreadyExists = map.has(userId);
    if (!userAlreadyExists) {
      map.set(userId, hashedName);
    }
  });
*/
export const getUserData = async (
  modifier: (map: Map<string, Userv2>) => void
): Promise<void> => {
  const release = await writeMutex.acquire();
  try {
    modifier(userDatabase);
  } finally {
    release();
  }
};

export const loadUserDatabaseFromFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();

  try {
    const data = await fs.readFile(USER_DATABASE_PATH, 'utf8');


    if (!data.trim()) {
      console.warn('User database file is empty. Starting with an empty userDatabase.');
      userDatabase.clear();
      return;
    }

    const obj = JSON.parse(data) as Record<string, Userv2>;

    userDatabase.clear();
    for (const [id, user] of Object.entries(obj)) {
      userDatabase.set(id, user);
    }

    console.log('User database loaded from file.');
  } catch (err) {
    console.error('Error loading user database:', err);
  } finally {
    release();
  }
};

export const saveUserDataBaseToFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();
  try {
    const obj = Object.fromEntries(userDatabase);
    const json = JSON.stringify(obj, null, 2);
    await fs.writeFile(USER_DATABASE_PATH, json, 'utf8');
    console.log(`User database saved to ${USER_DATABASE_PATH}`);
  } finally {
    release();
  }
};


// ///////////////// SESSION_DB RELATED FUNCTIONALITY /////////////////
/** 
Example usage:
The key idea is when we try to modify the database, it is wrapped in this
getter function, which handles concurrency.
  await getSessionData(store => {
    const index = store.sessions.findIndex(s => s.sessionId === sessionId);
    if (index !== -1) {
      store.sessions.splice(index, 1);
      removed = true;
    }
  });
*/
export const getSessionData = async (
  modifier: (store: SessionStore) => void
): Promise<void> => {
  const release = await writeMutex.acquire();
  try {
    // console.log('Session database read:', JSON.stringify(sessionDatabase, null, 2)); // print out db just to see
    modifier(sessionDatabase);
  } finally {
    release();
  }
};

export const loadSessionFromFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();

  try {
    const data = await fs.readFile(SESSION_DATABASE_PATH, 'utf8');

    if (!data.trim()) {
      console.warn('Session file is empty. Starting with an empty sessionStore.');
      sessionDatabase = { sessions: [] };
      return;
    }

    const obj = JSON.parse(data) as SessionStore;
    sessionDatabase = obj;
    console.log('Session store loaded from file.');
  } catch (err) {
    console.error('Error loading session store:', err);
  } finally {
    release();
  }
}

export const saveSessionToFile = async () => {
  const release = await writeMutex.acquire();
  try {
    const json = JSON.stringify(sessionDatabase, null, 2);
    await fs.writeFile(SESSION_DATABASE_PATH, json, 'utf8');
    console.log(`Session store saved to ${SESSION_DATABASE_PATH}`);
  } catch (err) {
    console.error('Error saving session store:', err);
  } finally {
    release();
  }
}

// ///////////////// ELECTION_DB RELATED FUNCTIONALITY /////////////////
/** 
Example usage:
The key idea is when we try to modify the database, it is wrapped in this
getter function, which handles concurrency.
    await getElectionData(map => {
      const election = map.get(String(props.voteId));
      if (!election) throw new Error('Election unexpectedly not found');
  
      const newQuestionId = election.questions.length + 1;
  
      const newQuestion = {
        id: newQuestionId,
        title: props.title,
        candidates: [],
        questionType: props.questionType, // store as string
      };      
  
      election.questions.push(newQuestion);
    });
*/


function logLatestData () {
  console.log("LATEST DATA LOG")
  console.log(electionDatabase)
}

export const getElectionData = async (
  modifier: (map: Map<string, Election>) => void
): Promise<void> => {
  logLatestData()


  const release = await writeMutex.acquire();
  logLatestData()
  console.log("DATA BASE HERE 1")
  console.log(electionDatabase)
  try {
    console.log("getElectionData sees election keys:", [...electionDatabase.keys()]);

    console.log("DATA BASE HERE 2")
    console.log(electionDatabase)

    modifier(electionDatabase);
    // await saveElectionDatabaseToFile(); // optionally persist changes
  } finally {
    release();
  }
};

export const loadElectionDatabaseFromFile = async (): Promise<void> => {
  // const release = await writeMutex.acquire();
  try {
    const data = await fs.readFile(ELECTION_DATABASE_PATH, 'utf8');
    console.log("Raw election DB file contents:", data);

    // Handle empty file gracefully
    if (!data.trim()) {
      console.warn('Election database file is empty. Starting with an empty electionDatabase.');
      electionDatabase.clear();
      return;
    }

    const obj = JSON.parse(data) as Record<string, Election>;

    electionDatabase.clear();
    for (const [id, election] of Object.entries(obj)) {
      console.log("SETTING KEY HERE ANGRY ANGRY ")
      electionDatabase.set(id, election);
    }
    console.log("Loaded election keys:", [...electionDatabase.keys()]);


    console.log("FINAL ELECTION LOG")
    console.log(electionDatabase)

    console.log('Election database loaded from file.');
  } catch (err) {
    console.error('Error loading election database:', err);
  } finally {
    // release();
    console.log("RELEASE")
  }
  console.log("AFTER RLEASE LOG")
  console.log(electionDatabase)
};

export const saveElectionDatabaseToFile = async (): Promise<void> => {
  const release = await writeMutex.acquire();
  try {
    const obj = Object.fromEntries(electionDatabase);
    const json = JSON.stringify(obj, null, 2);
    await fs.writeFile(ELECTION_DATABASE_PATH, json, 'utf8');
    console.log(`Election database saved to ${ELECTION_DATABASE_PATH}`);
  } catch (err) {
    console.error('Error saving election database:', err);
  } finally {
    release();
  }
};

export const clear = async (): Promise<void> => {
  const release = await writeMutex.acquire();
  try {

    console.log("CLEARING DATABASE");
    // Clear all in-memory stores
    userDatabase.clear();
    electionDatabase.clear();
    sessionDatabase.sessions = [];

    // Persist all cleared data to disk
    await Promise.all([
      saveUserDataBaseToFile(),
      saveElectionDatabaseToFile(),
      saveSessionToFile()
    ]);

    console.log('All in-memory data cleared and persisted to disk.');
  } finally {
    release();
  }
};
