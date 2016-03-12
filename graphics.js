class Ship {
    constructor() {
        this.geometry = new THREE.BoxGeometry( 200, 200, 200 )
        this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )
        this.mesh = new THREE.Mesh( this.geometry, this.material )
    }

    update(state) {
        // Rotate
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.02

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
        this.width = 400
        this.height = 300

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 1, 10000 )
        this.camera.position.z = 1000

        this.ships = []
        this.addShip()
        this.addShip()

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize( this.width, this.height )

        document.body.appendChild( this.renderer.domElement )
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
