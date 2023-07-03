//importation du package HTTP natif de node 
const http = require('http');
//importation del'application
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//on dit à l'application quel port utiliser
//la fonction normalizeport renvoie un port valide qu'il soit furni sous la forme d'un numéro ou d'une chaîne
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//fonction error handler recherche les différentes erreurs et les gère de manière appropriée
//elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//création d'un serveur en passant une fonction qui sera exécutée à chaque appel effectué vers le serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

//le serveur va attendre/écouter les requêtes http
//un écouteur d'évènement est enregistré consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.listen(port);