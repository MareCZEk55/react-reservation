const express = require('express');
const router = express.Router();
import { prisma } from '../../db';
import {addEvent, editEventById, getEvents, deleteEventById} from '../controllers/eventControllers';

router.get("/udalosti", getEvents)
router.post("/pridat-udalost", addEvent)
router.put("/uprav-udalost/:id", editEventById)
router.delete("/smaz-udalost/:id", deleteEventById)

router.get("/mistnosti", async (req, res)=>{
    const events = await prisma.mistnosti.findMany();

    res.json(events)
})




module.exports = router;