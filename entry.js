console.log("entry")

import kbinput from "./kbinput.js"
kbinput.setVerbose(true)
kbinput.init()

import GamePort from "./graphics.js"
var gameport = new GamePort()
gameport.animate();

import GameState from "./gamestate.js"

var gamestate = new GameState()

;(function gameloop() {
    // Schedule next iteration.
    requestAnimationFrame(gameloop)

    // Use keyboard state to modify game state.
    if (kbinput.isDown("KeyW") ){
        gamestate.ships[0].pos.y += 1
    }
    if (kbinput.isDown("KeyS") ){
        gamestate.ships[0].pos.y -= 1
    }
    if (kbinput.isDown("KeyA") ){
        gamestate.ships[0].pos.x -= 1
    }
    if (kbinput.isDown("KeyD") ){
        gamestate.ships[0].pos.x += 1
    }

    if (kbinput.isDown("KeyI") ){
        gamestate.ships[1].pos.y += 1
    }
    if (kbinput.isDown("KeyK") ){
        gamestate.ships[1].pos.y -= 1
    }
    if (kbinput.isDown("KeyJ") ){
        gamestate.ships[1].pos.x -= 1
    }
    if (kbinput.isDown("KeyL") ){
        gamestate.ships[1].pos.x += 1
    }

    // Update renderer about game.
    gameport.update(gamestate)
})()
