const express = require("express");

const controllersEtudiant = require("../controllers/etudiants-controllers");
const router = express.Router();

router.post("/", controllersEtudiant.creerEtudiant);

router.get("/:etudiantId", controllersEtudiant.getEtudiantById);

router.patch("/:etudiantId", controllersEtudiant.updateEtudiant);

router.delete("/:etudiantId", controllersEtudiant.supprimerEtudiant);

router.patch("/cours/:etudiantId", controllersEtudiant.addCourse);

module.exports = router;
