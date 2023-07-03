const mongoose = require('mongoose');
/**package de validation car les erreurs générées par défaut par MongoDB peuvent être difficiles à résoudre
 * package de validation pour pré valider les informations avant de les enregistrer
 */
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    //le mot clef unique pour l'attribut email du schéma utilisateur userSchema permet de s'assurer que 2 utilisateurs ne puissent pas utiliser la même adresse
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
