const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Etudiant = require("../models/etudiant");
const Professeur = require("../models/professeur");

const creerCours = async (requete, reponse, next) => {
  const { nom, dateDebut, dateFin, professeur } = requete.body;

  let coursExiste;

  try {
    coursExiste = await Cours.findOne({ nom: nom });
  } catch {
    return next(new HttpErreur("Échec vérification cours existe", 500));
  }

  if (coursExiste) {
    return next(new HttpErreur("Le cours existe déjà", 422));
  }

  const nouveauCours = new Cours({
    nom,
    dateDebut,
    dateFin,
    professeur,
    etudiant: [],
  });

  let prof;

  try {
    prof = await Professeur.findById(professeur);
  } catch {
    return next(new HttpErreur("Erreur lors de la création du cours", 500));
  }

  if (!prof) {
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try {
    await nouveauCours.save();

    prof.cours.push(nouveauCours);

    await prof.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la création du cours", 500));
  }

  reponse.status(201).json({ cours: nouveauCours.toObject({ getters: true }) });
};

const getCourseById = async (requete, reponse, next) => {
  const courseId = requete.params.courseId;

  let cours;

  try {
    cours = await Cours.findById(courseId);
  } catch (err) {
    return next(new HttpErreur("Erreur lors de la récupération du cours", 500));
  }

  if (!cours) {
    return next(new HttpErreur("Aucun cours trouvé pour l'id fourni", 404));
  }

  reponse.json({ cours: cours.toObject({ getters: true }) });
};

const updateCourse = async (requete, reponse, next) => {
  const { dateDebut, dateFin } = requete.body;

  const courseId = requete.params.courseId;

  let cours;

  try {
    cours = await Cours.findById(courseId);

    cours.dateDebut = dateDebut;
    cours.dateFin = dateFin;

    await cours.save();
  } catch {
    new HttpErreur("Erreur lors de la mise à jour du cours", 500);
  }

  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};

const supprimerCours = async (requete, reponse, next) => {
  const courseId = requete.params.courseId;

  let cours1;

  try {
    cours1 = await Cours.findById(courseId)
      .populate("professeur")
      .populate("etudiant");
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }

  if (!cours1) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try {
    await cours1.remove();

    cours1.professeur.cours.pull(cours1);

    for (let i = 0; i < cours1.etudiant.length; i++) {
      cours1.etudiant[i].cours.pull(cours1);

      await cours1.etudiant[i].save();
    }

    await cours1.professeur.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }

  reponse.status(200).json({ message: "Cours supprimé" });
};

const switchProfesseur = async (requete, reponse, next) => {
  const { professeur } = requete.body;

  const courseId = requete.params.courseId;

  let cours, prof;

  try {
    cours = await Cours.findById(courseId).populate("professeur");

    prof = await Professeur.findById(professeur);
  } catch {
    return next(new HttpErreur("Erreur lors de la modification du cours", 500));
  }

  if (!cours) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  if (!prof) {
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try {
    cours.professeur.cours.pull(cours);

    cours.professeur.save();

    cours.professeur = prof;

    prof.cours.push(cours);

    cours.save();

    prof.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la modification du cours", 500));
  }

  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};

let cours;

exports.creerCours = creerCours;
exports.getCourseById = getCourseById;
exports.updateCourse = updateCourse;
exports.supprimerCours = supprimerCours;
exports.switchProfesseur = switchProfesseur;
