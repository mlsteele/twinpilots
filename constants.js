export default {
    // Rate to update physics
    physicsRate: 66,

    // Rate to push state to clients
    serverPushRate: 22,

    // Rate to push inputs to clients.
    // Note this is in addition to event driven updates.
    // So not very necessary, just helps with glitches.
    inputPushRate: 5,
}
