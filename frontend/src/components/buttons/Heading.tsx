import './Heading.css'

interface HeadingInputs {
	text: string
}

export default function Heading({text}: HeadingInputs) {
  return (
    <div className='flex flex-row justify-center'>
      <div className="heading">{text}</div>
    </div>
  );
}