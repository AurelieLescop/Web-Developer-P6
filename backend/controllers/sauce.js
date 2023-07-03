const Sauce = require('../models/sauce');
const fs = require('fs');

/**
 * 
 * @param {*} req la requête envoyée par l'utilisateur qui contient toutes les informations de la nouvelle sauce
 * qui va être ajouté à la base de données 
 * @param {*} res la réponse
 * @param {*} next pour passer au prochain middleware
 */
exports.createSauce = (req, res, next) => {
  //utilisation de jsonparse pour rendre l'objet utilisable
  //pr ajouter un fichier à la requête le frontend doit envoyer les données de la requête sous la forme form-data et non sous forme json
  //le corps de la requête contient une chaine sauce qui est simplement un objet Sauce converti en chaîne
  ///nous deovns donc analyser à l'aide de json.parse pour obtenir un objet utilisable
  //json.parse transforme un objet stringifié en objet javascript exploitable
  const sauceObject = JSON.parse(req.body.sauce);
  //suppression du champ _id de la requête envoyé par le frontend car l'identifiant de l'objet va être créé automatiquement par notre base de données
  delete sauceObject._id;
  //suppression du champ userId qui correspond à la personne qui créé l'objet, on utilise userId du token (on ne fait pas confiance à la personne, rien ne l'empecherait de nous passer luserid d'une autre personne)
  //nous le remplaçons en base de données par le userid extrait du token (ligne27)
  delete sauceObject._userId;
  //création d'une instance de notre modèle Sauce auquel on va passer un objet qui va contenir toutes les informations nécessaires
  const sauce = new Sauce({
    //utilisation de l'opérateur spread pour faire une copie de tous les éléments de req.body
    //création de l'objet avec ce qui a été passé moins les 2 champs supprimés
    ...sauceObject,
    userId: req.auth.userId,
    //résolution de l'url de notre image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //méthode save qui enregistre la Sauce dans la base de données et qui renvoie une promise
  sauce.save()
    //envoi d'une réponse en cas de réussite
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    //envoi d'une réponse avec l'erreur générée par Mongoose en cas d'erreur 400
    .catch(error => { res.status(400).json({ error }) })
};

function updateSauce(req, res, sauceObject) {
  //utilisation de la méthode updateOne avec en 1er argument l'objet de comparaison (pour savoir quel objet on modifie) et en 2e argument la nouvelle version de l'objet
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
    .catch(error => res.status(401).json({ error }));
}

exports.modifySauce = (req, res, next) => {
  //on créé sauceObject qui regarde si req.file existe ou non. S'il existe on traite la nouvelle image
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //si pas d'objet transmis on récupère l'objet dans le corps de la requête
    //s'il n'existe pas, on traite l'objet entrant
  } : { ...req.body };

  /**commentaire à replacer là où il faut
   * on créé ensuite une instance Sauce à partir de sauceObject puis on effectue la modification. 
   * Nous avons auparavant, comme pour la route post supprimé le champ _userId envoyé par le client afin d'éviter de changer son propriétaire 
   * et nous avons vérifié que le requérant est bien le propriétaire de l'objet*/
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

/** */
exports.deleteSauce = (req, res, next) => {
  //nous utilisons l id que nous recevons comme paramètres pour accéder au Thing correspondant dans la base de données
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //nous vérifions si l'utilisateur qui a fait la requête de suppression est bien celui qui a crééé la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        //on récupère le nom du fichier grâce à un split autour du répertoire images car nous savons que c'est là et que le nom du ficher sera juste après
        const filename = sauce.imageUrl.split('/images/')[1];
        //nous appelons unlike avec notre chemin images et le nom du fichier
        //ns géroons ensutie le call back cad créer methode qsui devra être appelée 1 fois que la suppression aura eu lieu 
        //parce que suppression dans le syst de fichiers est faite de manière asynchrones
        
        //nous utilisons le fait de savoir que notre url d image contient un segment/images/ pr séparer le nom de fichier
        //ns utilisons la fonction unlink du package fs pour supprimer ce fichier en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimmer
        //ds le callback ns implémentons la logisue d'origine en supprimant la Sauce de la base de données
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
  //utilisation de la méthode findOne dans le modèle Sauce pour trouver la Sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findOne({ _id: req.params.id })
  //La sauce est retourné dans une promise et renvoyée au frontend
    .then(sauce => res.status(200).json(sauce))
    //si aucune sauce n'est trouvée ou si une erreur se produit, envoi d'une erreur 404 au frontend avec l'erreur générée
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  //utilisation de la méthode find dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les Sauces dans la base de données
  //qui retourne une promise
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
          res.status(400).json({ error: "the user is not liking or disliking the sauce" })
        }
      }
    })
    .catch(error => res.status(404).json({ error }))
}



