const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const helmet = require('helmet');

const app = express();

const sauceRoutes = require('./routes/sauce');
//const stuffRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const path = require('path'); 

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

//app.use('/api/stuff', stuffRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(helmet());

module.exports = app;