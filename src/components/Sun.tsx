import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SunProps {
    distance?: number; // Distance of the Sun from the Earth
    speed?: number; // Speed of the Sun's movement
}

export function Sun({ distance = 10, speed = 0.0002 }: SunProps) {
    const sunLightRef = useRef<THREE.DirectionalLight>(null);
    const sunAngle = useRef(0);

    // Update Sunlight position dynamically
    useFrame(() => {
        if (sunLightRef.current) {
            sunAngle.current += speed;
            sunLightRef.current.position.set(
                distance * Math.cos(sunAngle.current),
                0,
                distance * Math.sin(sunAngle.current * 0.5),
            );
        }
    });

    return (
        <directionalLight
            ref={sunLightRef}
            color={0xffffff}
            intensity={3}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
        />
    );
}
