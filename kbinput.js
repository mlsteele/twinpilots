var keyStates = {}

var verbose = false

var emitter = new EventEmitter()

var prevented = {}

function init() {
    window.addEventListener("keydown", function(event) {
        if (verbose) {
            console.log(event.code)
        }
        keyStates[event.code] = true
        emitter.emitEvent("keydown")
        if (prevented[event.code]) event.preventDefault()
    })

    window.addEventListener("keyup", function(event) {
        keyStates[event.code] = false
        emitter.emitEvent("keyup")
        if (prevented[event.code]) event.preventDefault()
    })
}

function isDown(code) {
    return !!keyStates[code]
}

function setVerbose(v) {
    verbose = !!v
}

function preventDefault(code) {
    prevented[code] = true
}

export default {init, isDown, setVerbose, emitter, preventDefault}
