import './WideButton.css'

interface WideButtonInputs {
	text?: string,
	margin?: string,
	children?: React.ReactNode
}

export default function WideButton({ text, margin, children }: WideButtonInputs) {
	return (
		<div className={`flex justify-around ${margin}`}>
			<div className="wide-button">
				<div className="ml-10 max-h-full overflow-y-auto text-left">{text}</div>
				<div className="buttons">
					{children}
				</div>
			</div>
		</div>
	);
}