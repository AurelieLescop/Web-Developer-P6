/**Importation de jsonwebtoken pour le middleware d'authentification */
const jwt = require('jsonwebtoken');
/**Importation de dotenv qui stocke les variables d'environnement*/
const dotenv = require('dotenv');
dotenv.config();

/**Exportation de la requête
 * @param {*} req requête
 * @param {*} res réponse
 * @param {*} next 
 */
module.exports = (req, res, next) => {
    //Insertion à l'intérieur d'un block try...catch puisque de nombreux problèmes peuvent se produire
    try {
        //Extraction du token du header Authorization de la requête entrante
        //Utilisation de la fonction split pour tout récupérer après l'espace dans le header
        const token = req.headers.authorization.split(' ')[1];
        //Utilisation de la fonction verify pour décoder le token
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        //Extraction de l'ID utilisateur du token et ajout à l'objet Request afin que les différentes routes puissent l'exploiter
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};