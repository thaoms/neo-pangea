import { useState, useEffect } from 'react';

export function About() {
    const [popupVisible, setPopupVisible] = useState(false);

    const togglePopup = () => {
        setPopupVisible(!popupVisible);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && popupVisible) {
                setPopupVisible(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [popupVisible]);

    return (
        <>
            <div
                id="popup-button"
                className="fixed bottom-20 left-5 w-12 h-12 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gradient-to-l transition bg-gradient-to-r from-blue-900/50 via-purple-800/40 to-pink-700/30"
                onClick={togglePopup}
            >
                <div className="text-white text-2xl font-bold">📖</div>
            </div>

            {popupVisible && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
                        onClick={togglePopup}
                    >
                    </div>

                    <div
                        id="popup-modal"
                        className="max-h-[400px] overflow-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl shadow-xl min-w-60 w-11/12 md:w-2/4 transition-transform transition-opacity duration-500 ease-in-out z-50 space-y-4"
                        style={{
                            background:
                                'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
                            backdropFilter: 'blur(15px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        <button
                            onClick={togglePopup}
                            style={{
                                background:
                                    'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
                            }}
                            className="absolute top-2 right-2 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-300"
                            aria-label="Close"
                        >
                            &#x2715;
                        </button>

                        <h2 className="text-white text-opacity-90 font-medium text-lg leading-6 transition-opacity duration-500">
                            Neo-Pangea
                        </h2>
                        <p className="text-white text-opacity-90 font-medium text-sm leading-6 transition-opacity duration-500">
                            Neo-Pangea is an experimental platform aiming to connect individuals through immersive,
                            interactive experiences powered by modern web technologies. It explores the fusion of art,
                            science, and technology, emphasizing creativity and collaboration.
                        </p>
                        <p className="text-white text-opacity-90 font-medium text-sm leading-6 transition-opacity duration-500">
                            The idea for this project came to me through the concept of the
                            {' '}
                            <strong>astronaut’s overview effect</strong>
                            —a transformative shift in perspective experienced when viewing Earth from space. It also stemmed from a difficult phase in my life that made me deeply reflect, question things, and seek to understand why things happen the way they do.
                        </p>
                        <h3 className="text-white text-opacity-90 font-medium text-md mt-4">
                            Tech Stack:
                        </h3>
                        <ul className="list-disc list-inside text-white text-opacity-90 font-medium text-sm">
                            <li>React 18</li>
                            <li>TypeScript</li>
                            <li>Three.js (@react-three/fiber, @react-three/drei)</li>
                            <li>Tailwind CSS</li>
                            <li>Vite</li>
                            <li>Express.js (API)</li>
                            <li>Helmet (Security)</li>
                            <li>OpenAI API Integration</li>
                        </ul>
                        <a
                            href="https://github.com/thaoms/neo-pangea"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline mt-4 block"
                        >
                            View on GitHub
                        </a>
                    </div>
                </>
            )}
        </>
    );
}
