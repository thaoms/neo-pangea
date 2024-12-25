import { useState, useEffect } from 'react';
import { Howl } from 'howler';

interface AudioControlProps {
    audioFile: string;
}

export function AudioControl({ audioFile }: AudioControlProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<Howl | null>(null);

    useEffect(() => {
        const sound = new Howl({
            src: [audioFile],
            autoplay: true,
            loop: true,
            preload: true,
            volume: 1,
        });

        sound.play();
        setIsPlaying(true);
        setAudio(sound);

        return () => {
            sound.unload();
        };
    }, [audioFile]);

    const toggleAudio = () => {
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        }
        else {
            audio.play();
        }

        setIsPlaying(!isPlaying);
    };

    return (
        <button
            type="button"
            title="Play Ambience sounds"
            id="audio-toggle"
            className="fixed bottom-20 right-5 w-12 h-12 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gradient-to-l transition bg-gradient-to-r from-blue-900/50 via-purple-800/40 to-pink-700/30 select-none"
            onClick={toggleAudio}
        >
            <span id="audio-icon" className="text-lg">{isPlaying ? '🔊' : '🔈'}</span>
        </button>
    );
}
