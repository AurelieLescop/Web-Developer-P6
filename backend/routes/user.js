/**Importation d'Express*/
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
/**Importation de express-rate-limit pour limiter le nombre de requête*/
const rateLimit = require('express-rate-limit');

/**Définition de la limitation de requête */
const limiter2 = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30
})

/**Interception des requêtes post d'inscription et d'authentification */
router.post('/signup', limiter2, userCtrl.signup);
router.post('/login', limiter2, userCtrl.login);

module.exports = router;