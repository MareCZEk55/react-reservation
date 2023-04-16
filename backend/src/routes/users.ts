import { addUser, deleteUserById, editUserById, getUsers } from "../controllers/UserControllers";

const express = require('express');
const router = express.Router();

router.get("/", getUsers)
router.post("/pridat-uzivatel", addUser)
router.put("/uprav-uzivatel/:id", editUserById)
router.delete("/smaz-uzivatel/:id", deleteUserById)

module.exports = router;