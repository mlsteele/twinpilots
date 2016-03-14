import Constants from "./constants.js"
import uuid from "./uuid.js"

function seconds_to_steps(seconds) {
    return seconds * Constants.physicsRate
}

class GameState {
    constructor(copystate) {
        if (copystate === undefined) {
            this.id = uuid.v4()
            this.step = 0
            this.players = {}
            this.ships = []
            this.lasers = []
        } else {
            Object.assign(this, copystate)
        }
    }

    addPlayer({playerId, seq}) {
        this.players[playerId] = {
            // Whether the attack button is down.
            attack: false,
            // Step of last laser fire.
            lastLaser: -1000,
        }

        var left = this.addShip({playerId, hand: "left"})
        var right = this.addShip({playerId, hand: "right"})
        right.pos.x += 2

        left.pos.y += 2 * seq
        left.pos.heading += Math.PI * (seq - 1)
        right.pos.y += 2 * seq
        right.pos.heading += Math.PI * (seq - 1)
    }

    addShip({playerId, hand}) {
        var ship = {
            id: uuid.v4(),
            hand: hand,
            playerId: playerId,
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
        return ship
    }

    addLaser({playerId, pos: {x, y, heading}}) {
        var laser = {
            pos: {x, y, heading},
            id: uuid.v4(),
            playerId: playerId,
            birthday: this.step,
        }
        this.lasers.push(laser)
        return laser
    }

    addLaserFromShip(ship) {
        this.addLaser({
            playerId: ship.playerId,
            pos: {
                x: ship.pos.x,
                y: ship.pos.y,
                heading: ship.pos.heading,
            }
        })
    }

    applyInput(playerId, inputstate) {
        var left  = this.findPlayerShip(playerId, "left")
        var right = this.findPlayerShip(playerId, "right")
        left.thrusters.forward  = inputstate.left_forward
        left.thrusters.ccw      = inputstate.left_left
        left.thrusters.cw       = inputstate.left_right
        right.thrusters.forward = inputstate.right_forward
        right.thrusters.ccw     = inputstate.right_left
        right.thrusters.cw      = inputstate.right_right
        this.players[playerId].attack = inputstate.attack
    }

    findPlayerShip(playerId, hand) {
        for (var ship of this.ships) {
            if (ship.playerId === playerId && ship.hand === hand) {
                return ship
            }
        }
        throw new Error("Could not find ship!", playerId, hand)
    }

    stepState() {
        var timestep = 1000 / Constants.physicsRate
        this.step += 1

        this.stepPhysics(timestep)

        // Kill old lasers.
        this.lasers = this.lasers.filter((laser) => {
            var age = this.step - laser.birthday
            return age < seconds_to_steps(Constants.laserLifetime)
        })

        // Fire control.
        for (var playerId in this.players) {
            var playerState = this.players[playerId]
            var canFireLaser = this.step - playerState.lastLaser > seconds_to_steps(Constants.laserCooldown)
            if (playerState.attack && canFireLaser) {
                playerState.lastLaser = this.step
                console.log("LASER")
                this.addLaserFromShip(this.findPlayerShip(playerId, "left"))
                this.addLaserFromShip(this.findPlayerShip(playerId, "right"))
            }
        }
    }

    stepPhysics(timestep) {
        for (let ship of this.ships) {
            // Directional thrust.
            var thrust_factor = .000008
            var thrust_x = Math.cos(ship.pos.heading) * ship.thrusters.forward * thrust_factor
            var thrust_y = Math.sin(ship.pos.heading) * ship.thrusters.forward * thrust_factor
            ship.vel.x += thrust_x * timestep
            ship.vel.y += thrust_y * timestep

            // Rotational thrust.
            var rotation_thrust_factor = 0.00007
            ship.vel.rotation += ship.thrusters.ccw * rotation_thrust_factor * timestep
            ship.vel.rotation -= ship.thrusters.cw  * rotation_thrust_factor * timestep

            // Integrate.
            ship.pos.x += ship.vel.x * timestep
            ship.pos.y += ship.vel.y * timestep
            ship.pos.heading += ship.vel.rotation

            // Dampening
            ship.vel.rotation *= Math.pow(.9985, timestep)
            ship.vel.x *= Math.pow(.999, timestep)
            ship.vel.y *= Math.pow(.9999, timestep)
        }
    }
}

export default GameState
