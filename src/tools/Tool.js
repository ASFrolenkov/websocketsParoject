export default class Tool {
    constructor(canvas, socket, id) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.socket = socket
        this.id = id
        this.destroyEvents()
    }

    finish() {
        return (
            JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'finish',
                }
            })
        )
    }

    set fillColor(color) {
        this.ctx.fillStyle = color
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width
    }

    get strokeColor() {
        return this.ctx.strokeStyle
    }

    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }
}