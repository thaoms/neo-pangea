import * as THREE from 'three';
import { useRef } from 'react';
import { Suspense } from 'react';
import { Earth } from './components/Earth';
import { Atmosphere } from './components/Atmosphere';
import { Clouds } from './components/Clouds';
import { SkyBox } from './components/SkyBox';
import { Controls } from './components/Controls';
import { Starfield } from './components/Starfield';
import { CurrentLocation } from './components/CurrentLocation';
import { useFrame } from '@react-three/fiber';
import { SpeechBubbles3D } from './components/SpeechBubbles';
import { Loader } from './components/Loader';
import './css/styles.css';

const markerRadius = 1.0;

export function Scene({ onClick }: { onClick: (text: string) => void }) {
    const earthGroupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (earthGroupRef.current) {
            earthGroupRef.current.rotation.y += 0.00058;
        }
    });

    return (
        <Suspense fallback={<Loader />}>
            <Controls maxDistance={10} />
            <Starfield numStars={2000} />
            <group ref={earthGroupRef} rotation={[THREE.MathUtils.degToRad(-23.4), 0, 0]}>
                <Suspense fallback={<Loader />}>
                    <Earth />
                    <Clouds markerRadius={markerRadius} />
                    <Atmosphere markerRadius={markerRadius} />
                    <SpeechBubbles3D markerRadius={markerRadius} onClick={onClick} earthGroupRef={earthGroupRef} />
                    <CurrentLocation markerRadius={markerRadius} />
                </Suspense>
            </group>
            <SkyBox />
        </Suspense>
    );
}
