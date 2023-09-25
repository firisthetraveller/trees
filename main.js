import * as THREE from 'three';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);

var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

var cube= new THREE.BoxGeometry(1,1,0.10);
var material = new THREE.MeshBasicMaterial({color:0x8B4513});
var ground = new THREE.Mesh(cube,material);
scene.add(ground);

ground.position.z=-2;
ground.rotation.x=2;
ground.rotation.y=3;

renderer.render(scene,camera);

