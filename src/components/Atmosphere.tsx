import { useRef } from 'react';
import * as THREE from 'three';
import { getAtmosphereGlowMaterial } from '../utils/getAtmosphereGlowMaterial';

interface AtmosphereProps {
    markerRadius: number;
}

export function Atmosphere({ markerRadius }: AtmosphereProps) {
    const glowMeshRef = useRef<THREE.Mesh>(null);

    const fresnelMat = getAtmosphereGlowMaterial();

    return (
        <mesh ref={glowMeshRef} material={fresnelMat} scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry
                args={[markerRadius, 20]}
            />
        </mesh>
    );
}
