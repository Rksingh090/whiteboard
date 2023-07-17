import React from 'react'

import styled from 'styled-components';
import './sidebar.css';
import { useCanvasOption } from './CanvasCtx';

import { PiWaveSineLight } from 'react-icons/pi'
import { BiRectangle } from 'react-icons/bi'
import { IoTriangleOutline } from 'react-icons/io5'
import { BsCircle } from 'react-icons/bs'

const Nav = styled.div`
    background-color: white;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 0 10px #0707074c;
    overflow: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 10px 0;
`

const SidebarUL = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
`
const ListItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 8px 10px;
    transition: all .16s ease-in;
    font-size: 14px;
    cursor: pointer;
    &:hover{
        background-color: #fad7d7;
    }
`

const BrushSlider = styled.input`
    width: 100%;
    align-self: center;
    outline: 0;
    border: 0;
    border-radius: 500px;
    transition: box-shadow 0.2s ease-in-out;
    // Chrome
    @media screen and (-webkit-min-device-pixel-ratio:0) {
        & {
            overflow: hidden;
            height: 15px;
            -webkit-appearance: none;
            background-color: #ddd;
        }
        &::-webkit-slider-runnable-track {
            height: 15px;
            -webkit-appearance: none;
            color: #444;
            // margin-top: -1px;
            transition: box-shadow 0.2s ease-in-out;
        }
        &::-webkit-slider-thumb {
            width: 15px;
            height: 15px;
            -webkit-appearance: none;
            cursor: ew-resize;
            background: #fff;
            box-shadow: -200px 0 0 194px #1597ff, inset 0 0 0 1px #1597ff;
            border-radius: 50%;
            transition: box-shadow 0.2s ease-in-out;
            position: relative;
            // top: 1px;
        }
        &:active::-webkit-slider-thumb {
            background: #fff;
            /* box-shadow: -140px 0 0 120px #1597ff, inset 0 0 0 3px #1597ff; */
        }
    }
    // Firefox
    &::-moz-range-progress {
        background-color: #43e5f7; 
    }
    &::-moz-range-track {  
        background-color: #9a905d;
    }
    // IE
    &::-ms-fill-lower {
        background-color: #43e5f7; 
    }
    &::-ms-fill-upper {  
        background-color: #9a905d;
    }
`
interface ColorItemType {
    bg?: string,
    outline?: string
}

const ColorItem = styled.button<ColorItemType>`
    width: 20px;
    aspect-ratio: 1;
    border-radius: 100px;
    background-color: ${props => props.bg || "black"};
    outline: 1px solid ${props => props.outline || props.bg || "black"};
    outline-offset: 3px;
    border: none;
    cursor: pointer;
`

const CustomFileInput = styled.input`
    border: 1px solid #aaa;
    padding: 10px;
    outline: none;
`


const Sidebar = () => {

    const colorPallet = React.useMemo(() => [
        {
            color: "#FFFFFF",
            outline: "black"
        },
        { color: "#000000" },
        { color: "#FF0000" },
        { color: "#0000FF" },
        { color: "#37ff00" },
        { color: "#ff4800" },
        { color: "#FFFF00" },
        { color: "#ff33da" },
        { color: "#00ff80" },
        { color: "#00539C" },
        { color: "#F9E795" },
        { color: "#00FFFF" },
        { color: "#3A6B35" }
    ], []);

    const [showSaveDialog, setShowDialog] = React.useState<boolean>(false);
    const [fileName, setFileName] = React.useState<string>("");

    const { setColor, setSelectedTool, brushSize, setBrushSize, contextCtx, contextCanvas } = useCanvasOption();

    return (
        <Nav className='sidebar'>
            <div className='sidebar_shapes'>
                <h2 className='sidebarHeading withPad'>Shapes</h2>
                <SidebarUL>
                    <ListItem onClick={() => setSelectedTool("brush")}>
                        <PiWaveSineLight size={18} />
                        <span>Draw</span>
                    </ListItem>
                    <ListItem onClick={() => setSelectedTool("rectangle")}>
                        <BiRectangle size={18} />
                        <span>Rectangle</span>
                    </ListItem>
                    <ListItem onClick={() => setSelectedTool("triangle")}>
                        <IoTriangleOutline size={18} />
                        <span>Triangle</span>
                    </ListItem>
                    <ListItem onClick={() => setSelectedTool("circle")}>
                        <BsCircle size={18} />
                        <span>Circle</span>
                    </ListItem>
                </SidebarUL>
            </div>


            <div className="sidebarSlider">
                <h2 className='sidebarHeading'>Brush Size ({brushSize})</h2>
                <BrushSlider
                    type='range'
                    value={brushSize}
                    onChange={(e) => {
                        setBrushSize(e.target.value)
                    }}
                    step={1}
                    min={1}
                    max={30}
                />
            </div>

            <div className='sidebar_shapes'>
                <h2 className="sidebarHeading withPad">Colors</h2>
                <div className='sidebar_colors'>
                    {
                        colorPallet.map((color, idx) => {
                            return (
                                <ColorItem key={color + "_" + idx} title={color.color} bg={color.color} outline={color?.outline} onClick={() => setColor(color.color)} />
                            )
                        })
                    }
                </div>
            </div>

            <div className="CanvasActions">
                <dialog open={showSaveDialog} id='filedialog'>
                    <CustomFileInput placeholder='File Name' onChange={(e) => setFileName(e.target.value)} value={fileName} />

                    <div className='fileSaveActions'>
                        <button className='cancle'
                            onClick={() => setShowDialog(false)}
                        >Cancle</button>
                        <button className='save' onClick={() => {
                            let image = contextCanvas.current?.toDataURL("image/png");
                            var link = document.createElement('a');
                            link.download = fileName + '.png';
                            link.href = image
                            link.click();
                            setShowDialog(false);
                        }}>Save</button>
                    </div>
                </dialog>
                <button className='clear' onClick={() => contextCtx.clearRect(0, 0, contextCanvas.current?.width, contextCanvas.current?.height)}>Clear Board</button>
                <button className='saveImage'
                    onClick={() => setShowDialog(true)}
                >Save Image</button>
            </div>
        </Nav >
    )
}

export default Sidebar