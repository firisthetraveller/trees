import * as THREE from 'three';
import { GUI } from 'dat.gui';

// Création de la scène
var scene = new THREE.Scene();
scene.background = new THREE.Color('lightblue');

var camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

// Lights
let ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(ambientLight);

let pointLight = new THREE.PointLight(0xFFFF00, 5);
scene.add(pointLight);

// Scene
// Tree
let tree = new THREE.Object3D();

// Ground
var cube = new THREE.BoxGeometry(1, 1, 0.10);
var material = new THREE.MeshPhongMaterial({ color: 0x556B2F });
var ground = new THREE.Mesh(cube, material);
scene.add(ground);

ground.position.z = -2;
ground.rotation.x = 2;
ground.rotation.y = -3.2;
ground.rotation.z = 3.5;

// GUI
const gui = new GUI();
const cameraPositionFolder = gui.addFolder('Camera');
cameraPositionFolder.add(camera.position, 'z', 0, 20);

const treeFolder = gui.addFolder('Tree');
const treeRotationFolder = treeFolder.addFolder('Rotation');
treeRotationFolder.add(tree.rotation, 'x', 0, Math.PI * 2);
treeRotationFolder.add(tree.rotation, 'y', 0, Math.PI * 2);
treeRotationFolder.add(tree.rotation, 'z', 0, Math.PI * 2);

//Creation des textures
// const textureLoader = new THREE.TextureLoader();
// //Texture for the ground
// const textureGround = [
//     new THREE.MeshPhongMaterial({
//         map : textureLoader.load("textures/grass.png"),
//     }),
//     new THREE.MeshPhongMaterial({
//         map : textureLoader.load("../textures/grass.png"),
//     }),
//     new THREE.MeshPhongMaterial({
//         map : textureLoader.load("../textures/grass.png"),
//     }),
//     new THREE.MeshPhongMaterial({
//         map : textureLoader.load("../textures/grass.png"),
//     }),
//     new THREE.MeshPhongMaterial({
//         map : textureLoader.load("../textures/grass.png"),
//     }),
//     new THREE.MeshPhongMaterial({
//         map : textureLoader.load("../textures/grass.png"),
//     }),
// ];

renderer.render(scene,camera);
// Create an animation loop
const animate = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();