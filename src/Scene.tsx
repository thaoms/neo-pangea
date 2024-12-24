import * as THREE from 'three';
import { useRef } from 'react';
import { Suspense } from 'react';
import { Earth } from './components/Earth';
import { SkyBox } from './components/SkyBox';
import { Controls } from './components/Controls';
import { Starfield } from './components/Starfield';
import { Loader } from './components/Loader';
import './css/styles.css';
import { Moon } from './components/Moon';
import { Question } from './components/SpeechBubble';
import { Effects } from './components/Effects';

export function Scene({ onClick }: { onClick: (question: Question) => void }) {
    const earthGroupRef = useRef<THREE.Group>(null);

    return (
        <>
            <Controls maxDistance={5} />
            <Suspense fallback={<Loader />}>
                <Starfield numStars={2000} />
                <group ref={earthGroupRef} rotation={[THREE.MathUtils.degToRad(-23.4), 0, 0]}>
                    <Earth onClick={onClick} />
                </group>
                <Moon earthRef={earthGroupRef} />
                <SkyBox />
                <Effects />
            </Suspense>
        </>
    );
}
