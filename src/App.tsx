import * as THREE from 'three';
import { StrictMode, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { ResponseField } from './components/ResponseField';
import { InputSection } from './components/InputSection';
import { AudioControl } from './components/AudioControl';
import { useErrorBoundary } from 'use-error-boundary';
import { Question } from './components/SpeechBubble';

export function App() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<THREE.Camera | null>(null);
    const questionRef = useRef('');

    const apiUrl = import.meta.env.VITE_VERCEL_URL;

    const handleQuestionSubmission = async (questionRaw: Question) => {
        setLoading(true);
        setResponse('');
        questionRef.current = '';

        const question = questionRaw.text + ' lat:' + questionRaw.lat + ' lon:' + questionRaw.lon;

        try {
            const res = await fetch(`https://${apiUrl}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(data.reply);
                questionRef.current = questionRaw.text;
            }
            else {
                setResponse(`Error: ${data.error}`);
            }
        }
        catch (_error) {
            setResponse('Failed to fetch response from the server.');
        }
        finally {
            setLoading(false);
        }
    };

    const { ErrorBoundary, didCatch, error } = useErrorBoundary();

    // Memoize the canvas to prevent re-renders
    const canvasContent = useMemo(() => {
        return (
            <Canvas
                shadows
                onCreated={({ camera }) => {
                    cameraRef.current = camera;
                }}
                camera={{
                    fov: 75,
                    zoom: 1.35,
                    position: [-1.6316685229806154, 0.201345686532158, -1.6318967014497379],
                    near: 0.1,
                    far: 1000,
                }}
                gl={{
                    pixelRatio: Math.min(window.devicePixelRatio, 2),
                    antialias: true,
                    alpha: false,
                    stencil: false,
                }}
            >
                <Scene onClick={handleQuestionSubmission} />
            </Canvas>
        );
    }, []);

    return didCatch
        ? (
                <div>{error.message}</div>
            )
        : (
                <StrictMode>
                    <ErrorBoundary>
                        {canvasContent}
                    </ErrorBoundary>
                    <InputSection onSubmit={handleQuestionSubmission} />
                    <ResponseField question={questionRef.current} response={response} loading={loading} onClose={() => setResponse('')} />
                    <AudioControl audioFile="./audio/ambient-space-noise-55472.mp3" />
                </StrictMode>
            );
}
