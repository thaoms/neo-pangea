import { RefObject } from 'react';
import { SpeechBubble3D } from './SpeechBubble';
import * as THREE from 'three';

interface SpeechBubbles3DProps {
    markerRadius: number;
    onClick: (text: string) => void;
    earthGroupRef: RefObject<THREE.Group>;
}

export function SpeechBubbles3D({ markerRadius, onClick, earthGroupRef }: SpeechBubbles3DProps) {
    const questions = [
        { text: 'Wat is de zin van het leven?', lat: 37.8, lon: -122.4 }, // San Francisco, VS
        { text: 'Waarom voelen we liefde?', lat: -23.5, lon: -46.6 }, // São Paulo, Brazilië
        { text: 'Wat maakt ons menselijk?', lat: 35.7, lon: 139.7 }, // Tokio, Japan
        { text: 'Hoe groot is het universum?', lat: 60.2, lon: 24.9 }, // Helsinki, Finland
        { text: 'Bestaat echte vriendschap?', lat: -33.9, lon: 151.2 }, // Sydney, Australië
        { text: 'Waarom dromen we?', lat: 40.4, lon: -3.7 }, // Madrid, Spanje
        { text: 'Waarom is er oorlog?', lat: 34.0, lon: -118.2 }, // Los Angeles, VS
        { text: 'Hebben grenzen nog een nut?', lat: 41.9, lon: 12.5 }, // Rome, Italië
        { text: 'Waarom bestaat ongelijkheid?', lat: -26.2, lon: 28.0 }, // Johannesburg, Zuid-Afrika
        { text: 'Waarom voelen we ons eenzaam?', lat: 19.4, lon: -99.1 }, // Mexico-Stad, Mexico
        { text: 'Kunnen mensen echt veranderen?', lat: 28.6, lon: 77.2 }, // New Delhi, India
        { text: 'Wat betekent het om vrij te zijn?', lat: 52.5, lon: 13.4 }, // Berlijn, Duitsland
        { text: 'Waarom vechten mensen om macht?', lat: 33.7, lon: -84.4 }, // Atlanta, VS
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
