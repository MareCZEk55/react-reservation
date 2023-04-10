import React, { useEffect, useRef, useState } from 'react'
import { Button, Dialog, Grid, IconButton, InputLabel, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { SketchPicker } from 'react-color';
import axios from 'axios';
import { IRooms2 } from '../../src/interfaces/IDataEvents';


interface IAddDialog{
    setOpenAddMistnost:(value:boolean) => void,
    setRooms: (room: IRooms2) => void,
}

function AddDialog({setOpenAddMistnost,setRooms}:IAddDialog) {
const [chosenColor, setChosenColor] = useState<string>("#FFFFFF");
const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
const [confirmedColor, setConfirmedColor] = useState<string>("#FFFFFF");
const [invertedColor, setInvertedColor] = useState<string>("#FFFFFF")

const nazevRef = useRef<HTMLInputElement>(null);
const popisRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  setInvertedColor(invertColor(confirmedColor, true));
}, [confirmedColor])


function invertColor(hex:string, bw:boolean) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r:number = parseInt(hex.slice(0, 2), 16),
        g:number = parseInt(hex.slice(2, 4), 16),
        b:number = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    const rString = (255 - r).toString(16);
    const gString = (255 - g).toString(16);
    const bString = (255 - b).toString(16);
    return "#" + rString.padStart(2,"0") + gString.padStart(2,"0") + bString.padStart(2,"0");
}


async function handlePridatButton(){
    try {
        if (nazevRef.current !== null && popisRef.current !== null) {

          const editedRoom = await axios.post(
            `${import.meta.env.VITE_URL_BACKEND}/rooms/pridat-mistnost`,
            {
              nazev: nazevRef.current.value,
              poznamka: popisRef.current.value,
              barva: confirmedColor,
            }
          );
          setRooms({
            room_id: editedRoom.data.id,
            assignee: editedRoom.data.id,
            text: editedRoom.data.nazev,
            color: editedRoom.data.barva,
            subtext: editedRoom.data.poznamka,
          });
        } else {
          throw new Error("Chybí hodnoty");
        }
    } catch (err) {
        console.log(err)
    }
    setOpenAddMistnost(false)
}

function handlePotvrditBarvu() {
    setDisplayColorPicker(false);
    setConfirmedColor(chosenColor)
}

  return (
    <div>
        <Paper sx={{padding:2}}>
            <Stack spacing={1} marginBottom={1}>
                <Typography>Název</Typography>
                <TextField size='small' required inputRef={nazevRef}></TextField>
                <Typography>Popis</Typography>
                <TextField size='small' inputRef={popisRef}></TextField>
                <Typography>Barva</Typography>
                <Button onClick={()=>setDisplayColorPicker(true)}
                    sx={{backgroundColor: confirmedColor,
                        color:invertedColor,
                        height:"40px", border:"1px solid black", 
                    "&.MuiButtonBase-root:hover":{background:confirmedColor}}}
                    disableRipple disableElevation
                >Klikni pro výběr barvy</Button>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Button variant='contained' onClick={()=>setOpenAddMistnost(false)}>Zrušit</Button>
                <Button variant='contained' onClick={()=>handlePridatButton()}>OK</Button>
            </Stack>
        </Paper>

        <Dialog open={displayColorPicker}>
            <SketchPicker color={chosenColor} 
                onChange={(color)=>{setChosenColor(color.hex)}}
                disableAlpha={true}
                />
            <Stack direction="row" justifyContent="space-between">
                <Button onClick={()=>setDisplayColorPicker(false)}>Zrušit</Button>
                <Button onClick={()=>handlePotvrditBarvu()}>OK</Button>
            </Stack>
        </Dialog>
    </div>
  )
}

export default AddDialog