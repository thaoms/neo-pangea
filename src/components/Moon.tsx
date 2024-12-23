import { useLoader, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface MoonProps {
    earthRef: React.RefObject<THREE.Group>;
    distance?: number;
    speed?: number;
}

export function Moon({ earthRef, distance = 3, speed = 0.000266 }: MoonProps) {
    const moonGroupRef = useRef<THREE.Group>(null);
    const moonMeshRef = useRef<THREE.Mesh>(null);

    const [moonMap, moonBump] = useLoader(THREE.TextureLoader, [
        '/textures/moonmap4k-min.jpg',
        '/textures/moonbump4k-min.jpg',
    ]);

    function configureTexture(texture: THREE.Texture) {
        texture.wrapS = THREE.RepeatWrapping; // Seamless horizontal wrapping
        texture.wrapT = THREE.ClampToEdgeWrapping; // Prevent vertical wrapping

        return texture;
    }

    configureTexture(moonMap);
    configureTexture(moonBump);

    const moonAngle = useRef(-0.8);
    const inclination = THREE.MathUtils.degToRad(5); // 5-degree orbital tilt
    const rotationTilt = THREE.MathUtils.degToRad(6.7); // Moon's axial tailt

    useFrame(() => {
        if (moonGroupRef.current && earthRef.current) {
            // Calculate Moon's orbital position
            moonAngle.current += speed;
            const x = earthRef.current.position.x + distance * Math.cos(moonAngle.current);
            const z = earthRef.current.position.z + distance * Math.sin(moonAngle.current);
            const y = distance * Math.sin(inclination) * Math.sin(moonAngle.current);

            moonGroupRef.current.position.set(x, y, z);
        }

        // Rotate the Moon on its own axis
        if (moonMeshRef.current) {
            moonMeshRef.current.rotation.y += speed + 0.0015;
        }
    });

    return (
        <group ref={moonGroupRef}>
            <mesh ref={moonMeshRef} rotation={[rotationTilt, 0, 0]} receiveShadow>
                <icosahedronGeometry args={[0.17, 12]} />
                <meshPhongMaterial
                    map={moonMap}
                    bumpMap={moonBump}
                    bumpScale={0.1}
                    color={0xffffff}
                    shininess={6}
                    specular={new THREE.Color(0.5, 0.5, 0.5)}
                    emissive="#444444"
                    emissiveIntensity={0.8}
                />
            </mesh>
        </group>
    );
}
