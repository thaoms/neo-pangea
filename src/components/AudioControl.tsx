import { useRef, useState, useEffect } from 'react';

interface AudioControlProps {
    audioFile: string;
}

export function AudioControl({ audioFile }: AudioControlProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        // If autoplay works, sync the state initially
        if (!audio.paused) {
            setIsPlaying(true);
        }

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            }
            else {
                audioRef.current.play().catch((error) => {
                    console.error('Playback failed: ', error);
                });
            }
        }
    };

    return (
        <div
            id="audio-toggle"
            className="fixed bottom-5 left-5 w-12 h-12 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gradient-to-l transition bg-gradient-to-r from-blue-900/50 via-purple-800/40 to-pink-700/30"
            onClick={toggleAudio}
        >
            <span id="audio-icon" className="text-lg">{isPlaying ? '🔊' : '🔈'}</span>
            <audio ref={audioRef} src={audioFile} autoPlay loop preload="auto" />
        </div>
    );
}
