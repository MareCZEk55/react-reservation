import React, { useRef } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, TextFieldProps, Typography } from '@mui/material'
import {IAddUserData} from "./IAddUserData"

interface IAddUserDialog{
    openDialog: boolean,
    handleOpenDialog: (value: boolean) => void
    userData: (value: IAddUserData) => void
}

function AddUserDialog( { openDialog, handleOpenDialog, userData} : IAddUserDialog) {
 
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const roleRef = useRef<HTMLInputElement>();

    function handleCloseDialog(reason: "backdropClick" | "escapeKeyDown"){
        if(reason === "backdropClick"){
            return;
        }
        handleOpenDialog(false);
  }  

  function handleOkDialog(){
    let newUser:IAddUserData;
    newUser = {
        username: usernameRef.current?.value as string,
        password: passwordRef.current?.value as string,
        role: roleRef.current?.value as string
    }
    userData(newUser);
  }
  
    return (
    <Dialog open={openDialog} onClose={(e, reason)=>handleCloseDialog(reason)}>
        <DialogTitle>Přidání uživatele</DialogTitle>
        <DialogContent>
            <Typography>Už. jméno</Typography>
            <TextField type='text' size='small' inputRef={usernameRef}></TextField>
            <Typography>Heslo</Typography>
            <TextField type="password" size='small' inputRef={passwordRef}></TextField>
            <Typography>Role</Typography>
            <Select size='small' inputRef={roleRef} defaultValue={"user"}>
                <MenuItem value={"user"}>User</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
            </Select>
        </DialogContent>
        <DialogActions>
            <Button variant='contained' onClick={()=>handleOpenDialog(false)}>Zrušit</Button>
            <Button variant='contained' onClick={()=>handleOkDialog()}>OK</Button>
        </DialogActions>
    </Dialog>
    )
}

export default AddUserDialog