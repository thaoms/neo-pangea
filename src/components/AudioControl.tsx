import React, { useRef, useState } from 'react';

interface AudioControlProps {
    audioFile: string;
}

export function AudioControl({ audioFile }: AudioControlProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            }
            else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div
            id="audio-toggle"
            style={{ background: 'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))' }}
            className="fixed bottom-5 left-5 w-12 h-12 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-700 transition"
            onClick={toggleAudio}
        >
            <span id="audio-icon" className="text-lg">{isPlaying ? '🔊' : '🔈'}</span>
            <audio ref={audioRef} src={audioFile} loop preload="auto" />
        </div>
    );
}
