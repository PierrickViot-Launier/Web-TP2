const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Etudiant = require("../models/etudiant");
const Professeur = require("../models/professeur");

const creerCours = async (requete, reponse, next) => {
  const { nom, dateDebut, dateFin, professeur } = requete.body;

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

exports.creerCours = creerCours;
