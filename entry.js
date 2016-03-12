console.log("entry")

import kbinput from "./kbinput.js"
kbinput.setVerbose(true)
kbinput.init()

import GamePort from "./graphics.js"
var gameport = new GamePort()
gameport.animate();

var gamestate = {
    x: 0,
    y: 0,
};

(function gameloop() {
    // Schedule next iteration.
    requestAnimationFrame(gameloop)

    // Use keyboard state to modify game state.
    if (kbinput.isDown("KeyW") ){
        gamestate.y += 1
    }
    if (kbinput.isDown("KeyS") ){
        gamestate.y -= 1
    }
    if (kbinput.isDown("KeyA") ){
        gamestate.x -= 1
    }
    if (kbinput.isDown("KeyD") ){
        gamestate.x += 1
    }

    // Update renderer about game.
    gameport.update(gamestate)
})()
