import './MedHeading.css'

interface MedHeadingInputs {
	text: string
}

export default function MedHeading({text}: MedHeadingInputs) {
  return (
    <div className='flex flex-row justify-center'>
      <div className="med-heading">{text}</div>
    </div>
  );
}