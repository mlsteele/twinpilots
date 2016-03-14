console.log("entry")

import kbinput from "./kbinput.js"
import Constants from "./constants.js"
import {loadShipModel, GamePort} from "./graphics.js"
import GameState from "./gamestate.js"
import CommClient from "./commclient.js"
import uuid from "./uuid.js"

// kbinput.setVerbose(true)
kbinput.init()
kbinput.preventDefault("Space")

loadShipModel(_ => {
    var playerId = uuid.v4()

    var gameport = new GamePort()
    gameport.animate();

    var gamestate = new GameState()
    gamestate.addPlayer({playerId, seq: 0})

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

            attack: bool_to_bin(kbinput.isDown("Space")),
        }
        return inputstate
    }

    setInterval(function physicsloop() {
        // Use keyboard state to modify game state.
        var inputstate = get_inputstate()
        gamestate.applyInput(playerId, inputstate)

        if (Constants.clientPredictionEnabled) {
            gamestate.stepState()
        }
    }, 1000 / Constants.physicsRate)

    ;(function renderloop() {
        // Schedule next iteration.
        requestAnimationFrame(renderloop)

        // Update renderer about game.
        gameport.update(playerId, gamestate)
    })()

    // Communicate with server.
    var comm = new CommClient()
    function onkbchange() {
        comm.send(get_inputstate())
    }
    kbinput.emitter.addListener("keyup", onkbchange)
    kbinput.emitter.addListener("keydown", onkbchange)
    setInterval(onkbchange, 1000 / Constants.inputPushRate)
    comm.emitter.addListener("message", function(server_message) {
        playerId = server_message.playerId
        gamestate = new GameState(server_message.gamestate)
    })

    function bool_to_bin(v) {
        if (v) { return 1 } else { return 0 }
    }
})
