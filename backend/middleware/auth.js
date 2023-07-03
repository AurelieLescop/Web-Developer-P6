const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
 
module.exports = (req, res, next) => {
    //insertion à l'intérieur d'un block try...catch compte tenu que de nombreux problèmes peuvent se produire
   try {
    //extraction du token du header Authorization de la requête entrante
    //Utilisation de la fonction split pour tout récupérer après l'espace dans le header
       const token = req.headers.authorization.split(' ')[1];
       //Utilisation de la fonction verify pour décoder le token
       const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
       const userId = decodedToken.userId;
       //extraction de l'ID utilisateur du token et ajout à l'objet Request afin que les différentes routes puissent l'exploiter
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};