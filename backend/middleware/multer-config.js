/**Importation package multer */
const multer = require('multer');

/**Constante dictionnaire de type MIME */
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/**Création d'une constante storage à passer à multer pour indiquer où enregistrer les fichiers entrants 
 * Méthode diskStorage qui configure le chemin et le nom de fichier pour les fichiers entrants
*/
const storage = multer.diskStorage({
  //La fonction destination indique à multer d'enregistre les fichiers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now comme nom de fichiers 
  filename: (req, file, callback) => {
    //Remplacement des espaces du titre par "_"
    const name = file.originalname.split(' ').join('_');
    //Utilisation de la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
    const extension = MIME_TYPES[file.mimetype];
    //Utilisation d'un timestamp pour rendre le nom le plus unique possible
    callback(null, name + Date.now() + '.' + extension);
  },
});

// https://www.npmjs.com/package/multer
const fileFilter = function (req, file, cb) {
  if (Object.keys(MIME_TYPES).includes(file.mimetype)) {
    cb(null, true)
  }
  return cb(new Error('Invalid mime type'));
}


/**Exportation de l'élément multer entièrement configuré */
module.exports = multer({
  storage,
  // fileFilter,
}).single('image');