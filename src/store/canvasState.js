import { makeAutoObservable } from "mobx";

class CanvasState {
    canvas = null
    undoList = []
    redoList = []
    userName = ''
    socket = null
    sessionId = null

    constructor () {
        makeAutoObservable(this)
    }

    setUserName(name) {
        this.userName = name
    }

    setSocket(socket) {
        this.socket = socket
    }

    setSessionId(id) {
        this.sessionId = id
    }

    setCanvas(canvas) {
        this.canvas = canvas
    } 

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    resetRedo() {
        this.redoList = []
    }

    undo() {
        const ctx = this.canvas.getContext('2d')
        if (this.undoList.length > 0) { 
            const dataUrl = this.undoList.pop(),
                  img = new Image();
            this.redoList.push(this.canvas.toDataURL())
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
            
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    redo() {
        const ctx = this.canvas.getContext('2d')
        if (this.redoList.length > 0) { 
            const dataUrl = this.redoList.pop(),
                  img = new Image();
            this.undoList.push(this.canvas.toDataURL())
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
            
        }
    }
}

export default new CanvasState()