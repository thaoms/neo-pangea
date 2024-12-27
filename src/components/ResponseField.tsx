import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import Typewriter from 'typewriter-effect';

export function ResponseField({
    question,
    response,
    loading,
    onClose,
}: {
    question: string;
    response: string;
    loading: boolean;
    onClose: () => void;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [hasPlayedOpenSound, setHasPlayedOpenSound] = useState(false);

    const typingSound = useRef<Howl | null>(null);
    const openSound = useRef<Howl | null>(null);
    const closeSound = useRef<Howl | null>(null);

    useEffect(() => {
        typingSound.current = new Howl({
            src: ['./audio/fast-typing-keyboard.mp3'],
            loop: true,
            volume: 0.2,
        });

        openSound.current = new Howl({
            src: ['./audio/ui-pop-up.mp3'],
            volume: 0.5,
        });

        closeSound.current = new Howl({
            src: ['./audio/ui-exit.mp3'],
            volume: 0.5,
        });

        return () => {
            typingSound.current?.unload();
            openSound.current?.unload();
            closeSound.current?.unload();
        };
    }, []);

    // Play open sound only once when modal becomes visible
    useEffect(() => {
        if ((response || loading) && !hasPlayedOpenSound) {
            openSound.current?.play();
            setHasPlayedOpenSound(true); // Mark that the sound has been played
        }

        if (!response && !loading) {
            setHasPlayedOpenSound(false); // Reset when modal is closed
        }

        if (response && !loading) {
            typingSound.current?.play();
        }
    }, [response, loading, hasPlayedOpenSound]);

    const handleClose = () => {
        typingSound.current?.stop();
        closeSound.current?.play();
        onClose();
    };

    // Add parallax effect
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;

            const { clientX, clientY } = event;
            const { innerWidth, innerHeight } = window;

            const xOffset = ((clientX / innerWidth) - 0.5) * 20;
            const yOffset = ((clientY / innerHeight) - 0.5) * 20;

            containerRef.current.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${-yOffset}deg) rotateY(${xOffset}deg)`;
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleClose]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50 ${
                    response || loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={handleClose}
            >
            </div>
            <div
                ref={containerRef}
                id="response-field"
                className={`max-h-[400px] overflow-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl shadow-xl min-w-60 w-11/12 md:w-2/4 transition-transform transition-opacity z-50 space-y-4 ${
                    response || loading ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                }`}
                style={{
                    background:
                        'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    perspective: '1000px',
                }}
            >
                <button
                    onClick={handleClose}
                    style={{
                        background:
                            'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
                    }}
                    className="absolute top-2 right-2 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-300"
                    aria-label="Close"
                >
                    &#x2715;
                </button>

                <div
                    id="spinner"
                    className={`w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto ${
                        loading ? '' : 'hidden'
                    }`}
                >
                </div>

                <h1 className="text-white text-opacity-90 font-medium text-lg leading-6 transition-opacity duration-500 pr-5">
                    {question}
                </h1>
                <pre
                    id="response-text"
                    className={`text-white text-opacity-90 font-medium text-sm leading-6 transition-opacity duration-500 pr-5 text-wrap ${
                        !loading && response ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {response && (
                        <Typewriter
                            options={{
                                delay: 50,
                            }}
                            onInit={(typewriter) => {
                                typewriter
                                    .typeString(response)
                                    .callFunction(() => {
                                        typingSound.current?.stop();
                                    })
                                    .start();
                            }}
                        />
                    )}
                </pre>
            </div>
        </>
    );
}
