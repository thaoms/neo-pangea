import * as THREE from 'three';
import React, { StrictMode, Suspense, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { ResponseField } from './components/ResponseField';
import { InputSection } from './components/InputSection';
import { AudioControl } from './components/AudioControl';
import { useErrorBoundary } from 'use-error-boundary';
import { Html } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';

export function App() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<THREE.Camera | null>(null);

    const handleQuestionSubmission = async (question: string) => {
        setLoading(true);
        setResponse('');
        try {
            const res = await fetch('http://localhost:3000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });
            const data = await res.json();
            if (res.ok) {
                setResponse(data.reply);
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

    return didCatch
        ? (
                <div>{error.message}</div>
            )
        : (

                <StrictMode>
                    <ErrorBoundary>
                        <Canvas
                            onCreated={({ camera }) => {
                                cameraRef.current = camera;
                            }}
                            camera={{ fov: 75, position: [0, 0, 3], near: 0.1, far: 1000 }}
                            gl={{
                                powerPreference: 'high-performance',
                                antialias: true,
                                toneMapping: THREE.ACESFilmicToneMapping,
                                outputColorSpace: THREE.SRGBColorSpace,
                            }}
                        >
                            <Suspense fallback={<Html center>Loading.</Html>}>
                                <Scene onClick={handleQuestionSubmission} />
                            </Suspense>
                            <EffectComposer multisampling={0} enableNormalPass={false}>
                                <DepthOfField
                                    focusDistance={0}
                                    focalLength={0.08}
                                    bokehScale={0.5}
                                    height={480}
                                />
                                <Bloom
                                    luminanceThreshold={0}
                                    luminanceSmoothing={1}
                                    opacity={3}
                                    height={300}
                                />
                                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                            </EffectComposer>
                        </Canvas>
                    </ErrorBoundary>
                    <InputSection onSubmit={handleQuestionSubmission} />
                    <ResponseField response={response} loading={loading} onClose={() => setResponse('')} />
                    <AudioControl audioFile="./audio/ambient-space-noise-55472.mp3" />
                </StrictMode>
            );
}

createRoot(document.getElementById('root')!).render(<App />);
