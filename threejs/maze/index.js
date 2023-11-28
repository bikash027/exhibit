import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
// import px from './resources/images/cubemaps/skyboxsun/px.jpg';
// import nx from './resources/images/cubemaps/skyboxsun/nx.jpg';
// import py from './resources/images/cubemaps/skyboxsun/py.jpg';
// import ny from './resources/images/cubemaps/skyboxsun/ny.jpg';
// import pz from './resources/images/cubemaps/skyboxsun/pz.jpg';
// import nz from './resources/images/cubemaps/skyboxsun/nz.jpg';
import { maze, mazeHash } from './maze.js';
// console.log(Object.keys(px));

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

const fov = 75;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0.3, -0.75);
camera.lookAt(new THREE.Vector3(1,0.1,0));

const scene = new THREE.Scene();

const controls = new PointerLockControls(camera, document.body);


// Create a plane geometry
const planeGeometry = new THREE.PlaneGeometry(34,20);

// Create a blue material
const groundMaterial = new THREE.MeshPhongMaterial({
    color: '#ada083', // #d7cbb1
    side: THREE.DoubleSide
});

// Create a plane mesh with the geometry and material
const planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);
// Rotate the grid by 90 degrees
planeMesh.rotation.x = Math.PI / 2;
planeMesh.position.set(16,0,9);

scene.add(planeMesh);

maze.forEach((row, rowNum) =>{
    for(const block of row){
        const bushGeometry = new THREE.BoxGeometry(block[1] - block[0], 0.6, 1);
        const bushMaterial = new THREE.MeshPhongMaterial({
            color: '#00ff00',
            side: THREE.FrontSide
        });
        const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial);
        const centerX = (block[0] + block[1])/2;
        const centerY = 0.3;
        const centerZ = rowNum + 0.5;
        bushMesh.position.set(centerX, centerY, centerZ);
        scene.add(bushMesh);
    }
})


const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

const sunLight = new THREE.DirectionalLight('#e5dfd5', 1);
sunLight.position.set(-Math.sin(Math.PI/4), Math.sin(25*Math.PI/180), -Math.sin(Math.PI/4));
scene.add(sunLight);


const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    './resources/images/cubemaps/skyboxsun/px.jpg',
    './resources/images/cubemaps/skyboxsun/nx.jpg',
    './resources/images/cubemaps/skyboxsun/py.jpg',
    './resources/images/cubemaps/skyboxsun/ny.jpg',
    './resources/images/cubemaps/skyboxsun/pz.jpg',
    './resources/images/cubemaps/skyboxsun/nz.jpg'
]);
scene.background = texture;



const playButton = document.getElementById('playButton');
playButton.addEventListener('click', () => {
    controls.lock();
})

controls.addEventListener('lock', () => {
    playButton.parentElement.style.display = 'none';
});
controls.addEventListener('unlock', () => {
    playButton.parentElement.style.display = 'flex';
})
scene.add(controls.getObject());

// Keyboard controls
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const onKeyDown = function (event) {
    switch (event.keyCode) {
        case 38: // up arrow
        case 87: // W key
            moveForward = true;
            break;
        case 37: // left arrow
        case 65: // A key
            moveLeft = true;
            break;
        case 40: // down arrow
        case 83: // S key
            moveBackward = true;
            break;
        case 39: // right arrow
        case 68: // D key
            moveRight = true;
            break;
    }
};

const onKeyUp = function (event) {
    switch (event.keyCode) {
        case 38: // up arrow
        case 87: // W key
            moveForward = false;
            break;
        case 37: // left arrow
        case 65: // A key
            moveLeft = false;
            break;
        case 40: // down arrow
        case 83: // S key
            moveBackward = false;
            break;
        case 39: // right arrow
        case 68: // D key
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

const checkCollision = (position) => {
    if(
        !(0 <= position.x && position.x < 31) ||
        !(0 <= position.z && position.z < 17)
    ){
        return false;
    }
    const deltaArr = [-0.12, 0, 0.12];
    const possibilities = [];
    for(const deltaZ of deltaArr){
        for(const deltaX of deltaArr){
            possibilities.push({x: position.x + deltaX, z: position.z + deltaZ})
        }
    }
    for(const pos of possibilities){
        if(mazeHash[Math.floor(pos.z)]?.[Math.floor(pos.x)])
            return true;
    }
    return false;
}

function render(time) {
    time *= 0.001;  // convert time to seconds
   
    if (controls.isLocked) {
        const delta = 0.03;

        if (moveForward) {
            controls.moveForward(delta);
            if (checkCollision(controls.getObject().position)) {
                controls.moveForward(-delta); // Move back to the previous position
            }
        }

        if (moveBackward) {
            controls.moveForward(-delta);
            if (checkCollision(controls.getObject().position)) {
                controls.moveForward(delta); // Move back to the previous position
            }
        }

        if (moveLeft) {
            controls.moveRight(-delta);
            if (checkCollision(controls.getObject().position)) {
                controls.moveRight(delta); // Move back to the previous position
            }
        }

        if (moveRight) {
            controls.moveRight(delta);
            if (checkCollision(controls.getObject().position)) {
                controls.moveRight(-delta); // Move back to the previous position
            }
        }
    }
    renderer.render(scene, camera);
   
    requestAnimationFrame(render);
}
requestAnimationFrame(render);