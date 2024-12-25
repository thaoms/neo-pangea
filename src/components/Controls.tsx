import { OrbitControls as DreiOrbitControls } from '@react-three/drei';

interface ControlsProps {
    minDistance?: number;
    maxDistance?: number;
}

export function Controls({ minDistance = 1.5, maxDistance = 9999 }: ControlsProps) {
    return <DreiOrbitControls minDistance={minDistance} maxDistance={maxDistance} enablePan={false} />;
}
