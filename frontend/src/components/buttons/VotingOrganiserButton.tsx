import { useNavigate } from "react-router";

interface VotingOrganiserButtonInputs {
  zid: string,
  text: string,
  width: string,
  height: string,
  zidList: string[],
  setZidList: React.Dispatch<React.SetStateAction<string[]>>,
}

export default function VotingOrganiserButton({ zid, text, width, height, zidList, setZidList }: VotingOrganiserButtonInputs) {
  const navigate = useNavigate();
  const handleChange = (): void => {
    /*
    * Deprecated Code !!
    *
    // const matching_voter_code_regex = new RegExp('[A-Z]{3}[0-9]{3}');
    const matching_zID_regex = new RegExp('z[0-9]{7}');
    // console.log(matching_zID_regex.test(zid));
    if (text == "Add" && matching_zID_regex.test(zid) && !zidList.includes(zid)) {
      const newZidList = [...zidList]
      newZidList.push(zid);
      setZidList(newZidList);
    } else if (text == "Add" && !matching_zID_regex.test(zid)) {
      alert("Please input the voter's code in the form of [z1234567]");
      // alert("Please input the voter's code in the form of [ABC123]");
    } else if (text == "Add" && zidList.includes(zid)) {
      alert("Voter is already in the session")
    }

    else */if (text == "Start Session") {
      // TODO: Start the voting session, passing through the list of voters
      navigate('/creator/view-voting-sessions');
    }
  }

  return (
    <button onClick={handleChange} className={`hover:opacity-85 text-xl cursor-pointer ${width} ${height} text-white text-center content-center border-1 border-[#F1E9E9] rounded-4xl backdrop-blur-2xl bg-gradient-to-br from-violet-950/70 to-white/10`}>
      {text}
    </button>
  );
}