import { useEffect, useState } from "react";
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import {
  FieldProps,
  DefaultRecourse,
  ProcessedEvent,
  EventActions,
  ViewEvent,
} from "@aldabil/react-scheduler/types";
import { cs } from "date-fns/locale";
import { Alert, AlertTitle, Avatar, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import "./Calendar.css";
import { IEvents2, IRooms2 } from "../src/interfaces/IDataEvents";
import axios from "axios";
import {
  translationProps,
  dayViewProps,
  weekViewProps,
  monthViewProps,
  resourceFieldsProp,
} from "./CalendarSettings";

function stringAvatar(name: string, barva?: string) {
  let childrenText = "";
  const delkaNazvu = name.split(" ").length;
  childrenText += name.split(" ")[0][0];
  if (delkaNazvu !== 1) {
    childrenText += name.split(" ")[1][0];
  }
  let barvaPozadi: string = barva ? barva : " #ff58d8";

  return {
    sx: {
      bgcolor: barvaPozadi,
      width: 30,
      height: 30,
    },
    children: childrenText,
  };
}



function getHead(tmp: DefaultRecourse): any {
  return (
    <>
      <Stack
        p={0}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Avatar {...stringAvatar(tmp.text as string, tmp.color)} />
        <Stack direction="column" justifyContent="center" spacing={1}>
          <Typography variant="subtitle1">{tmp.text}</Typography>
          {tmp.subtext?.length !== 0 ? (
            <Typography variant="caption">{tmp.subtext}</Typography>
          ) : null}
        </Stack>
      </Stack>
    </>
  );
}

async function handleGetEvents(query:ViewEvent, events: IEvents2[] ):Promise<ProcessedEvent[]> {
  return new Promise((res) => {
      res(events);
  });
}

function validateDates(dateStart:Date, dateEnd:Date):boolean {
  let retVal:boolean = true;
  if(isNaN(dateStart.valueOf()) || isNaN(dateEnd.valueOf())){
    retVal = false;
  }else if(dateStart >= dateEnd){
    retVal = false;
  }

  return retVal;
}

interface ICalendar {
  events: IEvents2[];
  rooms: IRooms2[];
  setEventGlobal: any;
}

function Calendar({ events, rooms, setEventGlobal }: ICalendar) {
  const { resourceViewMode, setResourceViewMode } = useScheduler();
  const { setEvents } = useScheduler();
  const [newEvent, setNewEvent] = useState<ProcessedEvent | null>(null);
  const [openAlertMessage, setOpenAlertMessage] = useState<boolean>(false);

  useEffect(() => {
    if (newEvent !== null) {
      let procEvent: ProcessedEvent[] = [];
      events.forEach((event) => {
        procEvent.push({
          title: event.title,
          start: event.start,
          end: event.end,
          event_id: event.event_id,
          assignee: event.assignee,
        });
      });
      //setEvents([...procEvent, newEvent]);
      setEventGlobal(newEvent);
    }
  }, [newEvent]);
  

  function getFields(rooms: IRooms2[]): FieldProps[] {
    let retVal: FieldProps[] = [
      {
        name: "assignee",
        type: "select",
        default: rooms[0].assignee,
        options: rooms.map((res) => {
          const tmpText: string =
            res.subtext?.length === 0 ? res.text : res.text + " - " + res.subtext;
          return {
            id: res.assignee,
            text: tmpText,
            value: res.assignee,
          };
        }),
        config: {
          label: "Místnost",
          required: true,
        },
      },
      {
        name: "subtitle",
        type: "input",
        config: {
          label: "Popisek",
          multiline: true,
          rows: 2,
        },
      },
    ];
    return retVal;
  }

  async function handleAddEvent(
    event: ProcessedEvent,
    action: EventActions,
    setNewEvent: any
  ): Promise<ProcessedEvent> {
    return new Promise(async (res, rej) => {
      if(!validateDates(event.start, event.end)){
        setOpenAlertMessage(true);
        return rej("Špatné data");
      }
      let response:any;
      try {
        if (action === "create") {
           response = await axios.post(
            `${import.meta.env.VITE_URL_BACKEND}/events/pridat-udalost`,
            {
              nazev: event.title,
              datum_zacatek: event.start,
              datum_konec: event.end,
              popis: event.subtitle,
              id_mistnost: event.assignee,
            }
          );
        } else {
           response = await axios.put(
            `${import.meta.env.VITE_URL_BACKEND}/events/uprav-udalost/${event.event_id}`,
            {
              nazev: event.title,
              datum_zacatek: event.start,
              datum_konec: event.end,
              popis: event.subtitle,
              id_mistnost: event.assignee,
            },
          );
        }
        res({ ...event, event_id: response.data.id, assignee: event.assignee, subtitle: event.subtitle});
      } catch (err) {
        rej(err);
      }
    });
  }
  
  async function handleDeleteEvent(
    id: string | number
  ): Promise<string | number | void> {
    let updatedID: number = typeof id === "string" ? parseInt(id) : id;
  
    return new Promise(async (resolve, reject) => {
      try {
        const urlString:string = `${import.meta.env.VITE_URL_BACKEND}/events/smaz-udalost/${updatedID}`;
        const response = await axios.delete(urlString);
      } catch (err) {
        reject(err);
      }
      resolve(updatedID);
    });
  }

  return (
    <div>
      <div>
        <Typography variant="body1">Styl zobrazení:</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            size="small"
            variant="contained"
            onClick={() => setResourceViewMode("tabs")}
          >
            Podle místností
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => setResourceViewMode("default")}
          >
            Všechny místnosti
          </Button>
        </Stack>
      </div>
      <div
        style={{
          maxHeight: "80vh",
          overflow: "scroll",
          overflowX: "hidden",
          // position: "sticky",
        }}
      >
        <Scheduler
          view="week"
          // events={events}
          getRemoteEvents={(query)=>handleGetEvents(query, events)}
          month={monthViewProps}
          week={weekViewProps}
          day={dayViewProps}
          hourFormat="24"
          locale={cs}
          translations={translationProps}
          resources={rooms}
          resourceViewMode="tabs"
          resourceFields={resourceFieldsProp}
          fields={getFields(rooms)}
          recourseHeaderComponent={(tmp) => getHead(tmp)}
          height={500}
          onConfirm={(event, action) =>
            handleAddEvent(event, action, setNewEvent)
          }
          onDelete={(id) => handleDeleteEvent(id)}
        />
      </div>

          <Snackbar open={openAlertMessage} 
              anchorOrigin={{vertical:"top", horizontal:"center"}}
              autoHideDuration={5000}              
              >
          <Alert severity="warning" onClose={()=>setOpenAlertMessage(false)}>
            <AlertTitle>Upozornění!</AlertTitle>
            Prověřte správnost údajů
          </Alert>
          </Snackbar>
    </div>
  );
}

export { Calendar };
