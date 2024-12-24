import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useIsMobile } from '../utils/useIsMobile';

export function SkyBox() {
    const skyBoxRef = useRef<THREE.Mesh>(null);

    const galaxyTexturePath = useIsMobile()
        ? '/textures/2k/milkywayskybox.jpg'
        : '/textures/milkywayskybox.png';

    const [galaxyTexture] = useLoader(THREE.TextureLoader, [galaxyTexturePath]);

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
