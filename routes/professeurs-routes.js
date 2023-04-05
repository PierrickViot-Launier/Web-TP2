const express = require("express");

const controllersProfesseur = require("../controllers/professeurs-controllers");
const router = express.Router();

router.post("/", controllersProfesseur.creerProfesseur);

router.get("/:professeurId", controllersProfesseur.getProfesseurById);

router.delete("/:professeurId", controllersProfesseur.supprimerProfesseur);

router.patch("/:professeurId", controllersProfesseur.updateProfesseur);

router.patch("/cours/:professeurId", controllersProfesseur.addCourse);

module.exports = router;
