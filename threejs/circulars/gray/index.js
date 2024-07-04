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
camera.position.set(-300, 200, 300);
camera.lookAt(new THREE.Vector3(0,0,0));
const controls = new OrbitControls(camera, document.body);
controls.listenToKeyEvents( window );
controls.minDistance = 10;
controls.maxDistance = 800;
controls.maxPolarAngle = Math.PI / 2;
const scene = new THREE.Scene();


const gray = (decimal) => {
    return decimal ^ (Math.floor(decimal/2));
}
const toCartesian = ({radius, degree, center}) => {
    center.x = center.x?? 0;
    center.y = center.y?? 0;
    return {
        x: center.x + radius * Math.cos(degree * Math.PI / 180),
        y: center.y + radius * Math.sin(degree * Math.PI / 180)
    }
}
const START = -200;
const END = 200;
const STEPS = 64;
const stepSize = (END - START) / STEPS;
const speed = 1 / 4; // unit distance per ms
const grayCodes = [];
grayCodes.push({
    code: 0,
    currentTurn: 0,
    orientation: 'down',
});
for(let i=1; i<STEPS; i++){
    const nextCode = gray(i);
    const turns = (nextCode - grayCodes[i-1].code) / speed;
    const centerPos = stepSize * (grayCodes[i-1].code + nextCode)/2;
    const center = {
        x: START + centerPos,
        y: 0
    }
    const radius = stepSize * (nextCode - grayCodes[i-1].code)/2;
    grayCodes[i-1] = {
        ...grayCodes[i-1],
        turns: Math.floor(Math.abs(turns)),
        center,
        radius: Math.abs(radius),
        direction: nextCode > grayCodes[i-1].code? 'front': 'back'
    }
    grayCodes.push({
        code: nextCode,
        currentTurn: 0,
        orientation: i % 2 == 0? 'down': 'up'
    })
}




const positionNumComponents = 3;
const colorNumComponents = 3;
const plots = [];
const plotCount = 18;
for(let i=0; i<plotCount; i++){
    plots.push({
        geometry: new THREE.BufferGeometry(),
        positions: [],
        colors: []
    })
}

let currentArrIndex = 0, minHeight = 1000, maxHeight = -100;
while(currentArrIndex < STEPS - 1){
    const lastStep = grayCodes[currentArrIndex];
    const {currentTurn, turns, radius, center, direction, orientation} = lastStep;
    const progress = currentTurn / (turns == 0? 20: turns);
    let angle = progress*180;
    if(orientation == 'down' && direction == 'front'){
        angle = 180 + angle;
    } else if(orientation == 'down' && direction == 'back'){
        angle = 360 - angle;
    } else if(orientation == 'up' && direction == 'front'){
        angle = 180 - angle;
    }
    const point = toCartesian({
        radius,
        degree: angle,
        center,
    })
    plots.forEach((plot, ind)=>{
        let rotation = ind * (Math.PI/plotCount);
        if(ind%2 !== 0){
            rotation += Math.PI;
        }
        const x = Math.cos(rotation)*point.x;
        const z = Math.sin(rotation)*point.x;
        plot.positions.push(x, point.y, z);
    })
    if(point.y < minHeight){
        minHeight = point.y;
    }
    if(point.y > maxHeight){
        maxHeight = point.y;
    }
    lastStep.currentTurn++;
    if(lastStep.currentTurn >= turns){
        currentArrIndex++;
    }
}
const baseColor = new THREE.Color('#fae6f7');
const topColor = new THREE.Color('#ff00d5');
for(let i = 0, l = plots[0].positions.length; i<l; i += 3){
    const alpha = (plots[0].positions[i+1] - minHeight)/(maxHeight - minHeight);
    const color = baseColor.clone().lerp(topColor, alpha);
    plots.forEach((plot) => {
        plot.colors.push(color.r, color.g, color.b);
    })
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
    mesh.computeLineDistances();
    mesh.scale.set(1, 1, 1);
    scene.add(mesh);
})
let turn = 0;
const totalTurns = (plots[0].positions.length) / 3;
function render(){
    if(turn < totalTurns){
        plots.forEach((plot) => {
            plot.geometry.setDrawRange(0, turn);
            plot.geometry.attributes.position.needsUpdate = true;
        })
        turn++;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
