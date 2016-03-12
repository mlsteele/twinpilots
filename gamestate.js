class GameState {
    constructor() {
	this.ships = []
	this.addShip()
	this.addShip()
	this.ships[1].pos.x = 50
    }

    addShip() {
	var ship = {
	    pos: {
		x: 0,
		y: 0,
		// Yaw in radians.
		heading: Math.PI/2,
	    },
	    vel: {
		x: 0,
		y: 0,
		rotation: 0,
	    },
	    // Thrust is 0 or 1.
	    thrusters: {
		forward: 0, // 0 or 1.
		cw: 0, // 0 or 1.
		ccw: 0, // 0 or 1.
	    }
	}
	this.ships.push(ship)
    }

    stepPhysics() {
	var timestep = 1 / 100

	for (let ship of this.ships) {
	    var thrust_factor = 30
	    var thrust_x = Math.cos(ship.pos.heading) * ship.thrusters.forward * thrust_factor
	    var thrust_y = Math.sin(ship.pos.heading) * ship.thrusters.forward * thrust_factor
	    ship.vel.x += thrust_x * timestep
	    ship.vel.y += thrust_y * timestep

	    var rotation_thrust_factor = 0.01
	    ship.vel.rotation += ship.thrusters.ccw * rotation_thrust_factor * timestep
	    ship.vel.rotation -= ship.thrusters.cw  * rotation_thrust_factor * timestep

	    ship.pos.x += ship.vel.x * timestep
	    ship.pos.y += ship.vel.y * timestep
	    ship.pos.heading += ship.vel.rotation
	}
    }
}

export default GameState
