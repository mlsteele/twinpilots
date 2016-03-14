class CommClient {
    constructor() {
        this.port            = 8073
        this.host            = window.document.location.hostname
        this.emitter         = new EventEmitter()
        this._reconnectTimer = null
        this._makews()
    }

    _makews() {
        clearTimeout(this._reconnectTimer)
        this.ws           = new WebSocket("ws://" + this.host + ":" + this.port)
        this.ws.onmessage = this._onmessage.bind(this)
        this.ws.onclose   = this._onclose.bind(this)
        this.ws.onopen    = this._onopen.bind(this)
    }

    _onopen() {
        console.log("Server socket open")
    }

    _onmessage(event) {
        var data = JSON.parse(event.data)
        this.emitter.emitEvent("message", [data])
    }

    _onclose() {
        console.warn("Server socket closed")
        clearTimeout(this._reconnectTimer)
        this._reconnectTimer = setTimeout(_ => {
            this._makews()
        }, 400)
    }

    send(inputstate) {
        if (this.ws.readyState !== WebSocket.OPEN) {
            return
        }
        var data = {inputstate}
        this.ws.send(JSON.stringify(data))
    }
}

export default CommClient
