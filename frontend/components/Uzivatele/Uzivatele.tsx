import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  csCZ,
} from "@mui/x-data-grid";
import axios from "axios";
import { Button, Grid } from "@mui/material";
import AddUserDialog from "./AddUserDialog";
import {IAddUserData} from "./IAddUserData"

const gridColumns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID"
    },
  {
    field: "username",
    headerName: "Už. jméno",
    editable: true,
  },
  {
    field: "role",
    headerName: "Role",
    editable: true,
  },
];

interface IUserRow{
    id: number,
    username: string,
    role: string
}



function Uzivatele() {
  const [rows, setRows] = useState<IUserRow[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [addUserData, setAddUserData] = useState<IAddUserData>();

    function handleSetOpenAddDialog(value:boolean){
        setOpenAddDialog(value);
    }

    async function handleSetAddUserData(value:IAddUserData){
        setAddUserData(value);

        try {
            const newUser = await axios.post(import.meta.env.VITE_URL_BACKEND+"/users/pridat-uzivatel",
            {
                username: value.username,
                password: value.password,
                role: value.role
            })

            console.log(newUser);
            setOpenAddDialog(false);
            setRows([...rows, 
                {username: newUser.data.username, 
                id: newUser.data.id, 
                role: newUser.data.role}])
        } catch (err) {
            console.log(err)
        }
    }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const users = await axios.get(
        import.meta.env.VITE_URL_BACKEND + "/users"
      );
      let rowArray: IUserRow[] = [];
      users.data.map((u: any) => {
        rowArray.push({
            id: u.id, 
            username: u.username, 
            role: u.roles.nazev
        });
      });
      setRows(rowArray);
    } catch (err) {
      console.log(err);
    }
  }


    function handlePridatUzivatele(): void {
        setOpenAddDialog(true);
    }

  return (
    <>
    <Grid container spacing={1}>
        <Grid item xs={9}>
    <DataGrid
      localeText={{
        ...csCZ.components.MuiDataGrid.defaultProps.localeText,
        columnHeaderSortIconLabel: "Setřídit",
      }}
      columns={gridColumns}
      rows={rows}
      hideFooter
      density="compact"
      disableColumnMenu
      autoHeight

      initialState={{
        columns:{
            columnVisibilityModel:{
                id: false
            }
        }
    }}
    />
    </Grid>
    <Grid item xs={3}>
    <Button variant="contained" size="small" onClick={()=> handlePridatUzivatele()}>Přidat uživatele</Button>
    </Grid>
    </Grid>
    <AddUserDialog openDialog={openAddDialog} handleOpenDialog={handleSetOpenAddDialog} userData={handleSetAddUserData}/>
    </>
  );
}

export default Uzivatele;
