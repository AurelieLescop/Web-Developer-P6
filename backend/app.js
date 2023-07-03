/**Importation de mongoose qui facilite les intéractions avec la base de données MongoDB*/
const mongoose = require('mongoose');
/**Importation de dotenv qui stocke les variables d'environnement*/
const dotenv = require('dotenv');
dotenv.config();

/**Importation d'Express*/
const express = require('express');
/**Importation d'Helmet utilisé pour sécuriser les en-têtes */
const helmet = require('helmet');

/**La const app est l'application 
 * Appel de la méthode express*/
const app = express();

/**Importation des routes sauces */
const sauceRoutes = require('./routes/sauce');
/**Importation du routeur */
const userRoutes = require('./routes/user');

/**Importation de path donnant accès au chemin du système de fichiers */
const path = require('path');

/**Connexion à la base de données MongoDB */
mongoose.connect(
  process.env.SECRET_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

/** Gestion des problèmes CORS
 * Middleware qui sera appliqué à toutes les routes
 */
app.use((req, res, next) => {
  //Tout le monde peut accéder à l'API
  res.setHeader('Access-Control-Allow-Origin', '*');
  //Permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //Permet d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**Enregistrement du routeur */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

/**Exportation de la constante pour pouvoir y accéder dans les autres fichiers*/
module.exports = app;