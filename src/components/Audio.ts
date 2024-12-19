import * as THREE from 'three';

export function getAudio(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Create a global audio source
    const backgroundAudio = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./audio/ambient-space-noise-55472.mp3', (buffer) => {
        backgroundAudio.setBuffer(buffer);
        backgroundAudio.setLoop(true);
        backgroundAudio.setVolume(0.5);
    });

    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');

    audioToggle?.addEventListener('click', () => {
        if (backgroundAudio.isPlaying) {
            backgroundAudio.pause();
            audioIcon!.textContent = '🔈';
        }
        else {
            // Resume AudioContext if needed
            if (listener.context.state === 'suspended') {
                listener.context.resume();
            }
            backgroundAudio.play();
            audioIcon!.textContent = '🔊';
        }
    });
}
