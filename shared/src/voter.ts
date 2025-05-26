/**
 * Authenticate a voter - alr created
 */

/**
 * Start voter's session --> user session id?
 */

/**
 * Record vote for a specific position. Should accept an ordered list of candidates
 * or an abstention.
 * 
 * take userSessionId, hashmap:
 * 
 * sanity check:
 *  if election is an active session 
 *  if userSessionId's userId exist in election.voters[]
 *  check that user hasn't already voted
 * 
 * when user submit vote
 * pushes their ballot into question.ballot array
 * 
 */

const submitVote = (userSessionId: string, electionId: number): boolean => {
  // check if sesId is invalid -> throw error 
  return true;
}

/**
 * Other functions such as:
 * Moving to another position or getting the current position a voter is at
 * probably isn't required because the frontend handles moving between voting positions.
 * As a result, we just need to record the candidates a voter has voted for, for each position.
 */