// // import { clear, getSessions} from "../data/dataStore";
// import { encryptWithPublicKey } from "../../../shared/src/encryptionBackend";
// import { post, OK, BAD_REQUEST, UNAUTHORISED } from './testUtil';
// import { registerRoute, loginRoute, logoutRoute } from "./testUtil";
// import { zidPlainText, zpassPlainText } from "./testUtil";
// import { clear, getSessionData } from "../data/dataStore";

// async function beforeEveryTest() {
//   await new Promise(res => setTimeout(res, 10));
//   // await clear();
// }

// ////////////////////////////// TEST CASES  ////////////////////////////////

// describe('auth register tests!', () => {
//   beforeEach(async () => await beforeEveryTest());

  
//   // you can manually check that this test works by using your own zid and zpass
//   // (it works)
//   test('Successful, returns nothing', () => {
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText); // helper function directly encrypts, not testing encrypton from frontend
//     const res = post(registerRoute, { zId, zPass });

//     expect(res.statusCode).toEqual(OK);
//     expect(res.body).toEqual({
//       "sessionId": expect.any(String)
//     });
//   });

//   test('Unsuccessful, missing zId + zPass', () => {
//     const res = post(registerRoute, {});
//     expect(res.statusCode).toEqual(BAD_REQUEST);
//     expect(res.body).toEqual({
//       error: expect.any(String),
//     });
//   });
// });

// describe('auth login tests!', () => {
//   beforeEach(async () => await beforeEveryTest());


//   afterEach(() => {
//     clear();
//   });

//   test.only('Successful, logs in the user and returns a session id', async () => {
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText); // helper function directly encrypts, not testing encrypton from frontend
    
//     const regRes = post(registerRoute, { zId, zPass });

//     expect(regRes.statusCode).toEqual(OK);

//     // log out
//     const sessionId = regRes.body.sessionId;
//     const logoutRes = post(logoutRoute, { sessionId });

//     // then log back in again
//     const loginRes = post(loginRoute, { zId, zPass });
//     expect(loginRes.statusCode).toEqual(OK);
//     expect(loginRes.body).toEqual({
//       sessionId: expect.any(String),
//     });

//     // verify session id
//     // const payload = verifySessionId(sessionId);
//     // expect(payload).toEqual(expect.objectContaining({
//     //   userId: getHashOf('z5478718'),
//     // })); 
//   });

//   test('Unsuccessful login, missing body', () => {
//     const res = post(loginRoute, {});
//     expect(res.statusCode).toEqual(BAD_REQUEST);
//     expect(res.body).toEqual({
//       error: expect.any(String),
//     });
//   });
// });

// describe('auth logout tests!', () => {
//   beforeEach(async () => await beforeEveryTest());

//   afterEach(() => {
//     // clear();
//   });

//   // you can manually check that this test works by using your own zid and zpass
//   // (it works)
//   test('Successful logout', async () => {
//     const zId = encryptWithPublicKey(zidPlainText);
//     const zPass = encryptWithPublicKey(zpassPlainText);
  
//     const regRes = post(registerRoute, { zId, zPass });
//     expect(regRes.statusCode).toEqual(OK);
  
//     const sessionId = regRes.body.sessionId;
  
//     const logoutRes = post(logoutRoute, { sessionId });
//     expect(logoutRes.statusCode).toEqual(OK);
//     expect(logoutRes.body).toEqual({ message: expect.any(String) });
  
//     // Confirm session is gone
//     let stillActive: boolean = false;
  
//     await getSessionData(store => {
//       stillActive = store.sessions.some(s => s.sessionId === sessionId);
//     });
  
//     expect(stillActive).toBe(false);
//   });  

//   test('Unsuccessful logout: missing token', () => {
//     const res = post(logoutRoute, {});
//     expect(res.statusCode).toEqual(BAD_REQUEST);
//     expect(res.body).toEqual({
//       error: expect.any(String),
//     });
//   });

//   test('Unsuccessful logout: invalid token', () => {
//     const res = post(logoutRoute, { token: 'not-a-real-jwt' });
//     expect(res.statusCode).toEqual(UNAUTHORISED);
//     expect(res.body).toEqual({
//       error: expect.any(String),
//     });
//   });
// });