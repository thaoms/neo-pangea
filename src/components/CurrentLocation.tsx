import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { latLonToVector3 } from '../utils/latLonToVector3';

interface CurrentLocationProps {
    markerRadius: number;
}

export function CurrentLocation({ markerRadius }: CurrentLocationProps) {
    const flagRef = useRef<THREE.Mesh>(null);
    const gltf = useLoader(GLTFLoader, '/models/flag.gltf');
    const [position, setPosition] = useState<THREE.Vector3 | null>(null);
    const [quaternion, setQuaternion] = useState<THREE.Quaternion | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                // Calculate the position of the marker
                const browserMarkerPosition = latLonToVector3(latitude, longitude, markerRadius);

                // Compute the normal vector at this position
                const normal = browserMarkerPosition.clone().normalize();
                const up = new THREE.Vector3(0, 1, 0); // Default "up" direction
                const calculatedQuaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);

                setPosition(browserMarkerPosition);
                setQuaternion(calculatedQuaternion);
            });
        }
    }, [markerRadius]);

    if (!position || !quaternion) return null;

    return (
        <primitive
            ref={flagRef}
            object={gltf.scene}
            position={position}
            quaternion={quaternion}
            scale={[0.02, 0.02, 0.02]}
        />
    );
}
