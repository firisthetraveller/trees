import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { Rule, Tree } from './modules/tree';

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
let tree = new Tree(
	new Rule(
		'A',
		{ 'A': 'AA[A]', 'B': 'B', '[': '[', ']': ']', '+': '+', '-': '-' }
		//{'A': 'AAB', 'B': 'B'}
	), 4);

// GUI
const gui = new GUI();

// Add a folder: it is a dropdown button
const cameraPositionFolder = gui.addFolder('Camera');

// It adds inside the folder a modifiable field
// Here it is the z coordinate of the camera.
// 
// Params:
// 1 - An object (camera.position).
// It needs to have different fields which is the case here (x, y, z).
// 2 - The field of the object given in -1-.
// It has to exist in the given object.
//
// For a slider, add two more values :
// 3 - min value
// 4 - max value
// 5 - optional: step (smallest increment possible), default: 0.1
cameraPositionFolder.add(camera.position, 'z', 0, 20);

// You can open the folder by default with: folderName.open();
// Ex: cameraPositionFolder.open();

const treeFolder = gui.addFolder('Tree');

// You can also add folders inside a folder.
const treeRotationFolder = treeFolder.addFolder('Rotation');
treeRotationFolder.add(tree.anchor.rotation, 'x', 0, Math.PI * 2);
treeRotationFolder.add(tree.anchor.rotation, 'y', 0, Math.PI * 2);
treeRotationFolder.add(tree.anchor.rotation, 'z', 0, Math.PI * 2);

tree.generate(2);
tree.anchor.position.set(0, -0.5, 0);
tree.anchor.rotation.set(0, 2, 0);
scene.add(tree.anchor);

camera.position.set(0, 0, 15);

// Create an animation loop
const animate = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();