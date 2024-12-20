import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';

interface StarfieldProps {
    numStars?: number;
}

export function Starfield({ numStars = 500 }: StarfieldProps) {
    const starFieldRef = useRef<THREE.Points>(null);
    const starTexture = useLoader(THREE.TextureLoader, '/textures/stars/circle.png');

    useFrame(() => {
        if (starFieldRef.current) {
            starFieldRef.current.rotation.y -= 0.0001;
        }
    });

    // Generate star positions and colors
    const { vertices, colors } = useMemo(() => {
        const randomSpherePoint = () => {
            const radius = Math.random() * 25 + 25;
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            return {
                pos: new THREE.Vector3(x, y, z),
                hue: 0.6,
            };
        };

        const verts: number[] = [];
        const colors: number[] = [];

        for (let i = 0; i < numStars; i += 1) {
            const { pos, hue } = randomSpherePoint();
            const color = new THREE.Color().setHSL(hue, 0.2, Math.random());
            verts.push(pos.x, pos.y, pos.z);
            colors.push(color.r, color.g, color.b);
        }

        return { vertices: verts, colors };
    }, [numStars]);

    return (
        <points ref={starFieldRef}>
            <bufferGeometry>
                <bufferAttribute
                    args={[new Float32Array(vertices), 3]}
                    attach="attributes-position"
                    count={vertices.length / 3}
                />
                <bufferAttribute
                    args={[new Float32Array(colors), 3]}
                    attach="attributes-color"
                    array={new Float32Array(colors)}
                    count={colors.length / 3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.2}
                vertexColors
                transparent
                blending={THREE.AdditiveBlending}
                map={starTexture}
            />
        </points>
    );
}
