import { useState } from 'react';

export function SpotifyPlayerDrawer() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            <button
                type="button"
                title="Play music"
                onClick={toggleDrawer}
                className="fixed bottom-5 right-5 w-12 h-12 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gradient-to-l transition bg-gradient-to-r from-blue-900/50 via-purple-800/40 to-pink-700/30 select-none"
                aria-label="Toggle Spotify Player"
            >
                {isOpen ? '🎵' : '🎧'}
            </button>

            <div
                className={`absolute bottom-0 right-0 transform transition-all duration-300 ease-in-out ${
                    isOpen ? '-translate-y-12 opacity-100' : 'translate-y-full opacity-0'
                } bg-black bg-opacity-80 shadow-lg rounded-lg overflow-hidden`}
                style={{ width: '320px', height: '180px' }}
            >
                <iframe
                    src="https://open.spotify.com/embed/playlist/6HwlzAzUZgpjLaQCWic1Rj?utm_source=generator&theme=0"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg"
                >
                </iframe>
            </div>
        </div>
    );
}
