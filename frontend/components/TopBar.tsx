import React, { MouseEvent, useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton, Stack, useTheme } from "@mui/material";
import { ColorModeContext } from "../components/Contexts";
import LoginDialogPanel from "../components/LoginDialogPanel";
import { UserContext } from "../src/UserContext";

function TopBar() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [openLogin, setOpenLogin] = useState(false);
  const {user, handleSetUser} = useContext(UserContext);

  function handlePrihlasitClick(): void {
    setOpenLogin(prev => !prev);
  }

  function handleSetOpenLogin(value:boolean):void{
    setOpenLogin(value);
  }

  function handleOdhlasitClick():void{
    handleSetUser(null)
  }

  useEffect(() => {

  }, [user])
  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense" sx={{ justifyContent: "space-between" }}>
          <div style={{flex:1}}>

          </div>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            Rezervace zasedačky
          </Typography>
          <div style={{flex:1, textAlign:"right"}}>
            {(user !== undefined && user?.username.length > 0)
            ? <Stack direction="column" alignItems="center" justifyContent="center" display="inline-flex">
            <Typography>Uživatel: {user?.username}</Typography>
            <Button color="inherit" onClick={()=> handleOdhlasitClick()}>Odhlásit</Button>
            </Stack>
            : <Button color="inherit" onClick={() => handlePrihlasitClick()}>Přihlásit</Button>
            }
            

            <IconButton
              sx={{ ml: 1 }}
              onClick={colorMode.toggleColorMode}
              color="inherit"
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <LoginDialogPanel openDialog={openLogin} setOpenDialog={handleSetOpenLogin} />
    </Box>
  );
}

export default TopBar;
