const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

const creerProfesseur = async (requete, reponse, next) => {
  const { prenom, nom, dateEmbauche } = requete.body;

  let profExiste;

  try {
    profExiste = await Professeur.findOne({ nom: nom, prenom: prenom });
  } catch {
    return next(new HttpErreur("Échec vérification professeur existe", 500));
  }

  if (profExiste) {
    return next(new HttpErreur("Le professeur existe déjà", 422));
  }

  const nouveauProfesseur = new Professeur({
    prenom,
    nom,
    dateEmbauche,
    cours: [],
  });

  try {
    await nouveauProfesseur.save();
  } catch (err) {
    const erreur = new HttpErreur("Création de professeur échouée", 500);

    return next(erreur);
  }

  reponse.status(201).json({ professeur: nouveauProfesseur });
};

const getProfesseurById = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;

  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }

  if (!professeur) {
    return next(
      new HttpErreur("Aucun professeur trouvé pour l'id fourni", 404)
    );
  }

  reponse.json({ professeur: professeur.toObject({ getters: true }) });
};

const supprimerProfesseur = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;

  let professeur;

  try {
    professeur = await Professeur.findById(professeurId).populate("cours");
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );
  }

  if (!professeur) {
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try {
    // Supprimer le professeur du cours
    await professeur.remove();

    professeur.cours.professeur = null;

    await professeur.cours.save();
    // console.log(professeur.cours.professeur); // undefined
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );
  }

  reponse.status(200).json({ message: "Professeur supprimé" });
};

const updateProfesseur = async (requete, reponse, next) => {
  const { dateEmbauche } = requete.body;

  const professeurId = requete.params.professeurId;

  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);

    professeur.dateEmbauche = dateEmbauche;

    await professeur.save();
  } catch {
    new HttpErreur("Erreur lors de la mise à jour du professeur", 500);
  }

  reponse
    .status(200)
    .json({ professeur: professeur.toObject({ getters: true }) });
};

const addCourse = async (requete, reponse, next) => {
  const { cours } = requete.body;
  const professeurId = requete.params.professeurId;

  let professeur;

  try {
    // Ajouter un professeur a un cours
    professeur = await Professeur.findById(professeurId);

    professeur.cours.push(cours);

    await professeur.save();
  } catch {
    new HttpErreur("Erreur lors de l'ajout de cours", 500);
  }

  reponse
    .status(200)
    .json({ professeur: professeur.toObject({ getters: true }) });
};

exports.creerProfesseur = creerProfesseur;
exports.getProfesseurById = getProfesseurById;
exports.supprimerProfesseur = supprimerProfesseur;
exports.updateProfesseur = updateProfesseur;
exports.addCourse = addCourse;
