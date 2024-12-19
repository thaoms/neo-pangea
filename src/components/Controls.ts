import { OrbitControls } from 'three/examples/jsm/Addons';

export function getControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
}
