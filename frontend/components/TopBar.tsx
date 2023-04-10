import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton, Stack, useTheme } from "@mui/material";
import { ColorModeContext } from "../components/Contexts";

function TopBar() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

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
            <Button color="inherit">Přihlásit</Button>

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
    </Box>
  );
}

export default TopBar;
