/**importation de mongoose*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//*importation d'Express*/
const express = require('express');
const helmet = require('helmet');

//*la const app est l'application mais on appelle la méthode express*/
const app = express();

const sauceRoutes = require('./routes/sauce');
/**Importation du routeur */
const userRoutes = require('./routes/user');

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

/** pour régler les problèmes CORS
 * middleware qui sera appliqué à toutes les routes
 */
app.use((req, res, next) => {
  //tout le monde peut accéder à l'API
  res.setHeader('Access-Control-Allow-Origin', '*');
  //permet d'ajouter les headers mentionnés aux requêtes envoyées vers l'API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //permet d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**enregistrement du routeur */
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

//exportation de la constante pour pouvoir y accéder dans les autres fichiers
module.exports = app;