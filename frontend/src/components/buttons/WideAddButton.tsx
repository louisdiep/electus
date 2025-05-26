import addIcon from '../../assets/svg/add.svg'
import './WideButton.css'

interface WideAddButtonInputs {
    onClick?: () => void
}

export default function WideAddButton({ onClick }: WideAddButtonInputs) {
    return (
        <button className="wide-button hover:cursor-pointer " onClick={onClick}>
            <img className="w-[6rem]" src={addIcon}></img>
        </button>
    );
}