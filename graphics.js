class Ship {
    constructor() {
	this.geometry = new THREE.BoxGeometry( 200, 200, 200 )
	this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
	this.mesh = new THREE.Mesh( this.geometry, this.material )
    }

    update(state) {
	// Rotate
	// this.mesh.rotation.x += 0.01
	// this.mesh.rotation.y += 0.02
	this.mesh.rotation.z = state.pos.heading

	// Translate
	this.mesh.position.x = state.pos.x * 10
	this.mesh.position.y = state.pos.y * 10
    }

    addTo(scene) {
	scene.add(this.mesh)
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

	this.renderer = new THREE.WebGLRenderer()
	this.renderer.setSize( this.width, this.height )

	document.body.appendChild( this.renderer.domElement )

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	this.scene.add( directionalLight );

	// instantiate a loader
	var loader = new THREE.OBJLoader();

	// load an obj / mtl resource pair
	loader.load(
	    // OBJ resource URL
	    'wraith_model/Wraith_Raider_Starship.obj',
	    // Function when both resources are loaded
	    ( object ) => {
		object.rotation.x = Math.PI/2
		object.rotation.y = Math.PI
		object.scale.x = 0.5
		object.scale.y = 0.5
		object.scale.z = 0.5
		this.scene.add( object )
	    },
	    // Function called when downloads progress
	    ( xhr ) => console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ),
	    // Function called when downloads error
	    (xhr) => console.log("Error loading model.")
	)
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

export default GamePort
