import * as React from 'react';

const createCtx = React.createContext<any>({});

export const useCanvasOption = () => React.useContext(createCtx);


export default function CanvasCtx({ children }: { children: React.ReactNode }) {

    const [selectedTool, setSelectedTool] = React.useState<string>("brush");
    const [brushSize, setBrushSize] = React.useState<number>(1);
    const [color, setColor] = React.useState<string>("red");
    const [filled, setFilled] = React.useState<boolean>(false);

    const [contextCtx, setContextCtx] = React.useState<CanvasRenderingContext2D>();
    const [contextCanvas, setContextCanvas] = React.useState<React.MutableRefObject<HTMLCanvasElement>>();

    const [canvasHistory, setCanvasHistory] = React.useState<ImageData[]>([]);
    const [canvasRedo, setCanvasRedo] = React.useState<ImageData[]>([]);
    const [snapshot, setSnapshot] = React.useState<ImageData>();


    // undo canvas 
    const undoCanvas = () => {
        if (canvasHistory.length <= 1) {
            if (contextCtx !== undefined && contextCanvas !== undefined) {
                contextCtx.clearRect(0, 0, contextCanvas?.current.width, contextCanvas?.current.height)
                setSnapshot(undefined)
            }
            if (canvasHistory.length > 0) {
                setCanvasHistory([]);
                setCanvasRedo((prev: ImageData[]) => [
                    ...prev,
                    canvasHistory[0]
                ])
            }
            return;
        };
        let lastUndo = canvasHistory.filter((_, idx) => idx === canvasHistory.length - 1)[0];
        let historyArr = canvasHistory.filter((_, idx) => idx !== canvasHistory.length - 1);
        setCanvasHistory(historyArr);
        setCanvasRedo((prev: ImageData[]) => [
            ...prev,
            lastUndo
        ])

        if (contextCtx !== undefined && historyArr.length > 0) {
            contextCtx.putImageData(historyArr[historyArr.length - 1], 0, 0);
            setSnapshot(historyArr[historyArr.length - 1])
        }
    }

    // redocanvas 
    const redoCanvas = () => {
        if (canvasRedo.length <= 1) {
            if (contextCtx !== undefined && contextCanvas !== undefined && canvasRedo.length === 1) {
                contextCtx.putImageData(canvasRedo[0], 0,0 );
                setSnapshot(canvasRedo[0])
            }
            if (canvasRedo.length > 0) {
                setCanvasRedo([])
                setCanvasHistory((prev: ImageData[]) => [...prev, canvasRedo[0]])
            }
            return;
        };

        let lastUndo = canvasRedo.filter((_, idx) => idx === canvasRedo.length - 1)[0];
        let historyArr = canvasRedo.filter((_, idx) => idx !== canvasRedo.length - 1);

        setCanvasRedo(historyArr);
        setCanvasHistory((prev: ImageData[]) => [
            ...prev,
            lastUndo
        ])

        if (contextCtx !== undefined && historyArr.length > 0) {
            contextCtx.putImageData(historyArr[historyArr.length - 1], 0, 0);
            setSnapshot(historyArr[historyArr.length - 1]);
        }
    }

    // clear canvas 
    const clearCanvas = () => {
        if (contextCtx !== undefined && contextCanvas !== undefined && contextCanvas.current) {
            contextCtx.clearRect(0, 0, contextCanvas.current?.width, contextCanvas.current?.height)
            setCanvasHistory([]);
            setSnapshot(undefined)
        }
    }

    return (
        <createCtx.Provider value={{
            selectedTool, setSelectedTool,
            brushSize, setBrushSize,
            color, setColor,
            contextCtx, setContextCtx,
            contextCanvas, setContextCanvas,
            canvasHistory, setCanvasHistory,
            undoCanvas, clearCanvas,
            redoCanvas,
            snapshot, setSnapshot,
            filled, setFilled
        }}>
            {children}
        </createCtx.Provider>
    )
} 