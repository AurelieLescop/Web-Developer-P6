const Sauce = require('../models/sauce');
const fs = require('fs');

// changer Thing en sauce
exports.createSauce = (req, res, next) => {
    // function createThing(req, res, next) {
    //const thingObject = JSON.parse(req.body.thing);
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

function updateSauce(req, res, sauceObject) {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
        .catch(error => res.status(401).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                if (sauceObject.imageUrl == undefined) { 
                    updateSauce(req, res, sauceObject);
                } else {
                    fs.unlink(`images/${filename}`, () => {
                        updateSauce(req, res, sauceObject);
                    })
                };
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

const LIKE_SAUCE = 1;
const DISLIKE_SAUCE = -1;
const CANCEL_LIKE_DISLIKE = 0;

function likeSauce(req, res, userId) {
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
        .then(() => res.status(201).json({ message: 'you liked this sauce' }))
        .catch(error => res.status(400).json({ error }))
}

function dislikeSauce(req, res, userId) {
    Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
        .then(() => res.status(201).json({ message: 'you doesn\'t like this sauce' }))
        .catch(error => res.status(400).json({ error }))
}

function cancelLike(req, res, userId) {
    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
        .then(() => res.status(201).json({ message: 'you have no opinion on this sauce' }))
        .catch(error => res.status(400).json({ error }))
}

function cancelDislike(req, res, userId) {
    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
        .then(() => res.status(201).json({ message: 'you have no opinion on this sauce' }))
        .catch(error => res.status(400).json({ error }))
}

//en cours
exports.likeDislikeSauce = (req, res, next) => {
    const likeDislikeStatus = req.body.like;
    const userId = req.body.userId; //let votant

    let vote;//valueVote

      Sauce.findOne({ _id: req.params.id })
        // .then((thing) => {
        .then((sauce) => {

            if (likeDislikeStatus == LIKE_SAUCE) {
                likeSauce(req, res, userId);

            } else if (likeDislikeStatus == DISLIKE_SAUCE) {
                dislikeSauce(req, res, userId);

            } else {
                let indexLike = sauce.usersLiked.findIndex(s => s == userId)
                let indexDislike = sauce.usersDisliked.findIndex(s => s == userId)
                if (indexLike > -1) {
                    cancelLike(req, res, userId);
                } else if (indexDislike > -1) {
                    cancelDislike(req, res, userId);
                } else {
                  res.status(400).json({ error : "the user is not liking or disliking the sauce"})
                }
            }
        })
        .catch(error => res.status(404).json({ error }))
}



