const express = require("express");

const controllersCours = require("../controllers/cours-controllers");
const router = express.Router();

router.post("/", controllersCours.creerCours);
router.get("/:courseId", controllersCours.getCourseById);
router.patch("/:courseId", controllersCours.updateCourse);
router.delete("/:courseId", controllersCours.supprimerCours);
router.patch("/prof/:courseId", controllersCours.switchProfesseur);
module.exports = router;
