const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coursSchema = new Schema({
  nom: { type: String, required: true },
  dateDebut: { type: String, required: true },
  dateFin: { type: String, required: true },
  enseignant: { type: String, required: true },
  etudiant: [{ type: String }],
  //   enseignant: {type: mongoose.Types.ObjectId, required: true, ref:"Professeur"}
});

module.exports = mongoose.model("Cours", coursSchema);
