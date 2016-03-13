console.log("entry")

import kbinput from "./kbinput.js"
// kbinput.setVerbose(true)
kbinput.init()

import {loadShipModel, GamePort} from "./graphics.js"
import GameState from "./gamestate.js"

loadShipModel(_ => {
    var gameport = new GamePort()
    gameport.animate();

    var gamestate = new GameState()

    ;(function gameloop() {
        // Schedule next iteration.
        requestAnimationFrame(gameloop)

        // Use keyboard state to modify game state.
        gamestate.ships[0].thrusters.forward = bool_to_bin(kbinput.isDown("KeyW"))
        // gamestate.ships[0].thrusters.reverse = bool_to_bin(kbinput.isDown("KeyS"))
        gamestate.ships[0].thrusters.ccw = bool_to_bin(kbinput.isDown("KeyA"))
        gamestate.ships[0].thrusters.cw  = bool_to_bin(kbinput.isDown("KeyD"))

        gamestate.ships[1].thrusters.forward = bool_to_bin(kbinput.isDown("KeyI"))
        // gamestate.ships[1].thrusters.reverse = bool_to_bin(kbinput.isDown("KeyK"))
        gamestate.ships[1].thrusters.ccw = bool_to_bin(kbinput.isDown("KeyJ"))
        gamestate.ships[1].thrusters.cw  = bool_to_bin(kbinput.isDown("KeyL"))

        gamestate.stepPhysics()

        // Update renderer about game.
        gameport.update(gamestate)
    })()

    function bool_to_bin(v) {
        if (v) {
            return 1
        } else {
            return 0
        }
    }
})
