import { NextFunction, Request, Response } from "express";
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors())


app.get('/favicon.ico', (req:Request, res:Response) => res.status(204).end())


const eventsRoute = require('./src/routes/events')
const roomsRoute = require('./src/routes/rooms')
const authRoute = require("./src/routes/auth")
const usersRoute = require("./src/routes/users")

app.use("/events", eventsRoute)
app.use("/rooms", roomsRoute)
app.use("/users", usersRoute)
app.use("/", authRoute)



app.use((err:any, req:Request, res:Response, next: NextFunction) => {
    console.error(err.stack)
    res.redirect('404')
})

const port = process.env.PORT || 5100;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});