import Constants from "./constants.js"

class GameState {
    constructor(copystate) {
        if (copystate === undefined) {
            this.ships = []
            this.addShip()
            this.addShip()
            this.ships[1].pos.x = 1
        } else {
            Object.assign(this, copystate)
        }
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

    applyInput(inputstate) {
        this.ships[0].thrusters.forward = inputstate.left_forward
        this.ships[0].thrusters.ccw     = inputstate.left_left
        this.ships[0].thrusters.cw      = inputstate.left_right
        this.ships[1].thrusters.forward = inputstate.right_forward
        this.ships[1].thrusters.ccw     = inputstate.right_left
        this.ships[1].thrusters.cw      = inputstate.right_right
    }

    stepPhysics() {
        var timestep = 1000 / Constants.physicsRate

        for (let ship of this.ships) {
            // Directional thrust.
            var thrust_factor = .000006
            var thrust_x = Math.cos(ship.pos.heading) * ship.thrusters.forward * thrust_factor
            var thrust_y = Math.sin(ship.pos.heading) * ship.thrusters.forward * thrust_factor
            ship.vel.x += thrust_x * timestep
            ship.vel.y += thrust_y * timestep

            // Rotational thrust.
            var rotation_thrust_factor = 0.00006
            ship.vel.rotation += ship.thrusters.ccw * rotation_thrust_factor * timestep
            ship.vel.rotation -= ship.thrusters.cw  * rotation_thrust_factor * timestep

            // Integrate.
            ship.pos.x += ship.vel.x * timestep
            ship.pos.y += ship.vel.y * timestep
            ship.pos.heading += ship.vel.rotation

            // Dampening
            ship.vel.rotation *= Math.pow(.9985, timestep)
        }
    }
}

export default GameState
