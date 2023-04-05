const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  DA: { type: String, required: true },
  cours: [{ type: String }],
  //   enseignant: {type: mongoose.Types.ObjectId, required: true, ref:"Professeur"}
});

module.exports = mongoose.model("Etudiant", etudiantSchema);
