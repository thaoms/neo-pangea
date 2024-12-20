import * as THREE from 'three';
import React, { RefObject, Suspense } from 'react';
import { Earth } from './components/Earth';
import { Atmosphere } from './components/Atmosphere';
import { Clouds } from './components/Clouds';
import { SkyBox } from './components/SkyBox';
import { Sun } from './components/Sun';
import './css/styles.css';
import { Controls } from './components/Controls';
import { useRef } from 'react';
import { Starfield } from './components/Starfield';
import { CurrentLocation } from './components/CurrentLocation';
import { useFrame } from '@react-three/fiber';
import { SpeechBubbles3D } from './components/SpeechBubbles';
import { Loader } from './components/Loader';

const markerRadius = 1.0;

export function Scene({ onClick }: { onClick: (text: string) => void }) {
    const earthGroupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (earthGroupRef.current) {
            earthGroupRef.current.rotation.y += 0.00058;
        }
    });

    return (
        <>
            <Controls />
            <group ref={earthGroupRef} rotation={[THREE.MathUtils.degToRad(-23.4), 0, 0]}>
                <Suspense fallback={<Loader />}>
                    <Earth />
                    <Clouds markerRadius={markerRadius} />
                    <Atmosphere markerRadius={markerRadius} />
                    <SpeechBubbles3D markerRadius={markerRadius} onClick={onClick} earthGroupRef={earthGroupRef as RefObject<THREE.Group>} />
                    <CurrentLocation markerRadius={markerRadius} />
                </Suspense>
            </group>
            <Sun />
            <SkyBox />
            <Starfield numStars={2000} />
        </>
    );
}
