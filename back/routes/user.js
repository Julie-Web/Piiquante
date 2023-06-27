// Import des modules nécessaires
const express = require('express');
// Création du chemin user dans le controllers
const controllersUser = require('../controllers/user');

// Récupération du routeur d'express
const router = express.Router();

// Routes POST pour créer un compte ou se connecter
// post = envoie les informations
router.post('/signup', controllersUser.signup);
router.post('/login', controllersUser.login);

// Export
module.exports = router;