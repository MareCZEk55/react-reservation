import React, { useMemo } from "react";
import {
  Calendar,
  momentLocalizer,
  Views,
  DateLocalizer,
  ViewProps,
  dateFnsLocalizer,
} from "react-big-calendar";
import moment from "moment";
import {format, parse, startOfWeek, getDay} from "date-fns";
import { cs } from "date-fns/locale"
import "./BigCalendar.css"
import PropTypes from 'prop-types'
import { Avatar } from "@mui/material";

const myEventsList = [
  {
    id: 0,
    title: "All Day Event very long title",
    allDay: true,
    start: new Date(2023, 2, 29),
    end: new Date(2023, 2, 29),
    resourceId: 1
  },
  {
    id: 1,
    title: "Long Event",
    start: new Date(2023, 2, 29),
    end: new Date(2023, 2, 29),
  },

  {
    id: 2,
    title: "DTS STARTS",
    start: new Date(2023, 2, 29, 10, 0, 0),
    end: new Date(2023, 2, 29, 11, 0, 0),
    resourceId: 1
  },

  {
    id: 3,
    title: "DTS ENDS",
    start: new Date(2023, 2, 29, 8, 0, 0),
    end: new Date(2023, 2, 29, 12, 0, 0),
    resourceId: 2
  },

  {
    id: 4,
    title: "Some Event",
    start: new Date(2023, 2, 29, 13, 0, 0),
    end: new Date(2023, 2, 29, 14, 30, 0),
    resourceId: 2
  },
];

interface IResource{
    resourceId: number,
    resourceTitle: string
}

const resources:IResource[] = [
    {resourceId: 1, resourceTitle: "Reditelstvi"},
    {resourceId: 2, resourceTitle: "Skolici"},
]

// const localizer = momentLocalizer(moment);
const locales = {
    "cs": cs,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})


const messages = {
    date: 'Datum',
    time: 'Čas',
    event: 'Událost',
    allDay: 'Celý den',
    week: 'Týden',
    work_week: 'Prac. týden',
    day: 'Den',
    month: 'Měsíc',
    previous: 'Zpět',
    next: 'Další',
    yesterday: 'Včera',
    tomorrow: 'Zítra',
    today: 'Dnes',
    agenda: 'Agenda',
    noEventsInRange: 'Žádné události',
  
    showMore: (total:any) => `+${total} více`,
}
const MyCustomHeader = ({label}:any)=> {
    return (
        <div>
            text:
            <div>{label}</div>
        </div>
    )
}
MyCustomHeader.propTypes = {
    label: PropTypes.string.isRequired,
  }

  const MyCustomGutterHeader = () =>{
    return(
        <>
            neco
        </>
    )
  }

  const MyCustomResourceHeader = ({label}:any)=>{
    return(
        <>
            neco dalsiho, {label}
        </>
    )
  }
  MyCustomResourceHeader.propTypes ={
    label: PropTypes.string.isRequired
  }


const MyCustomToolbar = () =>{
    return(
        <>
        
        </>
    )
}

function MyCalendar({ ...props }) {
    const {views} = useMemo(
        () => ({
            views: [Views.WORK_WEEK, Views.MONTH, Views.DAY, Views.AGENDA],
        }), []
    )

    const {components} = useMemo(
        ()=>({
        components:{
            month: { header: MyCustomHeader },
            timeGutterHeader: MyCustomGutterHeader,
            resourceHeader: MyCustomResourceHeader,
            // toolbar: MyCustomToolbar
        },
    }),[])

  return (
    <>
      <div style={{ height: 600 }} {...props}>
        <Calendar
          defaultDate={new Date()}
          localizer={localizer}
          events={myEventsList}
          step={30}
          views={views}
          defaultView={Views.DAY}
          culture="cs"
          messages={messages}
          resources={resources}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          max={new Date(1972,0,1,17,0,0)}
          min={new Date(1972,0,1,6,0,0)}
          popup
          tooltipAccessor={"title"}
          components={components}
        />
      </div>
    </>
  );
}

export default MyCalendar;
