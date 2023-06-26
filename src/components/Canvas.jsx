import React, { useEffect, useRef, useState } from "react";
import '../css/canvas.scss'
import { observer } from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useParams } from "react-router-dom";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import axios from 'axios'

const Canvas = observer(() => {
    const canvasRef = useRef()
    const inputRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        const ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(res => {
                const img = new Image()
                img.src = res.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }).catch(() => {})
    }, [])

    useEffect(() => {
        if (canvasState.userName) {
            const socket = new WebSocket('ws://localhost:5000/')
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)

            toolState.setTool(new Brush(canvasState.canvas, socket, params.id))

            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.userName,
                    method: 'connection'
                }))
            }
            socket.onmessage = (event) => {
                const msg = JSON.parse(event.data)
                switch (msg.method) {
                    case 'connection':
                        console.log(`Пользователь ${msg.username} подключился`)
                        break;
                    case 'draw':
                        drawHandler(msg)
                        break;
                    default:
                        break;
                }
            }
        }
    }, [canvasState.userName])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush": 
                Brush.staticDraw(ctx, figure)
                break;
            case "rect":
                Rect.staticDraw(ctx, figure)
                break;
            case "circle":
                Circle.staticDraw(ctx, figure)
                break;
            case "line":
                Line.staticDraw(ctx, figure)
                break;
            case "erase":
                Eraser.staticDraw(ctx, figure)
                break;
            case "finish": 
                ctx.strokeStyle = toolState.clientStrokeColor || '#000'
                ctx.fillStyle = toolState.clientFillColor || '#000'
                ctx.lineWidth = toolState.clientLineWidth
                ctx.beginPath()
                break;
            default:
                break;
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        canvasState.resetRedo()   
    }
    const mouseUpHandler = () => {
        axios.post(`http://localhost:5000/image?id=${params.id}`, 
                    {img: canvasRef.current.toDataURL()})
                    .then(res => console.log(res.data))
    }

    const connectHandler = () => {
        canvasState.setUserName(inputRef.current.value)
        setModal(false)
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input ref={inputRef} type="text" />
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={connectHandler}>
                    Войти
                </Button>
                </Modal.Footer>
            </Modal>
            <canvas
                onMouseUp={() => mouseUpHandler()}
                onMouseDown={() => mouseDownHandler()}
                ref={canvasRef} 
                width={600} 
                height={400}/>
        </div>
    )
})

export default Canvas