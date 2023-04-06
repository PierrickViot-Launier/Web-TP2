const express = require("express");

const controllersCours = require("../controllers/cours-controllers");
const router = express.Router();

router.post("/", controllersCours.creerCours);

module.exports = router;
