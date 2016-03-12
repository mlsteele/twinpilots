var keyStates = {}

function init() {
    window.addEventListener("keydown", function(event) {
        // console.log(event.code)
        keyStates[event.code] = true
    })

    window.addEventListener("keyup", function(event) {
        keyStates[event.code] = false
    })
}

function isDown(code) {
    return !!keyStates[code]
}

export default {init, isDown}
