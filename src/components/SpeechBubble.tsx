import React, { useMemo, useState } from 'react';
import { Html } from '@react-three/drei';
import { latLonToVector3 } from '../utils/latLonToVector3';
import { GlowingBeam } from './GlowingBeam';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type Question = {
    text: string;
    lat?: number;
    lon?: number;
};

interface SpeechBubble3DProps {
    question: Question;
    markerRadius: number;
    earthGroupRef: React.RefObject<THREE.Group>; // Reference to the Earth group
    onClick: (question: Question) => void;
}

export function SpeechBubble3D({
    question,
    markerRadius,
    earthGroupRef,
    onClick,
}: SpeechBubble3DProps) {
    const position = useMemo(() => latLonToVector3(question.lat, question.lon, markerRadius), [question.lat, question.lon, markerRadius]);
    const normal = useMemo(() => position.clone().normalize(), [position]);
    const quaternion = useMemo(() => {
        const up = new THREE.Vector3(0, 1, 0);

        return new THREE.Quaternion().setFromUnitVectors(up, normal);
    }, [normal]);

    const tooltipOffset = 0.3;
    const [isVisible, setIsVisible] = useState(true);
    const [particles, setParticles] = useState<THREE.Points | null>(null);

    const createParticleEffect = (position: THREE.Vector3) => {
        const particleCount = 150;
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;

            // Faster outward velocity for a "hyperspace" effect
            velocities[i * 3] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const material = new THREE.PointsMaterial({
            color: 'white',
            size: 0.01,
            transparent: true,
            opacity: 1,
        });

        const particleSystem = new THREE.Points(geometry, material);
        setParticles(particleSystem);

        return particleSystem;
    };

    useFrame(() => {
        if (particles) {
            const positions = particles.geometry.attributes.position.array as Float32Array;
            const velocities = particles.geometry.attributes.velocity.array as Float32Array;

            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                velocities[i * 3] *= 0.98;
                velocities[i * 3 + 1] *= 0.98;
                velocities[i * 3 + 2] *= 0.98;
            }

            particles.geometry.attributes.position.needsUpdate = true;

            // Gradually fade out particles
            const material = particles.material as THREE.PointsMaterial;
            material.opacity -= 0.05;
            if (material.opacity <= 0) {
                setParticles(null); // Remove the particle system when done
            }
        }
    });

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
                <Html
                    position={[0, tooltipOffset, 0]}
                    distanceFactor={1}
                    zIndexRange={[20, 0]}
                >
                    <div
                        className="speech-bubble"
                        style={{ textAlign: 'center' }}
                        onClick={() => {
                            onClick(question);
                            const particleSystem = createParticleEffect(position);
                            if (particleSystem) {
                                earthGroupRef.current?.add(particleSystem);
                            }
                        }}
                    >
                        {question.text}
                    </div>
                </Html>
            )}
        </group>
    );
}
