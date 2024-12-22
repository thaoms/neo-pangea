import { useRef } from 'react';
import * as THREE from 'three';
import { getFresnelMat } from '../utils/getFresnelMat'; // Adjust the path as necessary

interface AtmosphereProps {
    markerRadius: number;
}

export function Atmosphere({ markerRadius }: AtmosphereProps) {
    const glowMeshRef = useRef<THREE.Mesh>(null);

    const fresnelMat = getFresnelMat({
        rimHex: 0x4fa3ff, // More realistic light blue for atmospheric glow
        facingHex: 0x002244, // Dark blue for subtle fade-out effect
    });

    return (
        <mesh ref={glowMeshRef} material={fresnelMat} scale={[1.01, 1.01, 1.01]}>
            <icosahedronGeometry
                args={[markerRadius, 12]}
            />
        </mesh>
    );
}
