import * as THREE from 'three';

/**
 * 
 * @param {float} a angle 
 * @param {float} b angle
 * @returns 
 * @todo apply angle a and b
 */
function generateFruitPosition(offset, a = 0.0, b = 0.0) {
	let position = Math.floor(5 * Math.random());
	const angle = 125.0;
	return new THREE.Vector3(offset, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle * position);
}

export class Rule {
	/**
	 * 
	 * @param {str} axiom 
	 * @param {Object} rules a dictionary mapping a symbol (str) to another (str).
	 * Example: {'A': 'AAB', 'B':'B'}
	 */
	constructor(axiom, rules) {
		this.axiom = axiom;
		this.rules = rules;
		this.currentDepth = 0;
	}

	/**
	 * 
	 * @param {int} depth
	 * @returns {string} a string generated from the axiom and following the rules
	 */
	generate(depth) {
		if (depth == 0) {
			return this.axiom;
		}

		let nextString = '';
		for (let i = 0; i < this.axiom.length; i++) {
			nextString += this.rules[this.axiom.charAt(i)];
		}
		this.axiom = nextString;
		return this.generate(depth - 1);
	}

	get () {
		return this.axiom;
	}
}

export class Tree {
	/**
	 * 
	 * @param {Rule} rule 
	 * @param {number} generations 
	 */
	constructor(rule, generations) {
		this.anchor = new THREE.Object3D();
		this.rule = rule;
		this.step = 1;
		this.generations = generations;
		this.settings = {
			branchOffsetValue: 20,
			ruleOffsetValue: 10,
			height: 1
		};
	}

	/**
	 *  
	 * @returns {THREE.Object3D} the anchor modified
	 */
	generate() {
		if (this.step == this.generations) {
			return this.anchor;
		}

		let pattern = this.rule.generate(this.generations);
		this.anchor = this.#createTree(new THREE.Vector3(), pattern);
		++this.step;
	}

	/**
	 * 
	 * @param {THREE.Vector3} position the position of the base
	 * @param {string} lstring generated from a rule
	 * @returns {THREE.Object3D} the anchor of the tree
	 */
	#createTree(position, lstring, radius = 0.3, angle = 0) {
		console.log(lstring);
		if (lstring.length == 0) {
			return this.anchor;
		}

		let geometry;
		let material;
		let mesh;
		let computedRadius;
		let group;

		switch (lstring.charAt(0)) {
		case '[':
			return this.#createTree(position.clone().add(new THREE.Vector3(- this.settings.height, 0, 0)), lstring.slice(1), radius, angle + this.settings.branchOffsetValue);
		case ']':
			return this.#createTree(position, lstring.slice(1), radius, angle);
		case '+':
			return this.#createTree(position, lstring.slice(1), radius, angle + this.settings.ruleOffsetValue);
		case '-':
			return this.#createTree(position, lstring.slice(1), radius, angle - this.settings.ruleOffsetValue);
		case 'A':
			console.log('Creating a trunk at ');
			console.log(position);
			computedRadius = Math.max(radius - 0.03, 0.1);
			geometry = new THREE.CylinderGeometry(computedRadius, radius, this.settings.height, 20, 32);
			material = new THREE.MeshPhongMaterial({ color: 0xffaa00 });
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.copy(new THREE.Vector3(0, this.settings.height / 2, 0));
			group = new THREE.Group();
			group.add(mesh);
			group.rotation.set(angle, 0, 0);
			group.position.add(position);
			this.anchor.add(group);

			return this.#createTree(
				new THREE.Vector3(0, this.settings.height, 0).applyAxisAngle(new THREE.Vector3(1, 0, 0), angle).add(position),
				lstring.slice(1), computedRadius, angle);
		case 'B':
			console.log('Creating a fruit at ');
			console.log(position);
			geometry = new THREE.SphereGeometry(0.2, 8, 20, 32);
			material = new THREE.MeshPhongMaterial({ color: 0xff00 });
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.copy(position).add(generateFruitPosition(radius));
			this.anchor.add(mesh);
			return this.#createTree(position, lstring.slice(1), radius, angle);
		}
	}
}