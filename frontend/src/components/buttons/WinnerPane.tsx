import './WinnerPane.css'

interface Winner {
    position: string,
    name: string
}

interface WinnerPaneInputs {
	winner: Winner,
}

export default function WinnerPane({ winner }: WinnerPaneInputs) {
	return (
        <div className="winner-pane">
            <div className="text-center md:text-2xl mb-[1rem]">{winner.position}</div>
            <div className="text-center text-2xl mb-[1rem] md:text-5xl">{winner.name}</div>
        </div>
	);
}