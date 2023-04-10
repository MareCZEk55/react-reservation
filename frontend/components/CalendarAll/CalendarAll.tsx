import { useEffect } from "react";
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import {
  FieldProps,
  ProcessedEvent,
  ViewEvent,
} from "@aldabil/react-scheduler/types";
import { cs } from "date-fns/locale";
import "../Calendar.css";
import { IEvents2, IRooms2 } from "../../src/interfaces/IDataEvents";
import {
  translationProps,
  dayViewProps,
  weekViewProps,
  monthViewProps,
} from "../CalendarSettings";
import { Avatar, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";

async function handleGetEvents(
  query: ViewEvent,
  events: IEvents2[]
): Promise<ProcessedEvent[]> {
  return new Promise((res) => {
    res(events);
  });
}

interface ICalendar {
  events: IEvents2[];
  rooms: IRooms2[];
}

function CalendarAll({ events, rooms }: ICalendar) {
  const { resourceViewMode, setResourceViewMode } = useScheduler();

  useEffect(() => {
    events.forEach(ev => {
        let barva:string = "blue"
        
        const findRoom = rooms.find(room=>room.assignee === ev.assignee);
        if(findRoom !== undefined && findRoom.color !== undefined) {
            barva = findRoom.color;
        }
        ev.color = barva;
    });
}, []);

function getViewerExtraComponents(fields: FieldProps[], event:ProcessedEvent){
  let text:string = event.subtitle.length > 0 ? `Popis: ${event.subtitle}` : ""  
  return (
      <Typography
        color="textSecondary"
        variant="caption"
        noWrap>
        {text}
      </Typography>
    )
  
}

  function getEventRenderer(event: ProcessedEvent): JSX.Element | null {
    const rozdilCasuMs:number = event.end.getTime() - event.start.getTime();
    const rozdilCasuMin:number = rozdilCasuMs / 1000 / 60
    if(rozdilCasuMin <= 30 ){
      return(
        <div>{event.title}</div>
      )
    }else{
      return null;
    }

  }

  return (
    <div>
      <div>
        <Typography>Zde jsou zobrazeny všechny události v jednom kalendáři.</Typography>
        <Typography>Tento kalendář slouží pouze pro náhled.</Typography>
      </div>
      <Divider variant="middle" sx={{m:1}}/>
        <Stack direction="row">
            <>
            {rooms.map(room =>  (
                <React.Fragment key={room.room_id}>
                    <Stack direction="column" justifyContent="center" spacing={1}
                        sx={{backgroundColor: room.color}} p={1}
                        >
                      <Typography variant="subtitle1">{room.text}</Typography>
                      {room.subtext?.length !== 0 ? (
                        <Typography variant="caption">{room.subtext}</Typography>
                    ) : null}
                    </Stack>
                </React.Fragment>
                )
            )}
            </>
        </Stack>
      <div
        style={{
          maxHeight: "80vh",
          overflow: "scroll",
          overflowX: "hidden",
        }}
      >
        <Scheduler
          view="week"
          getRemoteEvents={(query) => handleGetEvents(query, events)}
          month={monthViewProps}
          week={{...weekViewProps, cellRenderer:({...props})=>{
            return(
                <Button
                style={{
                    cursor: "default"
                }}
                onClick={()=> {
                    return;
                }}
                disableRipple={true}
                >

                </Button>
            )
        }}}
          day={{...dayViewProps, cellRenderer:({...props})=>{
            return(
                <span>
                <Button
                style={{
                    cursor: "default"
                }}
                onClick={()=> {
                    return;
                }}
                disableRipple={true}
                >

                </Button>
                </span>
            )
        }}}
          hourFormat="24"
          locale={cs}
          translations={translationProps}
          height={500}
          editable={false}
          deletable={false}
          draggable={false}
          viewerExtraComponent={(fields, event) => getViewerExtraComponents(fields, event)}
          eventRenderer={(event) => getEventRenderer(event)}
        />
      </div>
    </div>
  );
}

export default CalendarAll;
