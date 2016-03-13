import GameState from "./gamestate.js"
import Constants from "./constants.js"

var WebSocket = require('ws')
var wss = new WebSocket.Server({ port: 8073 })

var inputstate = null
var gamestate = null

var physicsTimer = setInterval(function() {
    if (gamestate === null || inputstate === null) {
        return
    }

    gamestate.applyInput(inputstate)
    gamestate.stepPhysics()
}, 1000 / Constants.physicsRate)

wss.on("connection", function connection(ws) {
    console.log("Connection opened.")

    var sendTimer = setInterval(function() {
        if (gamestate === null || inputstate === null || ws.readyState !== WebSocket.OPEN) {
            return
        }

        var data = {
            gamestate: gamestate
        }
        ws.send(JSON.stringify(data))
    }, 1 / 30)

    ws.on("message", function(message) {
        var data = JSON.parse(message)
        inputstate = data.inputstate
    });

    ws.on("close", function() {
        console.log("Connection closed.")
        clearInterval(sendTimer)
        inputstate = null
        gamestate = null
    })
})

console.log("Server started.")
gamestate = new GameState()
