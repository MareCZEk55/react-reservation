import React, { useContext, useEffect, useRef, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import { Button, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../src/UserContext';
import { Roles } from '../src/interfaces/IUser';

interface ILoginDialogPanel{
    openDialog:boolean
    setOpenDialog:(value:boolean) => void,
}

function LoginDialogPanel( {openDialog, setOpenDialog} :ILoginDialogPanel ) {
    const usernameRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const [errorMesesage, setErrorMesesage] = useState<string>("");
    const { user, handleSetUser } = useContext(UserContext);

    useEffect(() => {
        if(openDialog){
            setErrorMesesage("")
        }
    }, [openDialog])
    

    function handleCloseDialog(event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void {
        if(reason === "backdropClick"){
            return;
        }
        setOpenDialog(false);
    }

    async function handlePrihlasitClick(){
        const username:string | undefined = usernameRef.current?.value;
        const password:string | undefined = passwordRef.current?.value;;
        const errMsg = validateInputFields(username, password);
        if(errMsg.length>0){
            setErrorMesesage(errMsg);
            return
        }

        try{
        const response = await axios.post(import.meta.env.VITE_URL_BACKEND+"/login",
        {
            username,
            password
        })
        
        handleSetUser({
            username: response.data.username,
            roleName: response.data.roles.nazev,
        })
        setOpenDialog(false);
        } catch(err:any){
            if(err.response.data.message !== undefined && err.response.data.message !== null){
                console.log(err.response.data.message)
                setErrorMesesage(err.response.data.message);
            }
            else{
                console.log(err)
            }
        }
    }

    function validateInputFields(username: string | undefined, password:string | undefined):string{
        let errorMsg = "";
        if(username === undefined || password === undefined){
            errorMsg = "Došlo k chybě prosím zkuste se znovu přilhásit"
        }else if(username.length === 0){
            errorMsg = "Chybí vyplněno už. jméno";
        }else if(password.length === 0){
            errorMsg = "Chybí vyplněno heslo";
        }
        return errorMsg;
    }

  return (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
                Přihlásit se
            </DialogTitle>
            <DialogContent>
                <Typography>Uživ. jméno</Typography>
                <TextField type='text' size='small' inputRef={usernameRef}/>
                <Typography>Heslo</Typography>
                <TextField type='password' size='small' inputRef={passwordRef} />
                <Typography sx={{paddingTop:"10px"}} color='error.main'>{errorMesesage}</Typography>
            </DialogContent>
            <DialogActions sx={{justifyContent:"space-between"}}>
                <Button variant='contained' onClick={()=>setOpenDialog(false)}>Zrušit</Button>
                <Button variant='contained' onClick={handlePrihlasitClick}>Přihlásit</Button>
            </DialogActions>
        </Dialog>
  )
}

export default LoginDialogPanel