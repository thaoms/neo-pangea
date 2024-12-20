import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

interface CloudsProps {
    markerRadius: number;
}

export function Clouds({ markerRadius }: CloudsProps) {
    const cloudsRef = useRef<THREE.Mesh>(null);
    const cloudTexture = useLoader(THREE.TextureLoader, '/textures/8081_earthcloudmaptrans.jpg');

    useFrame(() => {
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.00006;
        }
    });

    return (
        <mesh
            scale={[1.003, 1.003, 1.003]}
            ref={cloudsRef}
        >
            <icosahedronGeometry
                args={[markerRadius, 50]}
            />
            <meshStandardMaterial
                map={cloudTexture}
                transparent={true}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                alphaMap={cloudTexture}
            />
        </mesh>
    );
}
