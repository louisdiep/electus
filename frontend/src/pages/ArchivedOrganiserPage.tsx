import { useEffect, useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import VoterCode from "../components/containers/VoterCode";
import OrganiserList from "../components/containers/ListVoters";
interface OrganiserInput {
  name: string,
}

export default function OrganiserPage({ name }: OrganiserInput) {
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0); // number of voters in the session

  // for session ids?
  // const [zidList, setZidList] = useState<string[]>([]); // [userSessionID2, userSessionID1]

  // zidList is for DISPLAYING in the view/list.
  const [zidList, setZidList] = useState<string[]>([]); // [z1234567, z2345678]

  useEffect(() => {
    setLoading(false) // once correct information has been loaded, change to false
  }, [zidList]);

  useEffect(() => {
    // TODO: "there is 1 voter in this session." <- ideal text
    setCount(zidList.length) // there are 2 voters in this session.
  }, [zidList]);

  return (
    <>
      {loading ? <StyledBackground className='main flex justify-center items-center'>
        <div className="text-4xl mb-20 text-[#F1E9E9]"> Starting Vote: {name}... </div>
      </StyledBackground> :
        <StyledBackground className="main">
          <div className="flex self-center text-2xl mt-10 text-[#F1E9E9]"> Started Voting Session: {name}... </div>
          <div className="grid grid-cols-2 gap-2 mt-8">
            <VoterCode zidList={zidList} setZidList={setZidList} />
            <OrganiserList zidList={zidList} num={count.toString()} setZidList={setZidList} />
          </div>
        </StyledBackground>}
    </>
  )
}
