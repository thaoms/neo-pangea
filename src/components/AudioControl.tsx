import { useRef, useState } from 'react';

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
            className="fixed bottom-5 left-5 w-12 h-12 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gradient-to-l transition bg-gradient-to-r from-blue-900/50 via-purple-800/40 to-pink-700/30"
            onClick={toggleAudio}
        >
            <span id="audio-icon" className="text-lg">{isPlaying ? '🔊' : '🔈'}</span>
            <audio ref={audioRef} src={audioFile} autoPlay loop preload="auto" />
        </div>
    );
}
