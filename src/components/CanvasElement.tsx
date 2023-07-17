import styled from "styled-components"
import { useRef, useEffect, useState } from 'react';
import { useCanvasOption } from "./CanvasCtx";

const Canvas = styled.canvas`
  height: 100%;
  width: 100%;
  box-shadow: 0 0 10px;
  box-shadow: 0 0 10px #0707074c;
  background-color: white;
  border-radius: 10px;
`

const CanvasElement = () => {

    const ref = useRef<HTMLCanvasElement>(null);

    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [prevMouseX, setPrevMouseX] = useState<number>(0);
    const [prevMouseY, setPrevMouseY] = useState<number>(0);
    const [snapshot, setSnapshot] = useState<ImageData>();


    const { selectedTool,
        brushSize, 
        color,
        setContextCtx,
        setContextCanvas
    } = useCanvasOption();

    useEffect(() => {
        if (ref.current) {

            ref.current.height = ref.current.getBoundingClientRect().height;
            ref.current.width = ref.current.getBoundingClientRect().width;

            setCtx(ref.current.getContext("2d", {
                willReadFrequently: true
            }))

            setContextCtx(ref.current.getContext("2d", {
                willReadFrequently: true
            }))
            
            setContextCanvas(ref)
        }
    }, [])

    useEffect((): any => {
        const onDrawStart = (e: MouseEvent) => {
            if (ctx === null) return () => { };

            setIsDrawing(true);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;

            setPrevMouseX(e.offsetX);
            setPrevMouseY(e.offsetY);

            if (ref.current)
                setSnapshot(ctx.getImageData(0, 0, ref.current.width, ref.current.height));
        }

        if (ref.current)
            ref.current.addEventListener("mousedown", onDrawStart)
        return () => ref.current && window.removeEventListener("mousedown", onDrawStart)
    }, [ctx, ref, brushSize, color])

    useEffect((): any => {
        const stopDrawing = function (e: MouseEvent) {
            setIsDrawing(false);
        };

        if (ref.current)
            ref.current.addEventListener("mouseup", stopDrawing)
        return () => ref.current && ref.current.removeEventListener("mousedown", stopDrawing)
    }, [ctx])

    useEffect(() => {

        const drawRect = (e: MouseEvent) => {
            if (ctx === null) return () => { };
            ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        }

        var drawTriangle = function (e: MouseEvent) {
            if (ctx !== null) {
                ctx.beginPath();
                ctx.moveTo(prevMouseX, prevMouseY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
                ctx.closePath();
                ctx.stroke();
            }
        };
        var drawCircle = function (e: MouseEvent) {
            if (ctx !== null) {
                ctx.beginPath();
                var radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
                ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI, false);
                ctx.stroke();
            }
        };

        const drawing = (e: MouseEvent) => {
            if (!isDrawing) return () => { };
            if (ctx === null) return () => { };


            if (snapshot !== undefined) {
                ctx.putImageData(snapshot, 0, 0);
            }

            if (selectedTool === "brush") {
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
            else if (selectedTool === "rectangle") {
                drawRect(e);
            }
            else if (selectedTool === "triangle") {
                drawTriangle(e);
            }
            else if (selectedTool === "circle") {
                drawCircle(e);
            }
        };

        window.addEventListener("mousemove", drawing)
        return () => window.removeEventListener("mousemove", drawing)
    }, [ctx, isDrawing])

    return (
        <Canvas ref={ref}></Canvas>
    )
}

export default CanvasElement;