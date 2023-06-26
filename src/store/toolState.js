import { makeAutoObservable } from "mobx";

class ToolState {
    tool = null
    clientFillColor = null
    clientStrokeColor = null
    clientLineWidth = 1
    constructor () {
        makeAutoObservable(this)
    }

    setTool(tool) {
        this.tool = tool
    }
    
    setFillColor(color) {
        this.clientFillColor = color
        this.tool.fillColor = color
    }

    setStrokeColor(color) {
        this.clientStrokeColor = color
        this.tool.strokeColor = color
    }

    setWidth(width) {
        this.clientLineWidth = width
        this.tool.lineWidth = width
    }
}

export default new ToolState()