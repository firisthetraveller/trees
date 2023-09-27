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

// L-System
class Rule {
	/**
	 * 
	 * @param {str} axiom 
	 * @param {dict(str, str)} rules
	 */
	constructor(axiom, rules) {
		this.axiom = axiom;
		this.rules = rules;
	}

	/**
	 * 
	 * @param {int} depth
	 * @param {string} s
	 * @returns {string} a string generated from the axiom and following the rules
	 */
	generate(depth, s = this.axiom) {
		if (depth == 0) {
			return s;
		}

		let nextString = '';
		for (let i = 0; i < s.length; i++) {
			nextString += this.rules[s.charAt(i)];
		}
		return this.generate(depth - 1, nextString);
	}
}

let basicRule = new Rule(
	'A',
	{ 'A': 'AABA', 'B': 'B', '[': '[', ']': ']' });

const offsetValue = 20;
const height = 1;

/**
 * 
 * @param {THREE.Object3D} tree
 * @param {THREE.Vector3} position the position of the base
 * @param {string} lstring generated from a rule
 * @returns a tree as a THREE.Object3D
 */
function createTree(tree, position, lstring, radius = 0.3, angle = 0) {
	if (lstring.length == 0) {
		return tree;
	}

	let geometry;
	let material;
	let mesh;
	let computedRadius;

	console.log(lstring);
	console.log('Position: ');
	console.log(position);

	switch (lstring.charAt(0)) {
	case '[':
		return createTree(tree, position, lstring.slice(1), radius, angle + offsetValue);
	case ']':
		return createTree(tree, position, lstring.slice(1), radius, angle);
	case 'A':
		console.log('Creating a trunk');
		computedRadius = Math.max(radius - 0.03, 0.1);
		geometry = new THREE.CylinderGeometry(computedRadius, radius, height, 20, 32);
		material = new THREE.MeshPhongMaterial({ color: 0xffaa00 });
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(position);
		tree.add(mesh);

		return createTree(tree, new THREE.Vector3(0, height, 0).add(position), lstring.slice(1), computedRadius, angle);
	case 'B':
		console.log('Creating a fruit');
		geometry = new THREE.SphereGeometry(0.2, 8, 20, 32);
		material = new THREE.MeshPhongMaterial({ color: 0xff00 });
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(position).add(new THREE.Vector3(radius - 0.1, 0, 0));
		tree.add(mesh);
		return createTree(tree, position, lstring.slice(1), radius, angle);
	}
}

tree = createTree(tree, new THREE.Vector3(0, 0, 0), basicRule.generate(3));
tree.position.set(0, -0.5, 0);
scene.add(tree);

// Create an animation loop
const animate = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
};

animate();