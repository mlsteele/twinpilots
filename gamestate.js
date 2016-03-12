class GameState {
    constructor() {
        this.ships = []
        this.addShip()
        this.addShip()
    }

    addShip() {
        var ship = {
            pos: {
                x: 0,
                y: 0,
            },
        }
        this.ships.push(ship)
    }
}

export default GameState
