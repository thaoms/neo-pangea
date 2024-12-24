import { RefObject, useEffect, useState } from 'react';
import { Question, SpeechBubble3D } from './SpeechBubble';
import * as THREE from 'three';

interface SpeechBubbles3DProps {
    markerRadius: number;
    onClick: (question: Question) => void;
    earthGroupRef: RefObject<THREE.Group>;
}

export function SpeechBubbles3D({ markerRadius, onClick, earthGroupRef }: SpeechBubbles3DProps) {
    const [questions, setQuestions] = useState([]);

    const apiUrl = import.meta.env.VITE_VERCEL_URL;

    const getQuestions = async () => {
        try {
            const res = await fetch(`https://${apiUrl}/api/questions`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();

            if (res.ok) {
                setQuestions(JSON.parse(data.reply).questions);
            }
            else {
                console.log(`Error: ${data.error}`);
            }
        }
        catch (_error) {
            console.log('Failed to fetch response from the server.', _error);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []);

    return (
        <>
            {questions.map((data, index) => (
                <SpeechBubble3D
                    key={index}
                    question={data}
                    markerRadius={markerRadius}
                    onClick={onClick}
                    earthGroupRef={earthGroupRef}
                />
            ))}
        </>
    );
}
