import {
  Translations,
  FieldProps,
  DefaultRecourse,
  ProcessedEvent,
  EventActions,
  SchedulerProps,
} from "@aldabil/react-scheduler/types";
import { MonthProps } from "@aldabil/react-scheduler/views/Month";
import { WeekProps } from "@aldabil/react-scheduler/views/Week";
import { DayProps } from "@aldabil/react-scheduler/views/Day";

export const translationProps: Translations = {
  navigation: {
    month: "Měsíc",
    week: "Týden",
    day: "Den",
    today: "Dnes",
  },
  form: {
    addTitle: "Přidat rezervaci",
    editTitle: "Upravit",
    confirm: "Potvrdit",
    delete: "Odstranit",
    cancel: "Zrušit",
  },
  event: {
    title: "Název",
    start: "Začátek",
    end: "Konec",
    allDay: "Celý den",
  },
  loading: "Načítání...",
  moreEvents: "Více...",
};


export const monthViewProps: MonthProps = {
    weekDays: [0, 1, 2, 3, 4, 5, 6],
    weekStartOn: 1,
    startHour: 6,
    endHour: 17,
    navigation: true,
};
  
export  const weekViewProps: WeekProps = {
    weekDays: [0, 1, 2, 3, 4],
    weekStartOn: 1,
    startHour: 6,
    endHour: 17,
    step: 30,
    navigation: true,
};
  
export  const dayViewProps: DayProps = {
    startHour: 6,
    endHour: 17,
    step: 30,
    navigation: true,
};

export const resourceFieldsProp = {
    idField: "assignee",
    textField: "text",
    subTextField: "subtext",
    avatarField: "avatar",
    colorField: "color",
  };