import { Html } from '@react-three/drei';

export function Loader() {
    return (
        <Html center>
            <div
                id="spinner"
                className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto"
            >
            </div>
        </Html>
    );
}
