const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  DA: { type: String, required: true },
  cours: [{ type: mongoose.Types.ObjectId, ref: "Cours" }],
});

module.exports = mongoose.model("Etudiant", etudiantSchema);
