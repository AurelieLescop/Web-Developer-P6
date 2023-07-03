/**Importation de mongoose */
const mongoose = require('mongoose');

/**Création du schéma de données qui contient les champs souhaitées pour chaque sauce
 * Utilisation de la méthode "Schema"
 */
const sauceSchema = mongoose.Schema({
userId: {type: String, required: true},
name : {type: String, required: true},
manufacturer : {type: String, required: true},
description : {type: String, required: true},
mainPepper : {type: String, required: true},
imageUrl : {type: String, required: true},
heat : {type: Number, required: true},

likes : {type: Number, required: true, default: 0},
dislikes : {type: Number, required: true, default: 0},
usersLiked : {type: [String], required: true, default: []},
usersDisliked : {type: [String], required: true, default: []},
});

/**Exportation du modèle Mongoose
 * Utilisation de la méthode "model" pour transformer le modèle en modèle utilisable 
*/
module.exports = mongoose.model('Sauce', sauceSchema);