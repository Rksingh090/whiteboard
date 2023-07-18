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

    const { selectedTool,
        brushSize,
        color,
        setContextCtx,
        setContextCanvas,
        setCanvasHistory,
        snapshot,
        setSnapshot,
        filled
    } = useCanvasOption();

    // init 
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

    useEffect(() => {
        if (ctx !== null && ref.current) {
            let getSnap = ctx.getImageData(0, 0, ref.current.width, ref.current.height);
            setSnapshot(getSnap)
        }
    }, [ctx, ref])

    // mouse down 
    useEffect((): any => {
        const onDrawStart = (e: MouseEvent) => {
            if (ctx === null) return () => { };

            setIsDrawing(true);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = brushSize;

            setPrevMouseX(e.offsetX);
            setPrevMouseY(e.offsetY);
        }

        if (ref.current)
            ref.current.addEventListener("mousedown", onDrawStart)
        return () => ref.current && ref.current.removeEventListener("mousedown", onDrawStart)
    }, [ctx, ref, brushSize, color])

    // mouse up 
    useEffect((): any => {
        const stopDrawing = function (e: MouseEvent) {
            setIsDrawing(false);
            if (ref.current && ctx !== null) {
                let getSnap = ctx.getImageData(0, 0, ref.current.width, ref.current.height);
                setSnapshot(getSnap);
                setCanvasHistory((prev: ImageData[]) => [
                    ...prev,
                    getSnap
                ])
            }
        };

        if (ref.current)
            ref.current.addEventListener("mouseup", stopDrawing)
        return () => ref.current && ref.current.removeEventListener("mouseup", stopDrawing)
    }, [ctx])

    // mouse move 
    useEffect((): any => {

        // draw rectanlge 
        const drawRect = (e: MouseEvent) => {
            if (ctx === null) return () => { };
            if (filled) {
                ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
            } else {
                ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
            }
        }

        // draw triangle
        var drawTriangle = function (e: MouseEvent) {
            if (ctx !== null) {
                ctx.beginPath();
                ctx.moveTo(prevMouseX, prevMouseY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
                ctx.closePath();
                if (filled) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
            }
        };

        // draw cirlce 
        var drawCircle = function (e: MouseEvent) {
            if (ctx !== null) {
                ctx.beginPath();
                var radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
                ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI, false);
                if (filled) {
                    ctx.fill();
                } else {
                    ctx.stroke();
                }
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

        if (ref.current) {
            ref.current.addEventListener("mousemove", drawing)
        }
        return () => ref.current && ref.current.removeEventListener("mousemove", drawing)
    }, [ctx, isDrawing])


    // touch start 
    // useEffect((): any => {
    //     const onDrawStart = (e: TouchEvent) => {
    //         if (ctx === null) return () => { };

    //         let evX = 0;
    //         let evY = 0;
    //         if (ref.current) {
    //             var rect = ref.current.getBoundingClientRect();
    //             evX = e.targetTouches[0].pageX - rect.left;
    //             evY = e.targetTouches[0].pageY - rect.top;
    //         }

    //         console.log(evX, evY);


    //         setIsDrawing(true);
    //         ctx.beginPath();
    //         ctx.strokeStyle = color;
    //         ctx.lineWidth = brushSize;

    //         setPrevMouseX(evX);
    //         setPrevMouseY(evY);

    //         if (ref.current)
    //             setSnapshot(ctx.getImageData(0, 0, ref.current.width, ref.current.height));
    //     }

    //     if (ref.current)
    //         ref.current.addEventListener("touchstart", onDrawStart)
    //     return () => ref.current && ref.current.removeEventListener("touchstart", onDrawStart)
    // }, [ctx, ref, brushSize, color])

    // touch end 
    // useEffect((): any => {
    //     const stopDrawing = function (e: TouchEvent) {
    //         setIsDrawing(false);
    //     };

    //     if (ref.current)
    //         ref.current.addEventListener("touchend", stopDrawing)
    //     return () => ref.current && ref.current.removeEventListener("touchend", stopDrawing)
    // }, [ctx])

    // touchmove 
    // useEffect(():any => {

    //     const drawRect = (evX: number, evY: number) => {
    //         if (ctx === null) return () => { };
    //         ctx.strokeRect(evX, evY, prevMouseX - evX, prevMouseY - evY);
    //     }

    //     var drawTriangle = function (evX: number, evY: number) {
    //         if (ctx !== null) {
    //             ctx.beginPath();
    //             ctx.moveTo(prevMouseX, prevMouseY);
    //             ctx.lineTo(evX, evY);
    //             ctx.lineTo(prevMouseX * 2 - evX, evY);
    //             ctx.closePath();
    //             ctx.stroke();
    //         }
    //     };
    //     var drawCircle = function (evX: number, evY: number) {
    //         if (ctx !== null) {
    //             ctx.beginPath();
    //             var radius = Math.sqrt(Math.pow(prevMouseX - evX, 2) + Math.pow(prevMouseY - evY, 2));
    //             ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI, false);
    //             ctx.stroke();
    //         }
    //     };

    //     const drawing = (e: TouchEvent) => {
    //         if (!isDrawing) return () => { };
    //         if (ctx === null) return () => { };

    //         let evX = 0, evY = 0;
    //         if (ref.current) {
    //             var rect = ref.current.getBoundingClientRect();
    //             evX = e.targetTouches[0].pageX - rect.left;
    //             evY = e.targetTouches[0].pageY - rect.top;
    //             console.log(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    //             console.log(rect.left, rect.top);
    //         }


    //         if (snapshot !== undefined) {
    //             ctx.putImageData(snapshot, 0, 0);
    //         }

    //         if (selectedTool === "brush") {
    //             ctx.lineTo(evX, evY);

    //             ctx.stroke();
    //         }
    //         else if (selectedTool === "rectangle") {
    //             drawRect(evX, evY);
    //         }
    //         else if (selectedTool === "triangle") {
    //             drawTriangle(evX, evY);
    //         }
    //         else if (selectedTool === "circle") {
    //             drawCircle(evX, evY);
    //         }
    //     };

    //     if(ref.current)
    //     ref.current.addEventListener("touchmove", drawing)
    //     return () => ref.current && ref.current.removeEventListener("touchmove", drawing)
    // }, [ctx, isDrawing])


    return (
        <Canvas ref={ref}></Canvas>
    )
}

export default CanvasElement;