// TODO: (optionally) rename the files in this folder, <something>Model.ts
// TODO: integrate our interfaces from ../../shared/interfaces.ts

// a user is stored with just their name and zID, and maybe we don't even need the zID..
// we will need a separate data structure for admins (people making votes)
// that stores their existing voting sessions
export interface User {
    name: string, 
    userId: string,
};

interface Election {
    authUserId: string, // the owner of the election
    name: string, // the name of the election
    description: string,
    images: string[]
    location?: Location, // optional, can be remote..
    date_time_start: Date,
    date_time_end: Date,
    requires_zid: boolean,

    // Positions
    // questions: Question[]
} 

// this is a generic session
// we will discuss more design later but it makes sense to have 
// different kinds of sessions maybe for voting vs creating votes?
export interface Session {
    sessionId: string; // this is the JWT
    userId: string;
    createdAt: Date;
}  

export interface DataStore {
    users: User[],
}

export interface SessionStore {
    sessions: Session[]
}

