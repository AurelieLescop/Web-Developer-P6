const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

const app = express();

const sauceRoutes = require('./routes/sauce');
//const stuffRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const path = require('path'); 

// const limiter1 = rateLimit({
//   windowMs: 10 * 60 * 1000, // Voici l’équivalent de 10 minutes
//   max: 100 // Le client pourra donc faire 100 requêtes toutes les 10 minutes
// //   handler: function (req, res, /*next*/) {
// //     return res.status(429).json({
// //       error: 'You sent too many requests. Please wait a while then try again'
// //     })
// // }
// });
 
//  Cette limite de 100 requêtes toutes les 10 minutes sera effective sur toutes les routes.
// app.use(limiter1);

// mongoose.connect('mongodb+srv://Lily:uxBLzmcRsOqJqrsC@cluster0.mzvepik.mongodb.net/?retryWrites=true&w=majority',
mongoose.connect(
  process.env.SECRET_DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// const limiter2 = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 5
// })

//app.use('/api/stuff', stuffRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

module.exports = app;