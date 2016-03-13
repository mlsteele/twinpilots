var keyStates = {}

var verbose = false

var emitter = new EventEmitter()

function init() {
    window.addEventListener("keydown", function(event) {
        if (verbose) {
            console.log(event.code)
        }
        keyStates[event.code] = true
        emitter.emitEvent("keydown")
    })

    window.addEventListener("keyup", function(event) {
        keyStates[event.code] = false
        emitter.emitEvent("keyup")
    })
}

function isDown(code) {
    return !!keyStates[code]
}

function setVerbose(v) {
    verbose = !!v
}

export default {init, isDown, setVerbose, emitter}
