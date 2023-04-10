import { Request, Response } from "express";
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors())


app.get('/favicon.ico', (req:Request, res:Response) => res.status(204).end())


const eventsRoute = require('./src/routes/events')
const roomsRoute = require('./src/routes/rooms')

app.use("/events", eventsRoute)
app.use("/rooms", roomsRoute)


const port = process.env.PORT || 5100;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});