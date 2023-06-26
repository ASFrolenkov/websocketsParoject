import Tool from "./Tool";

export default class Line extends Tool {
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
                type: 'line',
                x: this.currentX,
                y: this.currentY,
                startX: this.startX,
                startY: this.startY,
                stroke: this.ctx.strokeStyle,
                line: this.ctx.lineWidth
            }
        }))
        this.socket.send(this.finish())
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.saved = this.canvas.toDataURL();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.currentX = e.pageX - e.target.offsetLeft;
            this.currentY = e.pageY - e.target.offsetTop;

            this.draw(this.currentX, this.currentY);
        }
    }

    draw(x, y) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX, this.startY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        } 
    }

    static staticDraw(ctx, {x, y, startX, startY, stroke, line}) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = line;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    
}