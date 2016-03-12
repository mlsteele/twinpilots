console.log("entry")

import kbinput from "./kbinput.js"
kbinput.init()

import GamePort from "./graphics.js"
var gameport = new GamePort()
gameport.animate()
