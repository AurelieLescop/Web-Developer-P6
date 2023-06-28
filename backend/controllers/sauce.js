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
        // const sauce = new Sauce({

        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        //sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// exports.createThing = createThing;

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        //   ...JSON.parse(req.body.thing),
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
                // if (filename == sauceObject.filename)
                if (sauce.imageUrl == req.body.sauce.imageUrl) { // attention aux noms sauce
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                        .catch(error => res.status(401).json({ error }));
                } else {
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
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

//app.use('/api/stuff', (req, res, next) => {
//    const stuff = [
/*app.get('/api/sauces', (req, res, next) => {
    Thing.find()
});*/
//app.use('/api/stuff', (req, res, next) => {

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

/* fonctionne - pas erruer ds terminal
exports.likeDislikeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    
    Thing.findOne({ _id: req.params.id })
    .then(things => res.status(200).json(things))
    .catch(error => res.status(404).json({ error }));
}
*/

const LIKE_SAUCE = 1;
const DISLIKE_SAUCE = -1;
const CANCEL_LIKE_DISLIKE = 0; 

//essai 3 - échec
exports.likeDislikeSauce = (req, res, next) => {
    const likeDislikeStatus = req.body.like;
    const userId = req.body.userId; //let votant
    //const sauceId = req.params.id;

    let vote;//valueVote

    // determine si l'utilisateur est dans un tableau


    Sauce.findOne({ _id: req.params.id })
        // .then((thing) => {
        .then((sauce) => {

            if (likeDislikeStatus == LIKE_SAUCE) {
                //likeSauce(sauce.id, userId)

            } else if (likeDislikeStatus == DISLIKE_SAUCE) {
                //dislikeSauce(sauce.id, userId)

            } else {
                let indexLike = sauce.usersLiked.findIndex(s => s == userId)
                let indexDislike = sauce.usersDisliked.findIndex(s => s == userId)
                if (indexLike > -1) {
                    // cancelLike
                    //updateone, décrement like et enlève tableau usersLiked 
                } else if (indexDislike > -1) {
                    //cancelDislike

                }
            }



        //     let userVotedLike = sauce.usersLiked.includes(userId);//bon
        //     let userVotedDislike = sauce.usersDisliked.includes(votant);//mauvais
        //     // ce comparateur va attribuer une valeur de point en fonction du tableau dans lequel il est
        //     if (userVotedLike === true) {
        //         vote = 1;
        //     } else if (userVotedDislike === true) {
        //         vote = -1;
        //     } else {
        //         vote = 0;
        //     }
            

        //     if (vote === 0 && likeDislikeStatus === 1) {
                // Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
        //             .then(() => res.status(201).json({ message: 'you liked this sauce' }))
        //             .catch(error => res.status(400).json({ error }))
        //     } else if (vote === 0 && likeDislikeStatus === -1) {
        //         Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
        //             .then(() => res.status(201).json({ message: 'you doesn\'t like this sauce' }))
        //             .catch(error => res.status(400).json({ error }))
        //     } else if (valeurVote === 1 && likeDislikeStatus === 0) {
        //         Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
        //             .then(() => res.status(201).json({ message: 'you have no opinion on this sauce' }))
        //             .catch(error => res.status(400).json({ error }))
        //     } else if (valeurVote === -1 && likeDislikeStatus === 0) {
        //         Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
        //             .then(() => res.status(201).json({ message: 'you have no opinion on this sauce' }))
        //             .catch(error => res.status(400).json({ error }))
        //     }
        })
        .catch(error => res.status(404).json({ error }))
}

/* //essai 2 echec
// https://stackoverflow.com/questions/74645895/like-dislike-system-with-nodejs
exports.likeDislikeSauce = (req, res, next) => {  
    //   const liker = req.body.userId;
    const userId = req.body.userId;
    // let likeStatus = req.body.like;
    let likeDislikeStatus = req.body.like;
    //   sauce.findOne({ _id: req.params.id })
      thing.findOne({ _id: req.params.id })
        .then(() => {  
        //   if (likeStatus === 1) {
          if (likeDislikeStatus === 1) {
            // sauce.updateOne({ _id:req.params.id }, { $push: { usersLiked: liker }, $inc: { likes:1 }})
            thing.updateOne({ _id:req.params.id }, { $push: { usersLiked: userId }, $inc: { likes:1 }})
              .then(() => res.status(201).json({ message: 'you liked this sauce' }))
              .catch(error => res.status(400).json({ error }))
        //   } else if (likeStatus === -1) {
          } else if (likeDislikeStatus === -1) {
            // sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: liker }})
            thing.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId }})
              .then(() => res.status(201).json({ message: 'you disliked this sauce' }))
              .catch(error => res.status(400).json({ error }))
        //   } else if (likeStatus === 0) {
          } else if (likeDislikeStatus === 0) {
            if(usersLiked.includes(userId)){
                sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1}, $pull: { usersLiked:liuserId}})
              } else if (usersDisliked.includes(userId)){
                sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: -1}, $pull: { usersDisliked:userId}})
              }
          }
        })
        .catch(error => res.status(400).json({ error }))
    };
    
    
    /* essai perso - ne fonctionne pas
    exports.likeDislikeSauce = (req, res, next) => {
        const like = req.body.like;
        const userId = req.body.userId;
        const sauceId = req.params.id;
        
        Thing.findOne({ _id: req.params.id })
        .then((thing)) => {
           if (like ===1) {
            thing.usersLiked.push(userId);
            }
        .catch(error => res.status(404).json({ error }));
        
    }


/*
//essai 1 - stackoverflow - ne fonctionne pas
exports.likeDislikeSauce = (req, res, next) => {  
//   const liker = req.body.userId;
const userId = req.body.userId;
// let likeStatus = req.body.like;
let likeDislikeStatus = req.body.like;
//   sauce.findOne({ _id: req.params.id })
  thing.findOne({ _id: req.params.id })
    .then((votedSauce) => {  
    //   if (likeStatus === 1) {
      if (likeDislikeStatus === 1) {
        // sauce.updateOne({ _id:req.params.id }, { $push: { usersLiked: liker }, $inc: { likes:1 }})
        thing.updateOne({ _id:req.params.id }, { $push: { usersLiked: userId }, $inc: { likes:1 }})
          .then(() => res.status(201).json({ message: 'you liked this sauce' }))
          .catch(error => res.status(400).json({ error }))
    //   } else if (likeStatus === -1) {
      } else if (likeDislikeStatus === -1) {
        // sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: liker }})
        thing.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId }})
          .then(() => res.status(201).json({ message: 'you disliked this sauce' }))
          .catch(error => res.status(400).json({ error }))
    //   } else if (likeStatus === 0) {
      } else if (likeDislikeStatus === 0) {
        // if (votedSauce.usersLiked.includes(liker)) {
        if (votedSauce.usersLiked.includes(userId)) {
        //   sauce.update({ _id: req.params.id }, { $inc: { likes:  -1 }, $pull: { usersLiked: liker }})
          thing.update({ _id: req.params.id }, { $inc: { likes:  -1 }, $pull: { usersLiked: userId }})
            .then(() => res.status(201).json({ message:'you un-liked this sauce' }))
            .catch(error => res.status(400).json({ error }))
        //   } else if (votedSauce.usersDisliked.includes(liker)) {
          } else if (votedSauce.usersDisliked.includes(userId)) {
            // sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: liker }})
            thing.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }})
            .then(() => res.status(201).json({ message:'you un-disliked this sauce' }))
            .catch(error => res.status(400).json({ error }))
          }
      }
    })
    .catch(error => res.status(400).json({ error }))
};
*/

/* essai perso - ne fonctionne pas
exports.likeDislikeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    
    Thing.findOne({ _id: req.params.id })
    .then((thing)) => {
       if (like ===1) {
        thing.usersLiked.push(userId);
        }
    .catch(error => res.status(404).json({ error }));
    
}
*/

/* stackoverflow - solution d'origine
exports.likeSauce = (req, res, next) => {  
  const liker = req.body.userId;
  let likeStatus = req.body.like;
  sauce.findOne({ _id: req.params.id })
    .then((votedSauce) => {  
      if (likeStatus === 1) {
        sauce.updateOne({ _id:req.params.id }, { $push: { usersLiked: liker }, $inc: { likes:1 }})
          .then(() => res.status(201).json({ message: 'you liked this sauce' }))
          .catch(error => res.status(400).json({ error }))
      } else if (likeStatus === -1) {
        sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: liker }})
          .then(() => res.status(201).json({ message: 'you disliked this sauce' }))
          .catch(error => res.status(400).json({ error }))
      } else if (likeStatus === 0) {
        if (votedSauce.usersLiked.includes(liker)) {
          sauce.update({ _id: req.params.id }, { $inc: { likes:  -1 }, $pull: { usersLiked: liker }})
            .then(() => res.status(201).json({ message:'you un-liked this sauce' }))
            .catch(error => res.status(400).json({ error }))
          } else if (votedSauce.usersDisliked.includes(liker)) {
            sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: liker }})
            .then(() => res.status(201).json({ message:'you un-disliked this sauce' }))
            .catch(error => res.status(400).json({ error }))
          }
      }
    })
    .catch(error => res.status(400).json({ error }))
};*/



