import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
    distance?: number; // Distance of the Sun from the Earth
    speed?: number; // Speed of the Sun's movement
    onRefReady: (ref: THREE.Mesh | null) => void; // Callback for Sun's mesh reference
}

export function Sun({ distance = 30, speed = 0.0002, onRefReady }: SunProps) {
    const sunLightRef = useRef<THREE.DirectionalLight>(null);
    const sunSphereRef = useRef<THREE.Mesh>(null);
    const position = useRef(new THREE.Vector3(0, 0, 0));
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

            // Calculate the Sun's position in the scene
            const x = distance * Math.cos(sunAngle.current);
            const z = distance * Math.sin(sunAngle.current * 0.5);

            position.current.set(x, 0, z);

            // Update the Sun's light and sphere position
            sunLightRef.current.position.copy(position.current);
            sunSphereRef.current.position.copy(position.current);
        }
    });

    return (
        <>
            <directionalLight
                ref={sunLightRef}
                color={0xffffff}
                intensity={4} // Increased intensity for realism
            />
            <mesh ref={sunSphereRef}>
                <sphereGeometry args={[0.6, 64, 64]} />
                <meshStandardMaterial
                    emissive="#ffd27f" // Yellowish Sun color
                    emissiveIntensity={1} // Higher intensity for bright effect
                    color="#ffffff" // Base white color
                    toneMapped={true} // Prevent tone mapping to retain brightness
                />
            </mesh>
        </>
    );
}
