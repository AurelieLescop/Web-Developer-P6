const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const rateLimit = require('express-rate-limit');


const sauceCtrl = require('../controllers/sauce');;
//const stuffCtrl = require('../controllers/sauce');;

/*app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
});*/

const limiter1 = rateLimit({
    windowMs: 10 * 60 * 1000, // Voici l’équivalent de 10 minutes
    max: 100 // Le client pourra donc faire 100 requêtes toutes les 10 minutes
  //   handler: function (req, res, /*next*/) {
  //     return res.status(429).json({
  //       error: 'You sent too many requests. Please wait a while then try again'
  //     })
  // }
  });

router.post('/', auth, limiter1, multer, sauceCtrl.createSauce);
router.put('/:id', auth, limiter1, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, limiter1, sauceCtrl.deleteSauce);
router.get('/:id', auth, limiter1, sauceCtrl.getOneSauce);
router.get('/', auth, limiter1, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, limiter1, sauceCtrl.likeDislikeSauce);

/*router.post('/', stuffCtrl.createThing);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);
router.get('/:id', stuffCtrl.getOneThing);
router.get('/', stuffCtrl.getAllThings);*/

module.exports = router;