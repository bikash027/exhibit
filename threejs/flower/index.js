import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Flower } from './flower.js';

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({antialias: true, canvas, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(11, 2, 11);
camera.lookAt(new THREE.Vector3(0,0,0));
const controls = new OrbitControls(camera, document.body);
controls.listenToKeyEvents( window );
controls.minDistance = 0.5;
controls.maxDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
const scene = new THREE.Scene();
// scene.add(controls.getObject());


// Create a plane geometry
const planeGeometry = new THREE.PlaneGeometry(50,50);

// Create a blue material
const groundMaterial = new THREE.MeshBasicMaterial({
    color: '#ada083', // #d7cbb1
    side: THREE.DoubleSide
});

// Create a plane mesh with the geometry and material
const planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);
// Rotate the grid by 90 degrees
planeMesh.rotation.x = Math.PI / 2;
planeMesh.position.set(0,0,0);

// scene.add(planeMesh);

const sunLight = new THREE.DirectionalLight('#e5dfd5', 1);
sunLight.position.set(-Math.sin(Math.PI/4), Math.sin(25*Math.PI/180), -Math.sin(Math.PI/4));
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight('#ffffff', 2);
scene.add(ambientLight);


let flowers = [];
let spawnTimer = 0;
function render(time) {
    time *= 0.001;  // convert time to seconds
    flowers = flowers.filter(flower => !flower.isShed())
    flowers.forEach(flower => {
        flower.update(time);
    })
    if(spawnTimer == 0 && flowers.length < 20){
        console.log("here");
        const newFlower = new Flower({
            position: {
                x: Math.floor(10*Math.random() - 5) * 2,
                z: Math.floor(10*Math.random() - 5) * 2
            },
            color: Math.floor(Math.random() + 0.5) == 1? 'pink': 'white',
            spawnTime: time
        });
        newFlower.addToScene(scene);
        flowers.push(newFlower)
    }

    renderer.render(scene, camera);
    spawnTimer++;
    if(spawnTimer > 100) spawnTimer = 0;
    requestAnimationFrame(render);
}
requestAnimationFrame(render);