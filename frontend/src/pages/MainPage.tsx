import './MainPage.css'
import MainButton from '../components/buttons/MainButton'
import StyledBackground from '../components/background/StyledBackground'

export default function MainPage() {
    return (
        <StyledBackground className='main'>
            <div className="button-container">
                <MainButton action="Join Vote" />
                <MainButton action="Create Vote" />
            </div>
        </StyledBackground>
    )
}

