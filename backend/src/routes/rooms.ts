const express = require('express');
const router = express.Router();
import { addRoom, editRoomById, getMistnosti, deleteRoomById } from '../controllers/roomControllers';

router.get("/", getMistnosti)
router.post("/pridat-mistnost", addRoom)
router.put("/uprav-mistnost/:id", editRoomById)
router.delete("/smaz-mistnost/:id", deleteRoomById)

module.exports = router;