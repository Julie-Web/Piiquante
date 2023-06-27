// Import des modules nécessaires

// package pour utiliser les variables d'environnements
require('dotenv').config();

// package
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import des routes
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

// Import pour accéder au path de notre serveur
const path = require('path');

// Initialisation appellez l'API
const app = express();

// Variable MongoDB
const url = process.env.DB_URL;

// Connexion à la base de données
mongoose.connect( process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
 
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
// Il s'agit d'un système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles
// Dans notre cas, nous avons deux origines : localhost:3000 et localhost:4200

app.use(cors({
  // D'accéder à notre API depuis n'importe quelle origine
  origin: "*",
  // On autorise d'envoyer des requêtes avec les méthodes mentionnées
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  // Ajoute les headers mentionnés aux requêtes envoyées vers notre API (surtout Authorization c'est pour le front c'est à cette endroit qu'on met le token)
  allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
}))

// Analyse le corps de la requête et le formate pour en faciliter l'exploitation
app.use(express.json());

// Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));

// On fait / pour l'url, ensuite il faudras aller à saucesRoutes, userRoutes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

// Export
module.exports = app;