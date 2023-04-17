import { login } from "../controllers/authControllers";

const express = require('express');
const router = express.Router();

router.post("/login", login);

module.exports = router;