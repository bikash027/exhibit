import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(-100, 50, 100);
camera.lookAt(new THREE.Vector3(0,0,0));
const controls = new OrbitControls(camera, document.body);
controls.minDistance = 10;
controls.maxDistance = 800;
controls.maxPolarAngle = Math.PI / 2;
const scene = new THREE.Scene();

const START = -50;
const END = 50;
const HEIGHT = 25;

const positionNumComponents = 3;
const colorNumComponents = 3;
const plots = [];
const plotCount = 36;
for(let i=0; i<plotCount; i++){
    plots.push({
        geometry: new THREE.BufferGeometry(),
        positions: [],
        colors: []
    })
}

let current = START;
const baseColor = new THREE.Color('#fae6f7');
const topColor = new THREE.Color('#ff00d5');
while(current <= END){
    const angle = Math.PI * (current - START)/(END - START)
    plots.forEach((plot, ind)=>{
        let rotation = ind * (Math.PI/plotCount);
        if(ind%2 !== 0){
            rotation += Math.PI;
        }
        const x = Math.cos(rotation)*current;
        const z = Math.sin(rotation)*current;
        const y = Math.sin(rotation + angle)*HEIGHT;
        plot.positions.push(x, y, z);
        const alpha = Math.abs(y) / HEIGHT;
        const color = baseColor.clone().lerp(topColor, alpha);
        plot.colors.push(color.r, color.g, color.b);
    })
    current++;
}

const matLine = new THREE.LineBasicMaterial( {
    color: 0xffffff,
    vertexColors: true,
    alphaToCoverage: true,
} );
plots.forEach((plot) => {
    const positionAttribute = new THREE.BufferAttribute(new Float32Array(plot.positions), positionNumComponents);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    plot.geometry.setAttribute('position', positionAttribute);
    const colorAttribute = new THREE.BufferAttribute(new Float32Array(plot.colors), colorNumComponents);
    plot.geometry.setAttribute('color', colorAttribute);
    const mesh = new THREE.Line(plot.geometry, matLine);
    // mesh.computeLineDistances();
    // mesh.scale.set(1, 1, 1);
    scene.add(mesh);
})
let turn = 0;
const totalTurns = (plots[0].positions.length) / 3;
function render(time){
    if(turn <= totalTurns){
        plots.forEach((plot) => {
            plot.geometry.setDrawRange(0, turn);
            plot.geometry.attributes.position.needsUpdate = true;
        })
        turn++;
    } else {
        plots.forEach((plot) => {
            plot.geometry.rotateY(0.01);
        })
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
