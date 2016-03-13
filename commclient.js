class CommClient {
    constructor() {
        this.port = 8073
        this.host = window.document.location.hostname
        this.ws = new WebSocket("ws://" + this.host + ":" + this.port)
        this.ws.onmessage = this._onmessage.bind(this)
        this.emitter = new EventEmitter()
    }

    _onmessage(event) {
        var data = JSON.parse(event.data)
        this.emitter.emitEvent("gamestate", [data.gamestate])
    }

    send(inputstate) {
        var data = {inputstate}
        this.ws.send(JSON.stringify(data))
    }
}

export default CommClient
