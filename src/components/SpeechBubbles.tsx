import { memo, RefObject, useEffect, useState } from 'react';
import { QuestionWithLocation, SpeechBubble3D } from './SpeechBubble';
import * as THREE from 'three';

interface SpeechBubbles3DProps {
    markerRadius: number;
    onClick: (question: QuestionWithLocation) => void;
    earthGroupRef: RefObject<THREE.Group>;
    isIdle: boolean;
}

const SpeechBubbles3D = memo(({ markerRadius, onClick, earthGroupRef, isIdle }: SpeechBubbles3DProps) => {
    const [questions, setQuestions] = useState([]);

    const getQuestions = async () => {
        try {
            const res = await fetch(`/api/questions`, {
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
                    isIdle={isIdle}
                />
            ))}
        </>
    );
});

export { SpeechBubbles3D };
