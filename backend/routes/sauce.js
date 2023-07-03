/**Importation d'express pour créer le routeur */
const express = require('express');
/**Création d'un routeur avec la méthode router d'express */
const router = express.Router();
/**Importation du middleware d'authentification pour protéger les routes */
const auth = require('../middleware/auth');
/**Importation de multer pour l'ajout des images */
const multer = require('../middleware/multer-config');
/**Importation express-rate-limit pour la sécurisation*/
const rateLimit = require('express-rate-limit');
/**Importation de la logique des routes */
const sauceCtrl = require('../controllers/sauce');

/**Configuration limiteur de express-rate-limit */
const limiter1 = rateLimit({
    //équivalent de 10 minutes
    windowMs: 10 * 60 * 1000,
    //nombre de requête maximales dans le temps imparti
    max: 100
});

/**Application du middleware d'authentification à toutes les routes en tant qu'argument pour les protéger
 * Seules les requêtes authentifiées seront gérées
 * Application d'un limiteur du nombres de requêtes réalisées dans un temps imparti
 */
router.post('/', auth, limiter1, multer, sauceCtrl.createSauce);
router.put('/:id', auth, limiter1, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, limiter1, sauceCtrl.deleteSauce);
router.get('/:id', auth, limiter1, sauceCtrl.getOneSauce);
router.get('/', auth, limiter1, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, limiter1, sauceCtrl.likeDislikeSauce);

/**Exportation du routeur */
module.exports = router;