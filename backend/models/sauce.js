const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
 // title: { type: String, required: true },
  //description: { type: String, required: true },
  // imageUrl: { type: String, required: true },
  // userId: { type: String, required: true },
  //price: { type: Number, required: true },

   
userId: {type: String, required: true},
name : {type: String, required: true},
manufacturer : {type: String, required: true},
description : {type: String, required: true},
mainPepper : {type: String, required: true},
imageUrl : {type: String, required: true},
heat : {type: Number, required: true},

likes : {type: Number, required: true, default: 0},
// likes : {type: Number, required: true, default: 10},
dislikes : {type: Number, required: true, default: 0},
// dislikes : {type: Number, required: true, default: 20},
usersLiked : {type: [String], required: true, default: []},
usersDisliked : {type: [String], required: true, default: []},

// likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
// dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la
// sauce
// usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs
// qui ont aimé (= liked) la sauce
// usersDisliked : [ "String <userId>" ] — tableau des identifiants des
// utilisateurs qui n'ont pas aimé (= disliked) la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);