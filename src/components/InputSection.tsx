import { useState, useEffect } from 'react';
import { Question } from './SpeechBubble';

export function InputSection({ onSubmit }: { onSubmit: (question: Question) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [question, setQuestion] = useState('');

    const handleSubmit = () => {
        if (question.trim()) {
            onSubmit({ text: question.trim() });
            setQuestion('');
            setExpanded(false);
        }
    };

    const handleClose = () => {
        setExpanded(false);
        setQuestion('');
    };

    return (
        <div
            id="input-container"
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 ${
                expanded ? 'w-96 p-6 rounded-3xl' : 'w-16 h-16 rounded-full cursor-pointer hover:bg-gradient-to-l'
            } shadow-xl bg-gradient-to-r from-blue-900/30 via-purple-800/30 to-pink-700/30 backdrop-blur-lg z-50 transition-all duration-150 ease-in flex items-center justify-center select-none`}
            onClick={() => !expanded && setExpanded(true)}
        >
            {!expanded
                ? (
                        <div className="text-white text-2xl font-bold cursor-pointer">🙋</div>
                    )
                : (
                        <div className="w-full space-y-4 relative">
                            <button
                                onClick={handleClose}
                                style={{
                                    background:
                                        'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
                                }}
                                className="absolute -top-4 -right-4 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center shadow-lg transition-all duration-300"
                                aria-label="Close"
                            >
                                &#x2715;
                            </button>
                            <input
                                id="question"
                                type="text"
                                placeholder="What keeps your mind occupied?"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                className="w-full p-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-lg"
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                autoFocus
                            />
                            <button
                                id="askButton"
                                onClick={handleSubmit}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:from-pink-600 hover:to-purple-500 transition-all duration-300 ease-in-out hover:scale-105 focus:ring-4 focus:ring-purple-300"
                            >
                                Ask!
                            </button>
                        </div>
                    )}
        </div>
    );
}
