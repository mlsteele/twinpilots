var Constants = {
    // Rate to update physics (Hz)
    physicsRate: 66,

    // Rate to push state to clients (Hz)
    serverPushRate: 22,

    // Rate to push inputs to clients (Hz)
    // Note this is in addition to event driven updates.
    // So not very necessary, just helps with glitches.
    inputPushRate: 5,

    // Whether clients should simulate locally.
    clientPredictionEnabled: true,

    // How long a laser lives in seconds.
    laserLifetime: 0.2,
    // Time between laser fire in seconds.
    laserCooldown: 0.5,
}

function seconds_to_steps(seconds) {
    return seconds * Constants.physicsRate
}

export {Constants, seconds_to_steps}
