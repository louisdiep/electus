import { useNavigate } from "react-router";
import StyledBackground from "../components/background/StyledBackground";
import Heading from "../components/buttons/Heading";
import WinnerPane from "../components/buttons/WinnerPane";

export default function ResultsPage() {
    const results = {
        voteName: 'DevSoc AGM Voting 2025',
        winners: [
            {
                position: 'Treasurer',
                name: 'Matthew Stewart'
            },
            {
                position: 'GEDI Officer',
                name: 'Alexander Taylor'
            },
            {
                position: 'Co-president (Project Operations)',
                name: 'Alexander Taylor'
            },
            {
                position: 'Co-president (Project Operations)',
                name: 'Alexander Taylorf asldfjkaksjd flaksjdfl aksjdflasdf'
            }
        ]
    };

    const navigate = useNavigate();
    const goBack = () => {
        navigate('/creator/view-voting-sessions')
    }

    return (
        <StyledBackground className='main'>

            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[0rem]
                p-[6rem]
            ">
                <button className="hover:cursor-pointer text-white p-4 text-2xl absolute top-2 left-4 z-10" onClick={goBack}>
                    ←
                </button>
                <Heading text={`${results.voteName} Results`} />
                {results.winners.map((winner, index) => (
                    <WinnerPane key={index} winner={winner}>
                    </WinnerPane>
                ))}
            </div>
        </StyledBackground>
    )
}