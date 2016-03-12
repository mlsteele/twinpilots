var shipModel = null

function loadShipModel(callback) {
    var mtlLoader = new THREE.MTLLoader()
    var baseUrl = "wraith_model/"
    mtlLoader.setBaseUrl(baseUrl)
    mtlLoader.setPath(baseUrl)
    mtlLoader.load("Wraith_Raider_Starship.mtl", (materials) => {
	materials.preload()
	var objLoader = new THREE.OBJLoader()
	objLoader.setMaterials(materials)
	objLoader.setPath(baseUrl)
	objLoader.load("Wraith_Raider_Starship.obj", (object) => {
	    object.rotation.x = Math.PI/2
	    object.rotation.y = Math.PI/2
	    object.scale.x = 0.5
	    object.scale.y = 0.5
	    object.scale.z = 0.5
	    var group = new THREE.Object3D()
	    group.add(object)
	    shipModel = group
	    callback()
	},
	// Function called when downloads progress
	( xhr ) => console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ),
	// Function called when downloads error
	(xhr) => console.log("Error loading model.")
			)
    })
}

class Ship {
    constructor() {
	// this.geometry = new THREE.BoxGeometry( 200, 200, 200 )
	// this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
	// this.mesh = new THREE.Mesh( this.geometry, this.material )
	this.model = shipModel.clone()
    }

    update(state) {
	// Rotate
	// this.mesh.rotation.x += 0.01
	// this.mesh.rotation.y += 0.02
	this.model.rotation.x = 0
	this.model.rotation.y = 0
	this.model.rotation.z = 0
	this.model.eulerOrder = "ZYX"
	this.model.rotation.z = state.pos.heading

	// Visual tilt when thrusters on.
	this.model.rotation.x = state.vel.rotation * -10
	this.model.rotation.y = new THREE.Vector3(state.vel.x, state.vel.y, 0).length() * -0.005

	// Translate
	this.model.position.x = state.pos.x * 10
	this.model.position.y = state.pos.y * 10
    }

    addTo(scene) {
	scene.add(this.model)
    }
}

class GamePort {
    constructor() {
	this.width = 850
	this.height = 600

	this.scene = new THREE.Scene()

	this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 1, 10000 )
	this.camera.position.z = 1000

	this.ships = []
	this.addShip()
	this.addShip()

	this.renderer = new THREE.WebGLRenderer({antialias: true})
	this.renderer.setSize( this.width, this.height )

	document.body.appendChild( this.renderer.domElement )

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	this.scene.add( directionalLight );
    }

    addShip() {
	var ship = new Ship()
	this.ships.push(ship)
	ship.addTo(this.scene)
    }

    update(state) {
	for (var i = 0; i < state.ships.length; i++) {
	    this.ships[i].update(state.ships[i])
	}
    }

    animate() {
	requestAnimationFrame( _ => this.animate() )

	this.renderer.render( this.scene, this.camera )
    }
}

export {loadShipModel, GamePort}
