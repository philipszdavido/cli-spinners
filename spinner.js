const process = require("process")
const fs = require("fs")
const rdl = require("readline")
const l = console.log
const std = process.stdout
const colors = {
    "yellow": [33, 89],
    "blue": [34, 89],
    "green": [32, 89]
}

function shuffle(arr) {
    let what;

    if (shuffle.lastIndex != undefined) {
        if (shuffle.lastIndex >= arr.length - 1) {
            shuffle.lastIndex = 0
            what = 0
        } else {
            what = shuffle.lastIndex + 1
            shuffle.lastIndex = shuffle.lastIndex + 1
        }
    } else {
        shuffle.lastIndex = 0
        return arr[0]
    }
    return arr[what]
}

//const spinners = require("./spinners.json")
//const spinnerName = Object.keys(spinners)

const spinners = JSON.parse(fs.readFileSync('./spinners.json').toString())


class Spinner {
    constructor(size) {
        this.size = size
        this.cursor = 0
        this.timer = null
        this.colorTxt = {
            start: "",
            stop: ""
        }
        this.random = false
    }

    start() {
        process.stdout.write("\x1B[?25l")
        for (let i = 0; i < this.size; i++) {
            process.stdout.write("\u2591")
        }
        rdl.cursorTo(process.stdout, this.cursor, 0);
        this.timer = setInterval(() => {
            process.stdout.write("\u2588")
            this.cursor++;
            if (this.cursor >= this.size) {
                clearTimeout(this.timer)
            }
        }, 100)
    }

    spin(spinnerName) {
        process.stdout.write("\x1B[?25l")
        const spin = spinners[spinnerName]
        const spinnerFrames = spin.frames
        const spinnerTimeInterval = spin.interval
        let index = 0
        this.timer = setInterval(() => {
            let now = spinnerFrames[index]
            if (now == undefined) {
                index = 0
                now = spinnerFrames[index]
            }
            if (this.random) {
                this.randomise()
            }
            std.write(this.colorTxt.start + now + this.colorTxt.stop)
            rdl.cursorTo(std, 0, 0)
            index = index >= spinnerFrames.length ? 0 : index + 1

            /*for (let g of spinnerFrames) {
                std.write(g)
                rdl.cursorTo(std, 0, 0)
            }*/
        }, spinnerTimeInterval)

    }

    randomise() {
        if (this.random != true) {
            this.random = true
            return this
        }
        const colorKeys = Object.keys(colors)
        const colorToSelect = shuffle(colorKeys)
        const color = colors[colorToSelect]
        this.setColor(color)
    }

    color(colorName) {
        colorName = colors[colorName]
        this.setColor(colorName)
        return this
    }

    setColor(colorName) {
        this.colorTxt.start = "\x1b[" + colorName[0] + "m"
        this.colorTxt.stop = "\x1b[" + colorName[1] + "m\x1b[0m"
    }
}
module.exports = Spinner