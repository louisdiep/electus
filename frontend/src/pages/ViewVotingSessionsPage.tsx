import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router';
import StyledBackground from "../components/background/StyledBackground";
import WideButton from "../components/buttons/WideButton";
import Heading from "../components/buttons/Heading";
import SmallButton from "../components/buttons/SmallButton";
import WideAddButton from "../components/buttons/WideAddButton";
import logoutIcon from "../assets/svg/logout.svg";
import { Election } from "../../../shared/interfaces";
import { useVoteCreateContext } from "../state/VoteCreateContext";

export default function ViewVotingSessionsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  // const [votingSessions, setVotingSessions] = useState<Election[]>([]);
  const debounceRef = useRef<boolean>(false);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const {state, dispatch} = useVoteCreateContext();
 
  useEffect(() => {
    if (!isFetching) {
        setIsFetching(true);
        (async () => {
        if (debounceRef.current) return;
        debounceRef.current = true;
        setTimeout(() => (debounceRef.current = false), 1000);

        try {
            const res = await fetch(`${API_URL}/api/auth/viewElections`, {
                headers: {
                    'x-session-id': localStorage.getItem('user-session-id') || ''
                }
                });
            if (!res.ok) throw new Error("Failed to fetch voting sessions");
            const data = await res.json();
            dispatch({type: "SET_ELECTIONS", payload: data.result.elections})
            // setVotingSessions(data.result.elections);
        } catch (err: any) {
            console.error(err);
            window.alert(err.message || "An unknown error occurred");
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
        })();
    }
  }, []);

  const handleStart   = (vote_id_input: string) => navigate(`/creator/voting-in-session/${vote_id_input}`);
  const handleStop    = (vote_id_input: string) => {
    console.log("")
  };
  const handleResults = (vote_id_input: string) => navigate(`/creator/results/${vote_id_input}`);
  const handleDeletion= (vote_id_input: string) => {/* your deletion logic */};
  const handleAddSession = () => navigate('/creator/create-vote');
  const handleLogout    = () => navigate('/');

  return (
    <StyledBackground className="main">
      <div className="relative h-[100vh] p-[6rem] overflow-y-auto no-scrollbar">
        {/* logout */}
        <button
          className="p-4 absolute top-2 right-4 z-20 hover:cursor-pointer"
          onClick={handleLogout}
          disabled={loading}
        >
          <img className="h-[40px]" src={logoutIcon} />
        </button>

        {/* semi-transparent overlay + spinner */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
            <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-12 w-12" />
          </div>
        )}

        {/* content */}
        <div className={`${loading ? 'opacity-50 pointer-events-none' : ''} flex flex-col gap-[1.5em] pt-0`}>
          <Heading text="Your Voting Sessions" />

          {state.elections.map((session, idx) => (
            <div onClick={() => {
              // console.log(session)
              navigate(`/creator/create-vote/${session.id}/positions`)
            }} key={idx} className="flex items-center justify-center gap-[2vw]">
              <WideButton text={session.name} margin="mt-[0]" disabled={loading}>
                <div className="buttons-container" style={{zIndex: 100}}>
                  <SmallButton
                    buttonType="start"
                    onClick={e => {
                      e.stopPropagation();

                      handleStart(session.id);
                    }}
                    disabled={loading}
                  />

                  <SmallButton
                    buttonType="results"
                    onClick={e => {
                      e.stopPropagation();
                      handleResults(session.id);
                    }}
                    disabled={loading}
                  />

                  <SmallButton
                    buttonType="bin"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeletion(session.id);
                    }}
                    disabled={loading}
                  />

                </div>
              </WideButton>
              <SmallButton
                buttonType="bin"
                onClick={() => handleDeletion(idx)}
                disabled={loading}
              />
            </div>
          ))}

          <WideAddButton onClick={handleAddSession} disabled={loading} />
        </div>
      </div>
    </StyledBackground>
  );
}
