import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlowingBeamProps {
    position: THREE.Vector3;
    height?: number;
    radius?: number;
    color?: string; // Base color for the beam
    intensity?: number; // Intensity for the light
    onClick?: () => void;
}

export function GlowingBeam({
    position,
    height = 1,
    radius = 0.0001,
    color = 'gold',
    intensity = 6,
    onClick,
}: GlowingBeamProps) {
    const beamRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    const beamShader = useMemo(() => ({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(color) },
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;

            void main() {
                // Add a gradient for the beam
                vec3 gradientColor = mix(vec3(1.0, 0.84, 0.0), vec3(1.0, 0.4, 0.1), vUv.y); // Bright yellow to warm orange

                // Tapering effect to make the beam narrower toward the top
                float taper = smoothstep(0.0, 0.8, vUv.y); // Adjust the smoothstep values for taper strength

                // Fading effect to reduce brightness towards the top
                float fade = 1.0 - pow(vUv.y, 1.7); // Exponential falloff toward the top

                // Add radial falloff to simulate scattering near the center of the beam
                float radialFalloff = 1.0 - smoothstep(0.0, 0.5, length(vUv - 0.5)); // Radial gradient from the center

                // Combine all intensity effects
                float intensity = taper * fade * radialFalloff * 2.0;

                // Add pulsation effect for a dynamic beam
                intensity += sin(time * 2.0) * 0.3; // Pulsates between 0.7 and 1.3

                // Introduce soft edges at the top and bottom
                float edgeSoftness = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);

                // Final color with all effects combined
                gl_FragColor = vec4(gradientColor * intensity * edgeSoftness, intensity * taper);
            }
        `,
    }), [color]);

    useFrame(({ clock }) => {
        if (beamRef.current) {
            beamRef.current.material.uniforms.time.value = clock.getElapsedTime();
        }
        if (lightRef.current) {
            lightRef.current.intensity = intensity + Math.sin(clock.getElapsedTime() * 4) * 0.5; // Pulsate light
        }
    });

    return (
        <group>
            {/* Glowing Beam */}
            <mesh ref={beamRef} position={position.toArray()} onClick={onClick}>
                <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
                <shaderMaterial
                    args={[beamShader]}
                    transparent
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Light Source */}
            <pointLight
                ref={lightRef}
                position={position.toArray()}
                color={color}
                intensity={intensity}
                distance={10} // Increase distance for a larger effect
                decay={0}
            />
        </group>
    );
}
