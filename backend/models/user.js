/**Importation de mongoose */
const mongoose = require('mongoose');

/**Package de validation pour pré valider les informations avant de les enregistrer*/
const uniqueValidator = require('mongoose-unique-validator');

/**Création du schéma de connection utilisateur */
const userSchema = mongoose.Schema({
    //Le mot clef "unique" pour l'attribut email du schéma utilisateur userSchema permet de s'assurer que 2 utilisateurs ne puissent pas utiliser la même adresse
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

/**Exportation du schéma modèle*/
module.exports = mongoose.model('User', userSchema);
