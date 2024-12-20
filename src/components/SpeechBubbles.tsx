import React, { RefObject } from 'react';
import { SpeechBubble3D } from './SpeechBubble';
import * as THREE from 'three';

interface SpeechBubbles3DProps {
    markerRadius: number;
    onClick: (text: string) => void;
    earthGroupRef: RefObject<THREE.Group>;
}

export function SpeechBubbles3D({ markerRadius, onClick, earthGroupRef }: SpeechBubbles3DProps) {
    const questions = [
        { text: 'Waarom bestaan we?', lat: 51.0, lon: 3.7 },
        { text: 'Hebben landsgrenzen nog een nut?', lat: 40.7, lon: -74.0 },
        { text: 'Hoe definiëren we identiteit?', lat: 35.7, lon: 139.7 },
        { text: 'Wat maakt ons menselijk?', lat: -33.9, lon: 151.2 },
        { text: 'Waarom bestaat oorlog?', lat: -23.5, lon: -46.6 },
    ];

    return (
        <>
            {questions.map(({ text, lat, lon }, index) => (
                <SpeechBubble3D
                    key={index}
                    text={text}
                    lat={lat}
                    lon={lon}
                    markerRadius={markerRadius}
                    onClick={onClick}
                    earthGroupRef={earthGroupRef}
                />
            ))}
        </>
    );
}
