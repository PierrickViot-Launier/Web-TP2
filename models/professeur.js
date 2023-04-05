const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const professeurSchema = new Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  dateEmbauche: { type: String, required: true },
  cours: [{ type: String }],
  // cours: {type: mongoose.Types.ObjectId,  ref:"Cours"}
});

module.exports = mongoose.model("Professeur", professeurSchema);
