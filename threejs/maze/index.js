import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { maze, mazeHash } from './maze.js';
RectAreaLightUniformsLib.init();

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 1.3, -0.75);
camera.lookAt(new THREE.Vector3(1,1,0));
const scene = new THREE.Scene();
const controls = new PointerLockControls(camera, document.body);

const loadManager = new THREE.LoadingManager()
const loader = new THREE.CubeTextureLoader(loadManager);
// const backgroundTexture = loader.load([
//     './resources/images/cubemaps/skyboxsun/px.jpg',
//     './resources/images/cubemaps/skyboxsun/nx.jpg',
//     './resources/images/cubemaps/skyboxsun/py.jpg',
//     './resources/images/cubemaps/skyboxsun/ny.jpg',
//     './resources/images/cubemaps/skyboxsun/pz.jpg',
//     './resources/images/cubemaps/skyboxsun/nz.jpg'
// ]);

// scene.background = backgroundTexture;

// const color = 0xFFFFFF;
// const intensity = 0.5;
// const light = new THREE.AmbientLight(color, intensity);
// scene.add(light);


// const sunLight = new THREE.DirectionalLight('#e5dfd5', 1);
// sunLight.position.set(-Math.sin(Math.PI/4), Math.sin(25*Math.PI/180), -Math.sin(Math.PI/4));
// scene.add(sunLight);

// scene.fog = new THREE.Fog(0xc2b69e, near, 30);
// const pmremGenerator = new THREE.PMREMGenerator(renderer);
// const pmrem = pmremGenerator.fromScene(scene);

const rectLight = new THREE.RectAreaLight('#ffffff', 0.8, 36, 22);
rectLight.rotation.x = Math.PI / 2;
rectLight.position.set(15.5,0,8.5);
scene.add(rectLight);
scene.add(new RectAreaLightHelper(rectLight));





const textureLoader = new THREE.TextureLoader(loadManager);


const playButton = document.getElementById('playButton');
loadManager.onLoad = () => {
    // // Create a plane geometry
    // const planeGeometry = new THREE.PlaneGeometry(60,60);
    // // Create a plane mesh with the geometry and material
    // const planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);
    // // Rotate the grid by 90 degrees
    // planeMesh.rotation.x = Math.PI / 2;
    // planeMesh.position.set(16,0,9);

    // scene.add(planeMesh);
}

const mazeMaterial = new THREE.MeshStandardMaterial({
    color: 0xbcbcbc,
    roughness: 0.1,
    metalness: 0
});
maze.forEach((row, rowNum) =>{
    for(const block of row){
        const bushGeometry = new THREE.BoxGeometry(block[1] - block[0], 0.6, 1);
        // const materials = [];
        // //px
        // materials.push(baseWallMaterial);
        // //nx
        // materials.push(baseWallMaterial);
        // //py
        // materials.push(null);
        // //ny
        // materials.push(null);
        // //pz
        // const diffuseMapClone = diffuseMap.clone();
        // diffuseMapClone.repeat.set(block[1] - block[0], 1);
        // // const roughMapClone = roughMap.clone();
        // // roughMapClone.repeat.set(block[1] - block[0], 1);
        // const normalMapClone = normalMap.clone();
        // normalMapClone.repeat.set(block[1] - block[0], 1);
        // // const dispMapClone = dispMap.clone();
        // // dispMapClone.repeat.set(block[1] - block[0], 1);
        // const clonedWallMaterial = new THREE.MeshStandardMaterial({
        //     map: diffuseMapClone,
        //     normalMap: normalMapClone,
        //     envMap: backgroundTexture,
        //     roughness: 1
        // })
        // materials.push(clonedWallMaterial);
        // //nz
        // materials.push(clonedWallMaterial);
        // diffuseMapClone.needsUpdate = true;
        // normalMapClone.needsUpdate = true;
        // const bushMaterial = new THREE.MeshStandardMaterial({
        //     map: diffuseMap,
        //     roughnessMap: roughMap
        // });
        const bushMesh = new THREE.Mesh(bushGeometry, mazeMaterial);
        const centerX = (block[0] + block[1])/2;
        const centerY = 0.3;
        const centerZ = rowNum + 0.5;
        bushMesh.position.set(centerX, centerY, centerZ);
        scene.add(bushMesh);
    }
})
// boundary
const planeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    color: 0xffffff,
    roughness: 1,
    metalness: 0
})
const roomGeometry = new THREE.BoxGeometry(35, 3.2, 21);
const entryMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    color: 0x20bc20,
    roughness: 0.1,
    metalness: 0
})
const exitMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    color: 0xbc2020,
    roughness: 0.1,
    metalness: 0
})
const materials = [
    exitMaterial, //px
    entryMaterial, //nx
    planeMaterial, //py
    null, //ny
    exitMaterial, //pz
    entryMaterial //nz
]

const room = new THREE.Mesh(roomGeometry, materials);
room.position.set(15.5, 1.5, 8.5);
scene.add(room);


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
        (-1.5 >= position.x || position.x >= 32.5) ||
        (-1.5 >= position.z || position.z >= 18.5)
    ){
        return true;
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