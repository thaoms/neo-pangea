import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
    distance?: number; // Distance of the Sun from the Earth
    speed?: number; // Speed of the Sun's movement
    onRefReady: (ref: THREE.Mesh | null) => void;
}

export function Sun({ distance = 30, speed = 0.0002, onRefReady }: SunProps) {
    const sunLightRef = useRef<THREE.DirectionalLight>(null);
    const sunSphereRef = useRef<THREE.Mesh>(null);

    const sunAngle = useRef(0);

    useEffect(() => {
        if (sunSphereRef.current) {
            onRefReady(sunSphereRef.current);
        }
    }, [onRefReady]);

    // Update Sunlight position dynamically
    useFrame(() => {
        if (sunLightRef.current && sunSphereRef.current) {
            sunAngle.current += speed;

            const x = distance * Math.cos(sunAngle.current);
            const z = distance * Math.sin(sunAngle.current * 0.5);

            sunLightRef.current.position.set(x, 0, z);
            sunSphereRef.current.position.set(x, 0, z);
        }
    });

    return (
        <>
            <directionalLight
                ref={sunLightRef}
                color={0xffffff}
                intensity={4} // Increased intensity for realism
                castShadow
                shadow-mapSize-width={2048} // Higher shadow resolution
                shadow-mapSize-height={2048}
            />
            <mesh ref={sunSphereRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    emissive="#ffd27f" // Yellowish Sun color
                    emissiveIntensity={0.4} // Higher intensity for bright effect
                    color="#ffffff" // Base white color
                    toneMapped={true} // Prevent tone mapping to retain brightness
                />
            </mesh>
        </>
    );
}
