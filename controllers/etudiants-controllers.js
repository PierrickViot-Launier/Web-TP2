const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");

const creerEtudiant = async (requete, reponse, next) => {
  const { prenom, nom, DA } = requete.body;

  //TODO: Empecher de recréer le meme etudiant

  const nouvelEtudiant = new Etudiant({
    prenom,
    nom,
    DA,
    cours: [],
  });

  try {
    await nouvelEtudiant.save();
  } catch {
    const erreur = new HttpErreur("Création d'étudiant échouée", 500);

    return next(erreur);
  }

  reponse.status(201).json({ etudiant: nouvelEtudiant });
};

const getEtudiantById = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch {
    new HttpErreur("Erreur lors de la récupération de l'étudiant", 500);
  }

  if (!etudiant) {
    return next(new HttpErreur("Aucun étudiant trouvé pour l'id fourni", 404));
  }

  reponse.json({ etudiant: etudiant.toObject({ getters: true }) });
};

const updateEtudiant = async (requete, reponse, next) => {
  const { DA } = requete.body;

  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);

    etudiant.DA = DA;

    await etudiant.save();
  } catch {
    new HttpErreur("Erreur lors de la mise à jour de l'étudiant", 500);
  }

  reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

const supprimerEtudiant = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant", 500)
    );
  }

  if (!etudiant) {
    return next(new HttpErreur("Impossible de trouver l'étudiant", 404));
  }

  try {
    await etudiant.remove();
    //TODO: Enlever l'etudiant d'un cours
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant", 500)
    );
  }

  reponse.status(200).json({ message: "Étudiant supprimée" });
};

const addCourse = async (requete, reponse, next) => {
  const { cours } = requete.body;

  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    //TODO: Ajouter etudiant a un cours
    etudiant = await Etudiant.findById(etudiantId);

    etudiant.cours.push(cours);

    await etudiant.save();
  } catch {
    new HttpErreur("Erreur lors de l'ajout de cours", 500);
  }

  reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

exports.creerEtudiant = creerEtudiant;
exports.getEtudiantById = getEtudiantById;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;
exports.addCourse = addCourse;
