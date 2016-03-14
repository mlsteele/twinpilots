import GameState from "./gamestate.js"
import {Constants, seconds_to_steps} from "./constants.js"
import uuid from "./uuid.js"

var WebSocket = require('ws')
var wss = new WebSocket.Server({ port: 8073 })

var nconnected = 0
var inputstates = {}
var gamestate = null

var physicsTimer = setInterval(function() {
    if (gamestate === null) {
        return
    }

    for (var playerId in inputstates) {
        gamestate.applyInput(playerId, inputstates[playerId])
    }
    gamestate.stepState()
}, 1000 / Constants.physicsRate)

wss.on("connection", function connection(ws) {
    var playerId = uuid.v4()
    console.log("<- Connected player: " + playerId)
    nconnected += 1

    gamestate.addPlayer({playerId, seq: nconnected})

    var sendTimer = setInterval(function() {
        if (gamestate === null || ws.readyState !== WebSocket.OPEN) {
            return
        }

        var data = {
            playerId: playerId,
            gamestate: gamestate,
        }
        ws.send(JSON.stringify(data))
    }, 1000 / Constants.serverPushRate)

    ws.on("message", function(message) {
        var data = JSON.parse(message)
        inputstates[playerId] = data.inputstate
    });

    ws.on("close", function() {
        console.log("Connection closed.")
        nconnected -= 1
        clearInterval(sendTimer)
        if (nconnected == 0) {
            console.log("Reset game. All players disconnected.")
            inputstates = {}
            gamestate = new GameState()
        }
    })
})

console.log("Server started.")
gamestate = new GameState()
