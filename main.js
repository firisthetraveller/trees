import * as THREE from 'three';

// Création de la scène
var scene = new THREE.Scene();
scene.background = new THREE.Color('lightblue');
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);

//Création des Lights
const aLight = new THREE.AmbientLight(0xFFFFFF, 3);
scene.add(aLight);

var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

//Création du sol (Ground)
var groundGeometry = new THREE.BoxGeometry(1,1,0.10);
const material = new THREE.MeshBasicMaterial( {color: 0x556B2F} ); 

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

const ground = new THREE.Mesh(groundGeometry,material);


scene.add(ground);

ground.position.z=-3;
ground.rotation.x=2;
ground.rotation.y=-3.2;
ground.rotation.z =3.5;

renderer.render(scene,camera);

