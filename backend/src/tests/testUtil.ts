import { deleteAllCandidates } from "../services/voteCreate.services";
import request from 'sync-request';
import config from "../config/config";

////////////////////////////// VARIABLES  //////////////////////////
export const zidPlainText = process.env.ZID!;
export const zpassPlainText = Buffer.from(process.env.ZPASS_BASE64!, 'base64').toString('utf-8');

////////////////////////////// ROUTES  ////////////////////////////////
const port = config.port;
const url = 'http://localhost';

export const registerRoute = '/api/auth/register';
export const loginRoute = '/api/auth/login';
export const logoutRoute = '/api/auth/logout';
export const createVoteRoute = '/api/auth/createElection';
export const viewElectionsRoute = '/api/auth/viewElections';
export const createPositionRoute = '/api/auth/createPosition';
export const reorderPositionsRoute = '/api/auth/reorderPositions';
export const createCandidateRoute = '/api/auth/createCandidate';
export const editCandidateRoute = '/api/auth/editCandidate';

export function getViewCandidatesRoute(voteId: number, positionId: number) {
  return `/api/auth/votes/${voteId}/positions/${positionId}/candidates`;
}

export function getDeleteCandidateRoute(voteId: number, positionId: number, candidateIndex: number) {
  return `/api/auth/votes/${voteId}/positions/${positionId}/candidates/${candidateIndex}`;
}

export function getViewPositionsRoute(voteId: number): string {
  return `/api/auth/viewPositions/${voteId}`;
}

export function getDeletePositionRoute(voteId: number, positionId: number): string {
  return `/api/auth/deletePosition/${voteId}/${positionId}`;
}

////////////////////////////// STATUS CODES  //////////////////////////
export const OK = 200;
export const BAD_REQUEST = 400;
export const UNAUTHORISED = 401;

////////////////////////////// HELPER FUNCTIONS  //////////////////////

// just some helper functions il define here for convenience
// to make testing more efficient
// src/test/testUtils.ts

export function resetTestVotePosition(
  userSessionId: string,
  voteId: number,
  positionId: number
) {
  return deleteAllCandidates({ userSessionId, voteId, positionId });
}


export function post(
  route: string,
  body: Record<string, any>,
  headers: Record<string, string> = {}
) {
  const res = request('POST', `${url}:${port}${route}`, {
    json: body,
    headers,
  });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

export function get(
  route: string,
  queryParams: Record<string, any> = {},
  headers: Record<string, string> = {}
) {
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  const fullUrl = `${url}:${port}${route}?${queryString}`;

  const res = request('GET', fullUrl, { headers });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

export function del(
  route: string,
  queryParams: Record<string, any> = {},
  headers: Record<string, string> = {}
) {
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  const fullUrl = `${url}:${port}${route}?${queryString}`;

  const res = request('DELETE', fullUrl, { headers });
  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body.toString()),
  };
}

  