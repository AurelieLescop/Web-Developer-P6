const Thing = require('../models/thing');
const fs = require('fs');

// changer Thing en sauce
exports.createThing = (req, res, next) => {
// function createThing(req, res, next) {

    //const thingObject = JSON.parse(req.body.thing);
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    delete thingObject._userId;
   const thing = new Thing({
    // const sauce = new Sauce({

        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    thing.save()
   //sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

// exports.createThing = createThing;

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
     //   ...JSON.parse(req.body.thing),
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete thingObject._userId
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
};

//app.use('/api/stuff', (req, res, next) => {
//    const stuff = [
/*app.get('/api/sauces', (req, res, next) => {
    Thing.find()
});*/
//app.use('/api/stuff', (req, res, next) => {

exports.getAllThings = (req, res, next) => {
    Thing.find()
        .then(things => res.status(200).json(things))
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

/*
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