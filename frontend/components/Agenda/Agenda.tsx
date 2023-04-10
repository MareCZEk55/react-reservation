import React, { useEffect, useRef, useState } from "react";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from "@mui/material";
import { styled } from "@mui/system";
import { IEvents2, IRooms2 } from "../../src/interfaces/IDataEvents";

const headerTitles: string[] = [
  "Datum začátek",
  "Datum konec",
  "Místnost",
  "Událost",
  "Popis",
];

interface IAgendaProp {
  udalosti: IEvents2[];
  mistnosti: IRooms2[];
}

interface IRadkyTabulky {
  id: number;
  datum_zacatek: Date;
  datum_konec: Date;
  mistnost: string;
  udalost: string;
  popis?: string;
}

function Agenda({ udalosti, mistnosti }: IAgendaProp) {
  const [radkyTabulky, setRadkyTabulky] = useState<IRadkyTabulky[]>([]);
  const effectCalled = useRef<boolean>(false);
  const [pouzeBudouciFiltr, setPouzeBudouciFiltr] = useState<boolean>(true);
  const [filtrRadkyTabulky, setFiltrRadkyTabulky] = useState<IRadkyTabulky[]>(
    []
  );

  useEffect(() => {
    if (effectCalled.current) {
      return;
    }
    udalosti.forEach((udalost, index) => {
      let mistnostText: string | undefined = mistnosti.find(
        (mistnost) => mistnost.assignee === udalost.assignee
      )?.text;
      if (mistnostText === undefined) {
        mistnostText = "";
      }

      let radek: IRadkyTabulky = {
        id: index,
        datum_zacatek: udalost.start,
        datum_konec: udalost.end,
        mistnost: mistnostText,
        udalost: udalost.title,
        popis: udalost.subtitle,
      };
      setRadkyTabulky((prevRadky) => [...prevRadky, radek]);
      effectCalled.current = true;
    });
    setFiltrRadkyTabulky(radkyTabulky);
  }, []);

  useEffect(() => {
    let filtrovaneRadky: IRadkyTabulky[] = [];
    if (pouzeBudouciFiltr) {
      filtrovaneRadky = radkyTabulky.filter(
        (radek) => radek.datum_zacatek >= new Date()
      );
    } else {
      filtrovaneRadky = radkyTabulky;
    }
    setFiltrRadkyTabulky(filtrovaneRadky);
  }, [pouzeBudouciFiltr, radkyTabulky]);

  function handleFiltrPouzeBudouci() {
    setPouzeBudouciFiltr((prev) => !prev);
  }

  function formatDateToTable(date: Date): string {
    let retVal: string = "";
    retVal =
      date.getDate() +
      "." +
      (date.getMonth() + 1) +
      "." +
      date.getFullYear().toString().substring(2) +
      " " +
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");

    return retVal;
  }

  const CustomTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== "datum",
  })<{ datum?: Date }>(({ theme, datum }) => {
    let barvaPisma: string = "red";
    if (datum !== undefined) {
      barvaPisma = datum >= new Date() ? "black" : "grey";
    }

    return {
      "& td": {
        color: barvaPisma,
      },
    };
  });

  return (
    <>
      <div style={{ textAlign: "left" }}>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              onChange={() => handleFiltrPouzeBudouci()}
            />
          }
          label="Pouze budoucí"
        />
      </div>
      <Divider />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ font: { color: "red" } }}>
              {headerTitles.map((title) => (
                <TableCell key={title} sx={{ fontWeight: "bold" }}>
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrRadkyTabulky.map((radek) => (
              <CustomTableRow key={radek.id} datum={radek.datum_zacatek}>
                <TableCell
                  sx={{
                    color: radek.datum_zacatek >= new Date() ? "black" : "grey",
                  }}
                >
                  {formatDateToTable(radek.datum_zacatek)}
                </TableCell>
                <TableCell>{formatDateToTable(radek.datum_konec)}</TableCell>
                <TableCell>{radek.mistnost}</TableCell>
                <TableCell>{radek.udalost}</TableCell>
                <TableCell>{radek.popis}</TableCell>
              </CustomTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Agenda;
