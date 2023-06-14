const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');;
//const stuffCtrl = require('../controllers/sauce');;

/*app.post('/api/stuff', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
});*/
router.post('/', sauceCtrl.createThing);
router.put('/:id', sauceCtrl.modifyThing);
router.delete('/:id', sauceCtrl.deleteThing);
router.get('/:id', sauceCtrl.getOneThing);
router.get('/', sauceCtrl.getAllThings);

/*
router.post('/', stuffCtrl.createThing);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);
router.get('/:id', stuffCtrl.getOneThing);
router.get('/', stuffCtrl.getAllThings);
*/
module.exports = router;