export function ResponseField({ question, response, loading, onClose }: { question: string; response: string; loading: boolean; onClose: () => void }) {
    return (
        <div
            id="response-field"
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-3xl shadow-xl w-1/3 transition-opacity duration-500 text-wrap ease-in-out z-50 space-y-4 ${
                response || loading ? '' : 'hidden opacity-0'
            }`}
            style={{
                background: 'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            <button
                onClick={onClose}
                style={{
                    background: 'linear-gradient(to right, rgba(13, 42, 135, 0.5), rgba(88, 28, 135, 0.4), rgba(150, 20, 80, 0.3))',
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

            <h1 className="text-white text-opacity-90 font-medium text-lg leading-6 transition-opacity duration-500 text-wrap pr-5">{question}</h1>
            <pre
                id="response-text"
                className={`text-white text-opacity-90 font-medium text-sm leading-6 transition-opacity duration-500 text-wrap pr-5 ${
                    !loading && response ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {response}
            </pre>
        </div>
    );
}
