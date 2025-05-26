import smallButton from './smallButton.svg';
import './SmallButton.css'
import editIcon from '../../assets/svg/edit.svg'
import startIcon from '../../assets/svg/start.svg'
import binIcon from '../../assets/svg/bin.svg'
import upIcon from '../../assets/svg/upArrow.svg'
import downIcon from '../../assets/svg/downArrow.svg'
import stopIcon from '../../assets/svg/stop.svg'
import resultsIcon from '../../assets/svg/results.svg'



// interface SmallButtonInputs {
// 	buttonType: string,
// }

type SmallButtonProps = {
    buttonType: string;
    onClick?: () => void;
};

export default function SmallButton({ buttonType, onClick }: SmallButtonProps) {
    let buttonIcon
    if (buttonType == 'edit') {
        buttonIcon = editIcon
    } else if (buttonType == 'start') {
        buttonIcon = startIcon
    } else if (buttonType == 'stop') {
        buttonIcon = stopIcon
    } else if (buttonType == 'results') {
        buttonIcon = resultsIcon
    } else if (buttonType == 'bin') {
        buttonIcon = binIcon
    } else if (buttonType == 'up') {
        buttonIcon = upIcon
    } else if (buttonType == 'down') {
        buttonIcon = downIcon
    }

    return (
        <button className="small-button" onClick={onClick}>
            <img src={smallButton} alt="Small button" />
            <img className="small-button-icon" src={buttonIcon} />
        </button>
    )
}