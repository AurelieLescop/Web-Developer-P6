/**Importation package multer */
const multer = require('multer');

/**Constante dictionnaire de type MIME */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/**Création d'une constante storage à passer à multer comme configuration qui contien la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants */
//méthide diskStorage qui configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  //la fonction destination indique à multer d'enregistre les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now comme nom de fichiers 
  filename: (req, file, callback) => {
    //on enlève les espaces du titre qu'on remplace par "_"
    const name = file.originalname.split(' ').join('_');
    //utilisation de la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    //on rend le nom le plus uniquepossible en utilisant un timestamp
    callback(null, name + Date.now() + '.' + extension);
  }
});

/**Exportation de l'élément multer entièrement configuré */
//méthode single créé un middleware qui capture les fichiers d'un certain type (passé en argument) et les enregistre au système de fichiers du serveur à l'aide du storage configuré
module.exports = multer({storage: storage}).single('image');