import * as THREE from 'three';
import { StrictMode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { ResponseField } from './components/ResponseField';
import { InputSection } from './components/InputSection';
import { AudioControl } from './components/AudioControl';
import { Question } from './components/SpeechBubble';
import { useIsMobile } from './utils/useIsMobile';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';
import { About } from './components/About';
import { SpotifyPlayerDrawer } from './components/SpotifyPlayerDrawer';

export function App() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<string>('');
    const cameraRef = useRef<THREE.Camera | null>(null);
    const isMobile = useIsMobile();


    const handleQuestionSubmission = useCallback(async (questionRaw: Question) => {
        setLoading(true);
        setResponse('');
        setCurrentQuestion('');

        const question = `${questionRaw.text} lat:${questionRaw.lat} lon:${questionRaw.lon}`;

        try {
            const res = await fetch(`/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(data.reply);
                setCurrentQuestion(questionRaw.text);
            }
            else {
                setResponse(`Error: ${data.error}`);
            }
        }
        catch (error) {
            console.error('Fetch error:', error);
            setResponse('Failed to fetch response from the server.');
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleContextLost = (event: Event) => {
            event.preventDefault();
            alert('WebGL context lost. Please reload the page.');
        };

        const handleContextRestored = () => {
            alert('WebGL context restored. Reloading the application.');
            window.location.reload();
        };

        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('webglcontextlost', handleContextLost, false);
            canvas.addEventListener('webglcontextrestored', handleContextRestored, false);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('webglcontextlost', handleContextLost);
                canvas.removeEventListener('webglcontextrestored', handleContextRestored);
            }
        };
    }, []);

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
                    pixelRatio: Math.min(window.devicePixelRatio, isMobile ? 1 : 2),
                    antialias: !isMobile,
                    alpha: false,
                    stencil: false,
                }}
            >
                <Scene onClick={handleQuestionSubmission} />
            </Canvas>
        );
    }, [isMobile, handleQuestionSubmission]);

    return (
        <StrictMode>
            <ErrorBoundary
                onError={(error, info) => {
                    console.error('ErrorBoundary caught an error', error, info);
                }}
                fallbackRender={({ error, resetErrorBoundary }) => (
                    <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
                )}
            >
                {canvasContent}
                <InputSection onSubmit={handleQuestionSubmission} />
                <ResponseField
                    question={currentQuestion}
                    response={response}
                    loading={loading}
                    onClose={() => setResponse('')}
                />
                <About />
                <AudioControl audioFile="./audio/ambient-space-noise-55472.mp3" />
                <SpotifyPlayerDrawer />
            </ErrorBoundary>
        </StrictMode>
    );
}
