import * as THREE from 'three';
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';

export function SkyBox() {
    const skyBoxRef = useRef<THREE.Mesh>(null);

    const [galaxyTexture] = useLoader(THREE.TextureLoader, [
        '/textures/milkywayskybox.png',
    ]);

    useFrame(() => {
        if (skyBoxRef.current) {
            skyBoxRef.current.rotation.y -= 0.00002;
        }
    });

    return (
        <mesh ref={skyBoxRef}>
            <sphereGeometry args={[100, 32, 32]} />
            <meshBasicMaterial
                map={galaxyTexture}
                side={THREE.BackSide}
            />
        </mesh>
    );
}
