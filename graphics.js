class GamePort {
    constructor() {
        this.width = 400
        this.height = 300

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 1, 10000 )
        this.camera.position.z = 1000

        this.geometry = new THREE.BoxGeometry( 200, 200, 200 )
        this.material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } )

        this.mesh = new THREE.Mesh( this.geometry, this.material )
        this.scene.add( this.mesh )

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize( this.width, this.height )

        document.body.appendChild( this.renderer.domElement )
    }

    update(state) {
        this.mesh.position.x = state.x * 10
        this.mesh.position.y = state.y * 10
    }

    animate() {
        requestAnimationFrame( _ => this.animate() )

        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.02

        this.renderer.render( this.scene, this.camera )
    }
}

export default GamePort
