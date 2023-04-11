const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coursSchema = new Schema({
  nom: { type: String, required: true },
  dateDebut: { type: String, required: true },
  dateFin: { type: String, required: true },
  professeur: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Professeur",
  },
  etudiant: [{ type: mongoose.Types.ObjectId, ref: "Etudiant" }],
});

module.exports = mongoose.model("Cours", coursSchema);
