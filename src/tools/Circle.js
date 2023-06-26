import Tool from "./Tool";

export default class Circle extends Tool {
    // eslint-disable-next-line no-useless-constructor
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r: this.radius,
                stroke: this.ctx.strokeStyle,
                fill: this.ctx.fillStyle,
                line: this.ctx.lineWidth
            }
        }))
        this.socket.send(this.finish())
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft,
                currentY = e.pageY - e.target.offsetTop,
                x = currentX - this.startX,
                y = currentY - this.startY;
            this.radius = Math.sqrt(x*x + y*y)

            this.draw(this.startX, this.startY, this.radius);
        }
    }

    draw(x, y, r) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        } 
    }

    static staticDraw(ctx, {x, y, r, stroke, fill, line}) {
        ctx.strokeStyle = stroke;
        ctx.fillStyle = fill;
        ctx.lineWidth = line;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}