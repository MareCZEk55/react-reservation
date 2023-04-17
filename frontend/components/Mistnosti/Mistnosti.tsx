import React, { useContext, useEffect, useState } from 'react'
import { IRooms2 } from '../../src/interfaces/IDataEvents'
import { Button, Dialog, Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { DataGrid, GridCallbackDetails, GridCellEditStopParams, GridCellEditStopReasons, GridCellParams, GridColDef, GridRenderCellParams, GridTreeNode, MuiBaseEvent, MuiEvent, csCZ } from '@mui/x-data-grid';
import CircleIcon from '@mui/icons-material/Circle';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import AddDialog from "./AddDialog"
import { UserContext } from '../../src/UserContext';
import { Roles } from '../../src/interfaces/IUser';

interface IMistnostiParams{
    rooms: IRooms2[],
    setRooms: (room: IRooms2) => void,
}
function Mistnosti( {rooms, setRooms} :IMistnostiParams) {
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    const [selectColor, setSelectColor] = useState<string>("");
    const [editedRow, setEditedRow] = useState<GridCellParams<any, unknown, unknown, GridTreeNode>["row"]>();
    const [editedColorCell, setEditedColorCell] = useState({});
    const [openAddMistnost, setOpenAddMistnost] = useState<boolean>(false)
    const {user} = useContext(UserContext)
    
    function showColorPicker(defaultColor:string, row:any){
        if(user?.roleName !== Roles.Admin){
            return;
        }
        setSelectColor(defaultColor);
        setDisplayColorPicker(prev=> !prev)
        setEditedColorCell(row);
    }

    function handleSetOpenAddMistnost(value:boolean){
        setOpenAddMistnost(value);
    }

    useEffect(() => {
        if(editedRow !== undefined){
            updateMistnost();
        }
        
    }, [editedRow])
    

    const gridColumns: GridColDef[]=[
        {
            field: "room_id", headerName: "ID"
        },
        {
            field: "text", headerName: "Název", editable: user?.roleName === Roles.Admin
        },
        {
            field: "subtext", headerName: "Popis", editable: user?.roleName === Roles.Admin
        },
        {
            field: "color", headerName: "Barva", editable:true,
            renderCell: (params: GridRenderCellParams<String>) => (
                <>
                <IconButton onClick={() => showColorPicker(params.value, params.row)}>
                    <CircleIcon sx={{color:params.value}}/>
                </IconButton>
                </>
            )
        },
    ]

function handleCellEditStop(param: GridCellEditStopParams, event:any) {
    if(param.reason === GridCellEditStopReasons.enterKeyDown){
        setEditedRow({...param.row, [param.field]:event.target.value});
    }
}

async function updateMistnost() {
    try{
    const editedRoom = await axios.put(`${import.meta.env.VITE_URL_BACKEND}/rooms/uprav-mistnost/${editedRow.room_id}`,
            {
            nazev: editedRow.text,
            poznamka: editedRow.subtext,
            barva: displayColorPicker ?  selectColor : editedRow.color,
            }
        )

        setRooms({
            room_id: editedRoom.data.id, 
            assignee: editedRoom.data.id,
            text: editedRoom.data.nazev,
            subtext: editedRoom.data.poznamka,
            color: editedRoom.data.barva
        })

    } catch(err){
        console.log(err)
    }

    if(displayColorPicker){
        setDisplayColorPicker(false);
    }

}

function handlePridatMistnost(){
setOpenAddMistnost(true)
}

  return (
    <>
    <Grid container spacing={1}>
        <Grid item xs={9} height={400} >
            <DataGrid
            localeText={
                {...csCZ.components.MuiDataGrid.defaultProps.localeText,
                    columnHeaderSortIconLabel:"Setřídit"}
            }
            rows={rooms}
            columns={gridColumns}
            getRowId={(row) => {return row.room_id}}
            initialState={{
                columns:{
                    columnVisibilityModel:{
                        room_id: false
                    }
                }
            }}
            hideFooter
            density='compact'
            disableColumnMenu
            onCellEditStop={(param, event) => handleCellEditStop(param, event)}
            />
            <Dialog open={displayColorPicker}>
                <SketchPicker color={selectColor} onChange={(color)=>{setSelectColor(color.hex)}}
                    disableAlpha={true}/>
                <Stack direction="row" justifyContent="space-between">
                    <Button onClick={()=>setDisplayColorPicker(false)}>Zrušit</Button>
                    <Button onClick={()=>setEditedRow({...editedColorCell, color:selectColor})}>OK</Button>
                </Stack>
            </Dialog>
        </Grid>
        <Grid item xs={3}>
            <Button variant="contained" size="small"
            onClick={() => handlePridatMistnost()}
            >Přidat místnost</Button>
        </Grid>
    </Grid>

    <Dialog open={openAddMistnost}>
        <AddDialog setOpenAddMistnost={handleSetOpenAddMistnost} setRooms={setRooms}></AddDialog>
    </Dialog>
    </>
    )
}

export default Mistnosti