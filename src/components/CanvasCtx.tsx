import * as React from 'react';

const createCtx = React.createContext<any>({});

export const useCanvasOption = () => React.useContext(createCtx);


export default function CanvasCtx({children}: {children: React.ReactNode}){

    const [selectedTool, setSelectedTool] = React.useState<string>("brush");
    const [brushSize, setBrushSize] = React.useState<number>(1);
    const [color, setColor] = React.useState<string>("red");

    const [contextCtx, setContextCtx] = React.useState();
    const [contextCanvas, setContextCanvas] = React.useState();

    return (
        <createCtx.Provider value={{
            selectedTool, setSelectedTool,
            brushSize, setBrushSize,
            color, setColor,
            contextCtx, setContextCtx,
            contextCanvas, setContextCanvas
        }}>
            {children}
        </createCtx.Provider>
    )
} 