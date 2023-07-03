const bcrypt = require('bcrypt');
/**Importation du package pour les tokens d'authentification */
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const dotenv = require('dotenv');
dotenv.config();

exports.signup = (req, res, next) => {
    //pour crypter le mot de passe auquel on passe le mot de passe du corps de la requête
    //nous lui demandons de "saler" le mot de passe 10 fois
    //fonction asynchrone qui renvoie une promise dans laquelle nous recevons le hash généré
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //nous créons un utilisateur et l'enregistrons dans la base de données en renvoyoant une réponse de réussiste en cas de succès et des erreurs avec le code erreur en cas d échec
            const user = new User({
                //adresse fournie dans le corps de la requête
                email: req.body.email,
                // enregistrement du hash qui est créé pour ne pas stocker de mot de passe
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        //erreur serveur, on envoit l'erreur dans un objet
        .catch(error => res.status(500).json({ error }));
};

/**Permet de vérifier si un utilisateur qui tente de se connecter dispose d'identifiants valides
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
    //utilisation de la méthode findOne (qui nous retourne une promise) avec l'utilisation du champ email transmis par l'utilisateur qui va servir de filtre
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            //utilisation de la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //s'ils ne correspondent pas, ,renvoi erreur 401 avec même message que lorsque utilisateur non trouvé pour ne pas laisser quelqu'un d'autre vérifier si une autre personne est inscrite sur le site
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    //si les informations d'authentifications sont valides, renvoi réponse 200 contenant ID utilisateur et un token
                    res.status(200).json({
                        userId: user._id,
                        //utlisation de la fonction sign de jsonwebtoken pour chiffrer un nouveau token
                        token: jwt.sign(
                            { userId: user._id },
                            //utlisation d'une clef qui sert pour chiffrement et déchiffrement du token
                            process.env.SECRET_TOKEN,
                            //durée de validité du token limitée à 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };