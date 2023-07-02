const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const rateLimit = require('express-rate-limit');


const sauceCtrl = require('../controllers/sauce');;
//const stuffCtrl = require('../controllers/sauce');;

const limiter1 = rateLimit({
    windowMs: 10 * 60 * 1000, // Voici l’équivalent de 10 minutes
    max: 100 // Le client pourra donc faire 100 requêtes toutes les 10 minutes
  });

router.post('/', auth, limiter1, multer, sauceCtrl.createSauce);
router.put('/:id', auth, limiter1, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, limiter1, sauceCtrl.deleteSauce);
router.get('/:id', auth, limiter1, sauceCtrl.getOneSauce);
router.get('/', auth, limiter1, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, limiter1, sauceCtrl.likeDislikeSauce);

module.exports = router;