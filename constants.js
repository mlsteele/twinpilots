export default {
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
    laserLifetime: 0.1,
    // Time between laser fire in seconds.
    laserCooldown: 0.2,
}
