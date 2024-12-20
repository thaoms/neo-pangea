import React, { useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export function Earth() {
    const earthGroupRef = useRef<THREE.Group>(null);

    const [earthMap, earthSpec, earthBump, earthLights] = useLoader(THREE.TextureLoader, [
        '/textures/8081_earthmap10k.jpg',
        '/textures/8081_earthspec10k.jpg',
        '/textures/8081_earthbump10k.jpg',
        '/textures/8081_earthlights10k.jpg',
    ]);

    function configureTexture(texture: THREE.Texture) {
        texture.offset.set(0.5, 0); // Offset for longitude alignment (center on 0°)
        texture.wrapS = THREE.RepeatWrapping; // Seamless horizontal wrapping
        texture.wrapT = THREE.ClampToEdgeWrapping; // Prevent vertical wrapping

        return texture;
    }

    configureTexture(earthMap);
    configureTexture(earthSpec);
    configureTexture(earthBump);
    configureTexture(earthLights);

    return (
        <group ref={earthGroupRef}>
            <mesh>
                <icosahedronGeometry
                    args={[1, 50]}
                />
                <meshPhongMaterial
                    map={earthMap}
                    specularMap={earthSpec}
                    bumpMap={earthBump}
                    bumpScale={1}
                />
            </mesh>
            <mesh>
                <icosahedronGeometry
                    args={[1, 50]}
                />
                <meshBasicMaterial
                    map={earthLights}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <hemisphereLight color={0x87ceeb} groundColor={0x222222} intensity={0.6} />
        </group>
    );
}
