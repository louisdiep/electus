import React, { ReactNode } from 'react';
import background from '../../assets/svg/background.svg'

interface StyledBackgroundProps {
    children?: ReactNode;
    className?: string;
    w: string;
    h: string;
}

const StyledContainer: React.FC<StyledBackgroundProps> = ({ children, w, h, className = '' }) => {
    return (
        <>
            <div
                className={`${className}`}
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: `${w}`,
                    height: `${h}`,
                    padding: '40px'
                }}
            >
                {children}
            </div>
        </>

    );
};

export default StyledContainer;
