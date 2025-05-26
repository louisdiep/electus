import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router';
import StyledBackground from "../components/background/StyledBackground";
import Heading from "../components/buttons/Heading";
import MedHeading from "../components/buttons/MedHeading";
import SmallButton from "../components/buttons/SmallButton";
import { deleteElement, reorderElements } from "../helpers";
import CandidatePane from "../components/buttons/CandidatePane";
import ThinGradientButton from "../components/buttons/ThinGradientButton";
import { Ballot, Question } from "../../../shared/interfaces";

export default function VoterVotingPage() {
const { id} = useParams();
if (!id) {
    // handle missing index, e.g. show error or fallback
    throw new Error("Index parameter is missing");
  }

    const navigate = useNavigate();

    interface thisPagesCandidates {
        position: string,
        candidates: string[],
    }
    const placeHolderCandidates:thisPagesCandidates[] = [
        {
            position: 'Treasurer',
            candidates: ['Matthew Stewart', 'Lara Thiele', 'Lotte Schipper']
        },
        {
            position: 'GEDI Officer',
            candidates: ['Alexander Taylor', 'Alexia Lebrun', 'Carolina Barboza']
        }
    ]

    useEffect(() => {
    const fetchPositions = async () => {
    const userSessionId = localStorage.getItem('user-session-id');
    const sessionCode = id; 

    try {
        const API_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${API_URL}/api/voters/viewPositionsPublic`, {
       headers: {
          'Content-Type': 'application/json',
        },
                method: 'POST',

        body: JSON.stringify({ userSessionId: userSessionId, sessionCode: sessionCode }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
console.log(data)
const positions:Question[] = data.result.positions;
      // data.result.positions contains the questions
      const loadedCandidates:thisPagesCandidates[] = positions.map(q => ({
            position: q.title,
            candidates: q.candidates.map(c => c.name),
        }));
    setOriginalCandidates(loadedCandidates);
    setCandidates(loadedCandidates)
    } catch (err) {
        console.log(err)
    }
  };
  fetchPositions();
  }, []);

    const [originalCandidates, setOriginalCandidates] = useState(placeHolderCandidates);
    const [candidates, setCandidates] = useState(originalCandidates);
    //const [positionIndex, setPositionIndex] = useState(index);
    const indexParam = useParams().index ?? "0"; // fallback to "0"
    const positionIndex = parseInt(indexParam, 10);
    
    const positionName = candidates[positionIndex].position;
    const currentCandidates = candidates[positionIndex].candidates;

    const handleReorder = (index: number, direction: 'up' | 'down') => {
        const updated = reorderElements(currentCandidates, index, direction);
        const newCandidates = [...candidates];
        newCandidates[positionIndex] = {
            position: newCandidates[positionIndex].position,
            candidates: updated
        };
        setCandidates(newCandidates);
    };

    const handleDeletion = (index: number) => {
        const updated = deleteElement(currentCandidates, index);
        const newCandidates = [...candidates];
        newCandidates[positionIndex] = {
            position: newCandidates[positionIndex].position,
            candidates: updated
        };
        setCandidates(newCandidates);
    }

    const handleReset = () => {
        const newCandidates = [...candidates];
        newCandidates[positionIndex] = originalCandidates[positionIndex]
        setCandidates(originalCandidates);
    }
    const handleConfirm = () => {
        const preferences = new Array(originalCandidates.length);
        originalCandidates.forEach((originalCandidate, originalIndex) => {
            const currentIndex = candidates.indexOf(originalCandidate);
            preferences[originalIndex] = currentIndex;
        });
        const userSessionId = localStorage.getItem('user-session-id');
        const API_URL = import.meta.env.VITE_BACKEND_URL;
        fetch(`${API_URL}/api/voter/vote`, {
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
              body: JSON.stringify(
                {
                userSessionId: userSessionId,
                sessionCode: id,
                positionId: indexParam,
                preferences: preferences

                }),
            });
        if (positionIndex < candidates.length - 1) {
            navigate(`/voter/voting/${id.trim()}/${positionIndex+1}`);
        } else {
            navigate("/voter/finish");
        }
    };

    const handleAbstain = () => {
        if (positionIndex < candidates.length - 1) {
            navigate(`/voter/voting/${id.trim()}/${positionIndex+1}`);
        } else {
            navigate("/voter/finish");
        }
    };

    return (
        <StyledBackground className='main'>
            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[0rem]
                p-[6rem]
            ">
                <Heading text={`Now voting for ${positionName}`} />
                <MedHeading text="Order or delete the candidates based on your choice."></MedHeading>
                {currentCandidates.map((name, index) => (
                    <div className="flex flex-row justify-center items-center gap-[2vw]">
                        <CandidatePane order={index + 1} text={name} margin="mt-[0]">
                            <div className="buttons-container">
                                <SmallButton
                                    buttonType="up"
                                    onClick={() => handleReorder(index, 'up')}
                                />
                                <SmallButton
                                    buttonType="down"
                                    onClick={() => handleReorder(index, 'down')}
                                />
                            </div>
                        </CandidatePane>
                        <SmallButton buttonType="bin" onClick={() => handleDeletion(index)} />
                    </div>
                ))}
                <div className="flex flex-row justify-between gap-2 items-center">
                    <ThinGradientButton
                        text="Reset"
                        margin="mt-4"
                        onClick={() => handleReset()}
                        w={"w-100"}
                    />
                    <ThinGradientButton text={positionIndex === candidates.length - 1 ? 'Finish' : 'Confirm'}
                        margin="mt-[0em]"
                        onClick={() => handleConfirm()}
                        w={"w-100"}
                    />
                </div>
                <ThinGradientButton text="I want to abstain" margin="mt-4" onClick={() => handleAbstain()} w={"w-50"} />
            </div>
        </StyledBackground>
    )
}