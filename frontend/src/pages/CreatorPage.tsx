import { useEffect, useState } from "react";
import StyledBackground from "../components/background/StyledBackground";
import AuthBox from "../components/containers/AuthBox";
import { useNavigate } from "react-router";

export default function CreatorPage() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 

    useEffect(() => {
        const checkSession = async () => {
            const sessionId = localStorage.getItem('user-session-id');
            if (sessionId) {
                const API_URL = import.meta.env.VITE_BACKEND_URL;
                const response = await fetch(`${API_URL}/api/auth/checkSession`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            sessionId: sessionId,
                        }),
                });
                if (response.ok) {
                    navigate('/creator/view-voting-sessions'); 
                    return;
                }
            }
            // No valid session
            setLoading(false);
        };

        checkSession();
    }, [navigate]);
    //ADd loading component here
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <StyledBackground className='main'>
            <AuthBox user={"creator"} />
        </StyledBackground>
    )
}