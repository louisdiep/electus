import request from 'supertest';
import app from '../app';
import { clear, createAndStoreSession } from '../data/dataStore';
import { verifySessionId } from '../data/dataUtil';
import {
  post,
  get,
  del,
  registerRoute,
  createPositionRoute,
  reorderPositionsRoute,
  getViewPositionsRoute,
  getDeletePositionRoute,
  createVoteRoute,
  viewElectionsRoute,
  createCandidateRoute,
  editCandidateRoute,
  getDeleteCandidateRoute,
  getViewCandidatesRoute,
  zidPlainText,
  zpassPlainText
} from './testUtil';
import { encryptWithPublicKey } from '../../../shared/src/encryptionBackend';
import { QuestionType } from '../../../shared/interfaces';


// TODO: implement Brandan's feedback for this test:
/*
Tests should never directly call functions on the backend. 
The server should be treated as a black box that you can 
interact with via API's., e.g in your POST /createVoteSession test. 
Instead of creating a User Session should either re-use an existing 
User session from a prevoius test, or Create a session by calling the user API and returning that test. 
*/
// we should actually use the API route:
//    router.post('/login', login);
// to register a user and create a session token
// describe('POST /createElection', () => {
//   beforeEach(async () => {
//     // await clear();
//   });

//   it.only('Should create an election successfully after registering user', async () => {
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText);

//     // Register user and retrieve session
//     const regRes = await request(app)
//       .post(registerRoute)
//       .send({ zId, zPass });

//     expect(regRes.statusCode).toEqual(200);
//     const sessionId = regRes.body.sessionId;

//     // Create election with valid session
//     const res = await request(app)
//       .post('/api/auth/createElection')
//       .set('x-session-id', sessionId)
//       .send({
//         title: 'Test Election',
//         description: 'This is a test election',
//         images: [],
//         startDate: new Date(),
//         endDate: new Date(),
//         zid_requirement: false,
//         locationOfVote: 'library',        
//       });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.electionId).toBeDefined();

    
//   });
// });

describe.only('GET /viewElections', () => {
  it('Should return all elections for the logged-in user', async () => {
    const zId = encryptWithPublicKey(zidPlainText);
    const zPass = encryptWithPublicKey(zpassPlainText);

    // Register and get session ID
    const regRes = await request(app)
      .post(registerRoute)
      .send({ zId, zPass });

    expect(regRes.statusCode).toBe(200);
    const sessionId = regRes.body.sessionId;

    // Create 2 elections
    for (let i = 0; i < 2; i++) {
      const createRes = await request(app)
        .post(createVoteRoute)
        .set('x-session-id', sessionId)
        .send({
          title: `Election ${i + 1}`,
          description: 'Test election',
          images: [],
          startDate: new Date(),
          endDate: new Date(),
          zid_requirement: false,
          locationOfVote: 'unsw',
        });

      expect(createRes.statusCode).toBe(200);
    }

    // View elections
    const viewRes = await request(app)
      .get(viewElectionsRoute)
      .set('x-session-id', sessionId);

    expect(viewRes.statusCode).toBe(200);
    expect(viewRes.body.result.elections.length).toBeGreaterThanOrEqual(2);
    expect(viewRes.body.result.elections[0]).toHaveProperty('name');
    expect(viewRes.body.result.elections[0]).toHaveProperty('id');
  });
});

// // tests for adding/viewing/reordering positions
// describe('POST /reorderPositions', () => {
//   let sessionId: string;
//   let voteId: number;
//   let positionIds: number[] = [];

//   beforeAll(async () => {
//     // Register user
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText);
//     const registerRes = await request(app)
//       .post(registerRoute)
//       .send({ zId, zPass });

//     expect(registerRes.statusCode).toBe(200);
//     sessionId = registerRes.body.sessionId;

//     // Create vote
//     // Create vote
//     const createVoteRes = await request(app)
//       .post(createVoteRoute)
//       .set('x-session-id', sessionId)
//       .send({
//         title: "Test Election yippee!",
//         description: "This is a test election. it has one position to vote for.",
//         images: [],
//         startDate: new Date(),
//         endDate: new Date(),
//         zid_requirement: false,
//         locationOfVote: "library"
//       });

//     expect(createVoteRes.statusCode).toBe(200);
//     voteId = createVoteRes.body.electionId;
//     // console.log("the voteid is... " + voteRes.body);

//     // Create positions
//     const titles = ['President', 'Treasurer'];
//     for (const title of titles) {
//       const posRes = await request(app)
//         .post(createPositionRoute)
//         .set('x-session-id', sessionId)
//         .send({
//           voteId,
//           title,
//           questionType: QuestionType.Preferential,
//         });

//       expect(posRes.statusCode).toBe(200);
//       positionIds.push(posRes.body.result.positionId);
//     }
//   });

  // it('should reorder the positions in the election', async () => {
  //   const newOrder = [...positionIds].reverse();

  //   const res = await request(app)
  //   .post(reorderPositionsRoute)
  //   .set('x-session-id', sessionId)
  //   .send({
  //     voteId,
  //     newOrder,
  //   });  

  //   expect(res.statusCode).toBe(200);
  //   expect(res.body.result.message).toBe('Positions reordered successfully');

  //   // View positions to verify order
  //   const viewRes = await request(app)
  //   .get(getViewPositionsRoute(voteId))
  //   .set('x-session-id', sessionId);

  //   expect(viewRes.statusCode).toBe(200);
  //   const returnedIds = viewRes.body.result.positions.map((p: any) => p.id);

  //   expect(returnedIds).toEqual(newOrder);
  // });

//   it('should delete a position from the election', async () => {
//     // Ensure we have at least one position left to delete
//     const viewBefore = await request(app)
//       .get(getViewPositionsRoute(voteId))
//       .set('x-session-id', sessionId);
  
//     expect(viewBefore.statusCode).toBe(200);
//     const positionsBefore = viewBefore.body.result.positions;
//     expect(positionsBefore.length).toBeGreaterThan(0);
  
//     const targetPositionId = positionsBefore[0].id;
  
//     // Perform delete
//     const deleteRes = await request(app)
//       .delete(getDeletePositionRoute(voteId, targetPositionId))
//       .set('x-session-id', sessionId);
  
//     expect(deleteRes.statusCode).toBe(200);
//     expect(deleteRes.body.success).toBe(true);
  
//     // Verify it's been deleted
//     const viewAfter = await request(app)
//       .get(getViewPositionsRoute(voteId))
//       .set('x-session-id', sessionId);
  
//     const positionIdsAfter = viewAfter.body.result.positions.map((p: any) => p.id);
//     expect(positionIdsAfter).not.toContain(targetPositionId);
//   });
// });

// // tests for viewing/adding/modifying/deleting candidates in a position
// describe('tests for viewing/adding/modifying/deleting candidates in a position', () => {
//   let sessionId: string;
//   let voteId: number;
//   let positionId: number;

//   beforeAll(async () => {
//     // await clear();

//     // Register user
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText);
//     const registerRes = await request(app)
//       .post(registerRoute)
//       .send({ zId, zPass });

//     expect(registerRes.statusCode).toBe(200);
//     sessionId = registerRes.body.sessionId;

//     // Create vote
//     const createVoteRes = await request(app)
//       .post(createVoteRoute)
//       .set('x-session-id', sessionId)
//       .send({
//         title: "Test Election yippee!",
//         description: "This is a test election. it has one position to vote for.",
//         images: [],
//         startDate: new Date(),
//         endDate: new Date(),
//         zid_requirement: false,
//         locationOfVote: "library"
//       });

//     expect(createVoteRes.statusCode).toBe(200);
//     voteId = createVoteRes.body.electionId;

//     // Create position
//     const createPositionRes = await request(app)
//       .post(createPositionRoute)
//       .set('x-session-id', sessionId)
//       .send({
//         voteId,
//         title: "President",
//         questionType: QuestionType.Preferential
//       });

//     expect(createPositionRes.statusCode).toBe(200);
//     positionId = createPositionRes.body.result.positionId;
//     console.log(positionId);
//   });

//   it('Should create, view, edit, and delete a candidate successfully', async () => {
//     // 1. Create Candidate
//     const createCandidateRes = await request(app)
//       .post(createCandidateRoute)
//       .set('x-session-id', sessionId)
//       .send({
//         voteId,
//         positionId,
//         name: "Jane Doe"
//       });

//     expect(createCandidateRes.statusCode).toBe(200);

//     // 2. View Candidates
//     const viewRes1 = await request(app)
//       .get(getViewCandidatesRoute(voteId, positionId))
//       .set('x-session-id', sessionId);

//     expect(viewRes1.statusCode).toBe(200);
//     expect(viewRes1.body.result).toHaveLength(1);
//     expect(viewRes1.body.result[0].fullName).toBe("Jane Doe");

//     const candidateIndex = viewRes1.body.result[0].candidateIndex;

//     // 3. Edit Candidate
//     const editCandidateRes = await request(app)
//       .post(editCandidateRoute)
//       .set('x-session-id', sessionId)
//       .send({
//         voteId,
//         positionId,
//         candidateIndex,
//         name: "Jane Smith",
//         description: "Updated bio",
//         image: "https://example.com/image.jpg"
//       });

//     expect(editCandidateRes.statusCode).toBe(200);

//     // 4. View Candidates (after edit)
//     const viewRes2 = await request(app)
//       .get(getViewCandidatesRoute(voteId, positionId))
//       .set('x-session-id', sessionId);

//     expect(viewRes2.statusCode).toBe(200);
//     expect(viewRes2.body.result).toHaveLength(1);
//     expect(viewRes2.body.result[0].fullName).toBe("Jane Smith");
//     expect(viewRes2.body.result[0].description).toBe("Updated bio");

//     // 5. Delete Candidate
//     const deleteRes = await request(app)
//       .delete(getDeleteCandidateRoute(voteId, positionId, candidateIndex))
//       .set('x-session-id', sessionId);

//     expect(deleteRes.statusCode).toBe(200);

//     // 6. View Candidates (after deletion)
//     const viewRes3 = await request(app)
//       .get(getViewCandidatesRoute(voteId, positionId))
//       .set('x-session-id', sessionId);

//     expect(viewRes3.statusCode).toBe(200);
//     expect(viewRes3.body.result).toHaveLength(0);
//   });
// });



// db
// {
//   "461763549": {
//     "id": 461763549,
//     "authUserId": "23cb8a19b7a7246b5029df0ccbff840576e305fbae6a338353b635380b62c48e",
//     "name": "Test Election",
//     "description": "This is a test election",
//     "images": [],
//     "location": "library",
//     "date_time_start": "2025-05-25T13:47:06.890Z",
//     "date_time_end": "2025-05-25T13:47:06.890Z",
//     "requires_zid": false,
//     "questions": [
//       {
//         "id": 195018718,
//         "title": "President",
//         "candidates": [
//           {
//             "fullName": "d",
//             "description": "",
//             "image": "",
//             "candidateIndex": 939496344
//           },
//           {
//             "fullName": "a",
//             "description": "",
//             "image": "",
//             "candidateIndex": 290814087
//           },
//           {
//             "fullName": "b",
//             "description": "",
//             "image": "",
//             "candidateIndex": 624336104
//           },
//           {
//             "fullName": "c",
//             "description": "",
//             "image": "",
//             "candidateIndex": 362976744
//           }
//         ],
//         "questionType": 1,
//         "ballot": [
//             [939496344, 290814087, 624336104, 362976744],
//             [290814087, 939496344],
//             [624336104],
//             [],
//             [362976744, 624336104],
//             [939496344],
//             [290814087, 362976744],
//             [624336104, 939496344, 290814087],
//             [],
//             [362976744],
//             [939496344, 624336104],
//             [290814087],
//             [362976744, 939496344],
//             [624336104, 290814087],
//             [],
//             [939496344, 362976744],
//             [290814087, 624336104],
//             [362976744],
//             [939496344, 290814087, 624336104],
//             []
//         ]
//       }
//     ],
//     "isActive": true,
//     "voters": [],
//     "sessionCode": "xlpgt"
//   }
// }