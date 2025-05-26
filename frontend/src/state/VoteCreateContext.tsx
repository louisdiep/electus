import { createContext, useContext, useEffect, useReducer } from "react"
import { Election } from "../../../shared/interfaces"

interface VoteCreateState {
    zid: string,
    elections: Election[]
}

const initalState: VoteCreateState = {
    zid:  "",
    elections: []
}

type VoteCreateAction =
  | { type: 'SET_USERNAME', payload: string }
  | { type: 'SET_ELECTIONS', payload: Election[]}
  | { type: "LOGOUT", payload: null} 



interface VoteCreateContextProps {
	state: VoteCreateState
	dispatch: React.Dispatch<VoteCreateAction>
}

const VoteCreateContext = createContext<VoteCreateContextProps>({
	state: initalState,
	dispatch: () => undefined
})

function voteCreateReducer (state: VoteCreateState, action: VoteCreateAction): VoteCreateState {
	switch (action.type) {

		case 'SET_ELECTIONS':
			return { ...state, elections: action.payload }
		case 'SET_USERNAME':
			return { ...state, zid: action.payload }
        default:
            return {...state}
    }
}

export const VoteCreateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [state, dispatch] = useReducer(voteCreateReducer, initalState)

	useEffect(() => {

	}, [])
	return (
		<VoteCreateContext.Provider value={{ state, dispatch }}>
			{children}
		</VoteCreateContext.Provider>
	)
}

export const useVoteCreateContext = () => useContext(VoteCreateContext)
