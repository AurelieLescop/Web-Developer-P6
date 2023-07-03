/**Importation du package HTTP natif de node */
const http = require('http');
/**Importation du fichier de l'application*/
const app = require('./app');

/**La fonction normalizeport renvoie un port valide qu'il soit furni sous la forme d'un numéro ou d'une chaîne */
const normalizePort = val => {
  //La fonction parsInt analyse une chaîne de caractère fournie en argument et renvoie un entier exprimé dans une base donnée
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

/**Indication à l'application du port à utiliser*/
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//----------------------------------------------------------------------------------
// GESTION DES ERREURS
//----------------------------------------------------------------------------------

/**La fonction error handler recherche les différentes erreurs et les gère de manière appropriée
* Elle est ensuite enregistrée dans le serveur*/
const errorHandler = error => {
  //Si le serveur n'entend rien à l'appel
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    //EACCES : cas où l'authorisation est refusée
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      //Fin du processus avec un échec
      process.exit(1);
      break;
    //EADDRINUSE : cas où l'adresse cherchée en cours d'utilisation
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      //Fin du processus avec un échec
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//----------------------------------------------------------------------------------
// SERVEUR
//----------------------------------------------------------------------------------

/**Création d'un serveur en passant une fonction qui sera exécutée à chaque appel effectué vers le serveur*/
const server = http.createServer(app);

/**Si le serveur est en erreur, appel à la fonction errorHandler qui gère les erreurs */
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

/**Le serveur va attendre/écouter les requêtes HTTP
 * Un écouteur d'évènement est enregistré consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
 */
server.listen(port);