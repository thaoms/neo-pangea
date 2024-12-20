import React, { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { latLonToVector3 } from '../utils/latLonToVector3';
import { GlowingBeam } from './GlowingBeam';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SpeechBubble3DProps {
    text: string;
    lat: number;
    lon: number;
    markerRadius: number;
    earthGroupRef: React.RefObject<THREE.Group>; // Reference to the Earth group
    onClick: (text: string) => void;
}

export function SpeechBubble3D({
    text,
    lat,
    lon,
    markerRadius,
    earthGroupRef,
    onClick,
}: SpeechBubble3DProps) {
    const position = useMemo(() => latLonToVector3(lat, lon, markerRadius), [lat, lon, markerRadius]);
    const normal = useMemo(() => position.clone().normalize(), [position]);
    const quaternion = useMemo(() => {
        const up = new THREE.Vector3(0, 1, 0); // Default "up" direction for the beam

        return new THREE.Quaternion().setFromUnitVectors(up, normal);
    }, [normal]);

    const tooltipOffset = 0.3;
    const [isVisible, setIsVisible] = useState(true);

    useFrame(({ camera }) => {
        if (!earthGroupRef.current) return;

        // Tooltip's world position
        const tooltipWorldPosition = position.clone().applyMatrix4(earthGroupRef.current.matrixWorld);

        // Vector from the Earth center to the tooltip
        const earthToTooltip = tooltipWorldPosition.sub(earthGroupRef.current.position).normalize();

        // Vector from the Earth center to the camera
        const earthToCamera = camera.position.clone().sub(earthGroupRef.current.position).normalize();

        // Check visibility based on the dot product
        const isFacingCamera = earthToTooltip.dot(earthToCamera) > 0;
        setIsVisible(isFacingCamera);
    });

    return (
        <group position={position.toArray()} quaternion={quaternion}>
            <GlowingBeam
                position={new THREE.Vector3(0, 0, 0)}
                height={0.6}
                radius={0.002}
                color="orange"
            />
            {isVisible && (
                <Html position={[0, tooltipOffset, 0]} distanceFactor={2} zIndexRange={[1, 0]}>
                    <div className="speech-bubble" style={{ textAlign: 'center' }} onClick={() => onClick(text)}>
                        {text}
                    </div>
                </Html>
            )}
        </group>
    );
}
