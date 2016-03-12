var keyStates = {}

var verbose = false

function init() {
    window.addEventListener("keydown", function(event) {
        if (verbose) {
            console.log(event.code)
        }
        keyStates[event.code] = true
    })

    window.addEventListener("keyup", function(event) {
        keyStates[event.code] = false
    })
}

function isDown(code) {
    return !!keyStates[code]
}

function setVerbose(v) {
    verbose = !!v
}

export default {init, isDown, setVerbose}
