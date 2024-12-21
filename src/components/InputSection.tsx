import { useState } from 'react';

export function InputSection({ onSubmit }: { onSubmit: (question: string) => void }) {
    const [question, setQuestion] = useState('');

    const handleSubmit = () => {
        if (question.trim()) {
            onSubmit(question.trim());
            setQuestion('');
        }
    };

    return (
        <div
            id="input-container"
            className="fixed top-3/4 -translate-x-1/2 left-1/2 p-6 rounded-3xl shadow-xl w-96 bg-gradient-to-r from-blue-900/50 via-purple-800/40 to-pink-700/30 backdrop-blur-lg space-y-4 z-50"
        >
            <input
                id="question"
                type="text"
                placeholder="Waar zit je mee?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="w-full p-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-pink-500 shadow-lg"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />

            <button
                id="askButton"
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-lg hover:from-pink-600 hover:to-purple-500 transition-all duration-300 ease-in-out hover:scale-105 focus:ring-4 focus:ring-purple-300"
            >
                Vraag het mij!
            </button>
        </div>
    );
}
