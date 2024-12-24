import React from 'react';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-90 text-white p-4 z-50">
            <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
            <p className="text-lg mb-6">{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors"
            >
                Reload Page
            </button>
        </div>
    );
};

export { ErrorFallback };
