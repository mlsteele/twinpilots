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
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = child.material.clone()
                if (Math.random() > 0.5) {
                    child.material.color = new THREE.Color(0.8, 1, 1)
                } else {
                    child.material.color = new THREE.Color(0, 0.2, 1)
                }
            }
        })

        this.thrusters = []
        this.addThruster(new THREE.Vector3(-130, 45, 30), Math.PI)
        this.addThruster(new THREE.Vector3(-130, -45, 30), Math.PI)
    }

    addThruster(position, heading) {
        function vec1(x) { return new THREE.Vector3(x, x, x) }

        var particleGroup = new SPE.Group({
            maxParticleCount: 250000,
        })

        var powerGoal = 0
        var powerCurrent = 0

        var maxMainVel = 2000
        var particleEmitter = new SPE.Emitter({
            particleCount: 5000,
            maxAge: { value: .03, spread: .1 },
            position: {
                value: new THREE.Vector3(0, 0, 0),
                spread: vec1(20)
            },
            velocity: {
                value: new THREE.Vector3(maxMainVel, 0, 0),
                spread: new THREE.Vector3(1000, 500, 500)
            },
            acceleration: {
                value: new THREE.Vector3(0, 0, 0),
                spread: vec1(100)
            },
            drag: { value: 0.1 },
            wiggle: { value: 100 },
            color: {
                value: new THREE.Color(1, 1, 1),
            },
            opacity: { value: 0.01 },
            size: { value: 20 },
        });

        particleGroup.addEmitter(particleEmitter)
        particleGroup.mesh.rotation.set(0, 0, heading)
        particleGroup.mesh.position.copy(position)
        this.model.add(particleGroup.mesh)

        function set(power) {
            powerGoal = power
        }

        function tick(timedelta) {
            thruster.particleGroup.tick(timedelta)

            powerCurrent = powerGoal - (powerGoal - powerCurrent) * 0.85

            if (powerCurrent > 0.2) {
                particleEmitter.enable()
            } else {
                particleEmitter.disable()
            }

            particleEmitter.velocity.value = particleEmitter.velocity.value.setX(maxMainVel * powerCurrent)
        }

        var thruster = {particleGroup, particleEmitter, set, tick}
        this.thrusters.push(thruster)
        window.th = thruster
        return thruster
    }

    update(state, timedelta) {
        // Rotate
        // this.mesh.rotation.x += 0.01
        // this.mesh.rotation.y += 0.02
        this.model.rotation.x = 0
        this.model.rotation.y = 0
        this.model.rotation.z = 0
        this.model.rotation.order = "ZYX"
        this.model.rotation.z = state.pos.heading

        // Visual tilt when thrusters on.
        this.model.rotation.x = state.vel.rotation * -10
        // this.model.rotation.y = state.thrusters.forward * -0.5

        // Translate
        this.model.position.x = state.pos.x * 10
        this.model.position.y = state.pos.y * 10

        // Thrusters
        this.thrusters.forEach((thruster) => thruster.tick(timedelta))
        this.thrusters[0].set(state.thrusters.forward - state.thrusters.ccw * 0.5)
        this.thrusters[1].set(state.thrusters.forward - state.thrusters.cw  * 0.5)
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
        this.camera.position.z = 2000

        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setSize( this.width, this.height )
        document.body.appendChild( this.renderer.domElement )

        this.grid = new THREE.GridHelper(100000, 300)
        this.grid.setColors(0xff0000, 0x505050)
        this.grid.rotation.x = Math.PI/2
        this.grid.position.z = 0
        // this.grid.poisiton.z = 1
        this.scene.add(this.grid)

        this.clock = new THREE.Clock(true)

        this.ships = []
        this.addShip()
        this.addShip()

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
        var timedelta = this.clock.getDelta()

        var shipsForward = new THREE.Vector3(0, 0, 0)

        for (var i = 0; i < state.ships.length; i++) {
            this.ships[i].update(state.ships[i], timedelta)

            var forward = new THREE.Vector3(1, 0, 0).applyAxisAngle(
                new THREE.Vector3(0, 0, 1), state.ships[i].pos.heading)
            shipsForward.add(forward)
        }

        var shipsCenter = this.ships[0].model.position.clone().lerp(
            this.ships[1].model.position, 0.5)
        var shipsDiff = this.ships[0].model.position.clone().sub(
            this.ships[1].model.position)

        this.camera.position.copy(shipsCenter.clone().sub(shipsForward.clone().multiplyScalar(1000)))
        this.camera.position.z = shipsDiff.length() * 0.6 + 500

        this.camera.rotation.z = Math.atan2(shipsForward.y, shipsForward.x) - Math.PI/2
        this.camera.up.set(0, 0, 1);
        var camTarget = shipsCenter
        this.camera.lookAt(shipsCenter)
    }

    animate() {
        requestAnimationFrame( _ => this.animate() )
        this.renderer.render( this.scene, this.camera )
    }
}

export {loadShipModel, GamePort}
