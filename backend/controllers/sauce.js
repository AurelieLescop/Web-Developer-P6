/**Importation du modèle sauce */
const Sauce = require('../models/sauce');
/**Importaion de fs (filesystem) */
const fs = require('fs');

/**Création de sauce
 * @param {*} req la requête envoyée par l'utilisateur qui contient toutes les informations de la nouvelle sauce
 * qui va être ajouté à la base de données 
 * @param {*} res la réponse
 * @param {*} next pour passer au prochain middleware
 */
exports.createSauce = (req, res, next) => {
  //extraction de la sauce de la requête avec parse
  const sauceObject = JSON.parse(req.body.sauce);
  //suppression du champ _id de la requête envoyée par le frontend car l'identifiant de l'objet va être créé automatiquement par la base de données
  delete sauceObject._id;
  //suppression du champ userId qui correspond à la personne qui créé l'objet
  //remplacement dans la base de données par le userId extrait du token (ligne 26)
  delete sauceObject._userId;
  //création d'une instance du modèle Sauce à laquelle on va passer un objet qui va contenir toutes les informations nécessaires
  const sauce = new Sauce({
    //utilisation de l'opérateur spread pour faire une copie de tous les éléments de req.body
    //création de l'objet sans les 2 champs supprimés
    ...sauceObject,
    //remplacement du userId dans la base de données par le userId extrait du token
    userId: req.auth.userId,
    //résolution de l'url de notre image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //méthode save qui enregistre la Sauce dans la base de données et qui renvoie une promise
  sauce.save()
    //envoi d'une réponse en cas de réussite
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    //envoi d'une réponse avec l'erreur générée par Mongoose en cas d'erreur
    .catch(error => { res.status(400).json({ error }) })
};

/**Fonction permettant la mise à jour de la sauce dans la base de données * 
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} sauceObject la sauce
 */
function updateSauce(req, res, sauceObject) {
  //utilisation de la méthode updateOne avec en 1er argument l'objet de comparaison (pour savoir quel objet on modifie) et en 2e argument la nouvelle version de l'objet
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
    .catch(error => res.status(401).json({ error }));
}

/**Fonction permettant de modifier la sauce par l'utilisateur l'ayant créé
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} next 
 */
exports.modifySauce = (req, res, next) => {
  //Création de sauceObject qui regarde si req.file existe ou non. S'il existe on traite la nouvelle image
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    //si pas d'objet transmis on récupère l'objet dans le corps de la requête
  } : { ...req.body };
  //suppression du champ _userId envoyé par le client
  delete sauceObject._userId
  //utilisation de la méthode findOne (qui retourne une promise) avec l'utilisation de l'id transmis par l'utilisateur qui va servir de filtre pour vérifier que la sauce existe
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //vérification que le requérant est bien le créateur de la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: '403 : unauthorized request' });
      } else {
        //récupération du nom de l'ancien fichier image
        const filename = sauce.imageUrl.split('/images/')[1];
        //si pas d'ajout d'une nouvelle image, mise à jour de la sauce
        if (sauceObject.imageUrl == undefined) {
          updateSauce(req, res, sauceObject);
        //si ajout d'une nouvelle image, suppression de l'image dans le dossier images et mise à jour de la sauce
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

/**Fonction permettant de supprimer la sauce par l'utilisateur l'ayant créé
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} next 
 */
exports.deleteSauce = (req, res, next) => {
  //utilisation de la méthode findOne (qui retourne une promise) avec l'utilisation de l'id transmis par l'utilisateur qui va servir de filtre pour vérifier que la sauce existe
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      //vérification si l'utilisateur qui a fait la requête de suppression est bien celui qui a crééé la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        //récupération du nom de l'ancien fichier image
        const filename = sauce.imageUrl.split('/images/')[1];
        //Utilisation de la fonction unlink du package fs pour supprimer le fichier en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimmer
        fs.unlink(`images/${filename}`, () => {
          //suppression de la sauce correspondante
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

/**Affichage d'une sauce
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} next 
 */
exports.getOneSauce = (req, res, next) => {
  //utilisation de la méthode findOne dans le modèle Sauce pour trouver la Sauce unique ayant le même _id que le paramètre de la requête
  Sauce.findOne({ _id: req.params.id })
  //La sauce est retournée dans une promise et renvoyée au frontend
    .then(sauce => res.status(200).json(sauce))
    //si aucune sauce n'est trouvée ou si une erreur se produit, envoi d'une erreur 404 au frontend avec l'erreur générée
    .catch(error => res.status(404).json({ error }));
};

/**Affichage de l'ensemble des sauces 
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} next 
 */
exports.getAllSauces = (req, res, next) => {
  //utilisation de la méthode find dans notre modèle Mongoose afin de renvoyer un tableau contenant toutes les Sauces dans la base de données
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


const LIKE_SAUCE = 1;
const DISLIKE_SAUCE = -1;

/** "like" de la sauce par l'utilisateur
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} userId l'identifiant
 */
function likeSauce(req, res, userId) {
  Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: userId }, $inc: { likes: 1 } })
    .then(() => res.status(201).json({ message: 'you liked this sauce' }))
    .catch(error => res.status(400).json({ error }))
};

/** "Dislike" de la sauce par l'utilisateur
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} userId l'identifiant
 */
function dislikeSauce(req, res, userId) {
  Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } })
    .then(() => res.status(201).json({ message: 'you doesn\'t like this sauce' }))
    .catch(error => res.status(400).json({ error }))
};

/** Annulation du "like" de la sauce par l'utilisateur
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} userId l'identifiant
 */
function cancelLike(req, res, userId) {
  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
    .then(() => res.status(201).json({ message: 'you have no opinion on this sauce' }))
    .catch(error => res.status(400).json({ error }))
};

/** Annulation du "dislike" de la sauce par l'utilisateur
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} userId l'identifiant
 */
function cancelDislike(req, res, userId) {
  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
    .then(() => res.status(201).json({ message: 'you have no opinion on this sauce' }))
    .catch(error => res.status(400).json({ error }))
};

/** Fonction selon si l'utilisateur "like" ou "dislike" la sauce
 * @param {*} req la requête
 * @param {*} res la réponse
 * @param {*} userId l'identifiant
 */
exports.likeDislikeSauce = (req, res, next) => {
  const likeDislikeStatus = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
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
};