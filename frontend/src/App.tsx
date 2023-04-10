import React, { useEffect, useState } from "react";
import "./App.css";
import { Calendar } from "../components/Calendar";
import Mistnosti from "../components/Mistnosti/Mistnosti";
import CalendarAll from "../components/CalendarAll/CalendarAll";
import {
  Box,
  CircularProgress,
  CssBaseline,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import TopBar from "../components/TopBar";
import { ColorModeContext } from "../components/Contexts";
import TabPanel from "../components/TabPanel";
import { IEvents2, IRooms2 } from "./interfaces/IDataEvents";
import axios from "axios";
import Agenda from "../components/Agenda/Agenda";

function App() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");
  const [events, setEvents] = React.useState<IEvents2[]>([]);
  const [rooms, setRooms] = React.useState<IRooms2[]>([]);
  const [lodaingData, setLodaingData] = React.useState<boolean>(true);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  const [valueTabChange, setValueTabChange] = React.useState(0);
  function handleTabChange(event: React.SyntheticEvent, newValue: number) {
    setValueTabChange(newValue);
  }

  function getDateFromDB(value: string): Date {
    return new Date(value.slice(0, 19).replace("T", " "));
  }

  async function getData() {
    try {
      const [udalosti, mistnosti] = await Promise.all([
        axios.get(`${import.meta.env.VITE_URL_BACKEND}/events/udalosti`),
        axios.get(`${import.meta.env.VITE_URL_BACKEND}/events/mistnosti`),
      ]);

      const mistnostiArray: IRooms2[] = [];
      mistnosti.data.forEach((mistnost: any) => {
        mistnostiArray.push({
          room_id: mistnost.id,
          text: mistnost.nazev,
          subtext: mistnost.poznamka,
          assignee: mistnost.id,
          color: mistnost.barva,
        });
      });
      const udalostiArray: IEvents2[] = [];
      udalosti.data.forEach((udalost: any) => {
        udalostiArray.push({
          event_id: udalost.id,
          title: udalost.nazev,
          assignee: udalost.id_mistnost,
          subtitle: udalost.popis,
          start: getDateFromDB(udalost.datum_zacatek),
          end: getDateFromDB(udalost.datum_konec),
        });
      });
      setEvents(udalostiArray);
      setRooms(mistnostiArray);
    } catch (err) {
      console.log(err);
    } finally {
      setLodaingData(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {}, [lodaingData]);

  function handleSetEvents(event: IEvents2) {
    setEvents((prevEvents) => [...prevEvents, event]);
  }

  function handleSetRooms(room: IRooms2){
    if(rooms.find(r => r.room_id === room.room_id) === undefined){
      setRooms(prev => [...prev, room])
    }else{
    setRooms(
      rooms.map(prev => prev.room_id === room.room_id
        ? {...prev, text: room.text, color:room.color, subtext:room.subtext} 
        : prev)
    );
      }
  }

  if (lodaingData) {
    return (
      <>
        <CircularProgress />
        <Typography variant="h5">Načítání...</Typography>
      </>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <TopBar />

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={valueTabChange}
              onChange={handleTabChange}
              variant="scrollable"
            >
              <Tab label="Kalendář 1" />
              <Tab label="Kalendář 2" />
              <Tab label="Agenda" />
              <Tab label="Místnosti" />
            </Tabs>
          </Box>
          <TabPanel value={valueTabChange} index={0}>
              <Calendar
                events={events}
                rooms={rooms}
                setEventGlobal={handleSetEvents}
              />
          </TabPanel>
          <TabPanel value={valueTabChange} index={1}>
            <CalendarAll events={events} rooms={rooms} />
          </TabPanel>
          <TabPanel value={valueTabChange} index={2}>
            <Agenda udalosti={events} mistnosti={rooms} />
          </TabPanel>
          <TabPanel value={valueTabChange} index={3}>
            <Mistnosti rooms={rooms} setRooms={handleSetRooms}/>
          </TabPanel>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
