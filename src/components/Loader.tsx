import { Html, useProgress } from '@react-three/drei';

export function Loader() {
    const { loaded } = useProgress();

    return (
        <Html center>
            <div
                id="spinner"
                className={`w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto ${
                    loaded ? '' : 'hidden'
                }`}
            >
            </div>
        </Html>
    );
}
