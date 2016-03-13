console.log("entry")

import kbinput from "./kbinput.js"
// kbinput.setVerbose(true)
kbinput.init()

import Constants from "./constants.js"
import {loadShipModel, GamePort} from "./graphics.js"
import GameState from "./gamestate.js"
import CommClient from "./commclient.js"

loadShipModel(_ => {
    var gameport = new GamePort()
    gameport.animate();

    var gamestate = new GameState()

    function get_inputstate() {
        var inputstate = {
            left_forward: bool_to_bin(kbinput.isDown("KeyW")),
            left_back: bool_to_bin(kbinput.isDown("KeyS")),
            left_left: bool_to_bin(kbinput.isDown("KeyA")),
            left_right: bool_to_bin(kbinput.isDown("KeyD")),

            right_forward: bool_to_bin(kbinput.isDown("KeyI")),
            right_back: bool_to_bin(kbinput.isDown("KeyK")),
            right_left: bool_to_bin(kbinput.isDown("KeyJ")),
            right_right: bool_to_bin(kbinput.isDown("KeyL")),
        }
        return inputstate
    }

    setInterval(function physicsloop() {
        // Use keyboard state to modify game state.
        var inputstate = get_inputstate()
        gamestate.applyInput(inputstate)

        gamestate.stepPhysics()

    }, 1000 / Constants.physicsRate)

    ;(function renderloop() {
        // Schedule next iteration.
        requestAnimationFrame(renderloop)

        // Update renderer about game.
        gameport.update(gamestate)
    })()

    // Communicate with server.
    var comm = new CommClient()
    function onkbchange() {
        comm.send(get_inputstate())
    }
    kbinput.emitter.addListener("keyup", onkbchange)
    kbinput.emitter.addListener("keydown", onkbchange)
    setInterval(onkbchange, 1000 / 5)
    comm.emitter.addListener("gamestate", function(server_gamestate) {
        gamestate = new GameState(server_gamestate)
    })

    function bool_to_bin(v) {
        if (v) { return 1 } else { return 0 }
    }
})
