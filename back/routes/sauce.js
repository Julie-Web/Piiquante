// Import des modules nécessaires
const express = require('express');

// Récupération du routeur d'express
// C'est pour enregistrer les routes dans notre routeur Express
const router = express.Router();

// Middleware qui permet d'authentifier les pages de l'application
const auth = require('../middleware/auth');

// Controllers Sauce
const controllersSauce = require('../controllers/sauce');

// Middleware qui définit la destination et le nom de fichier des images
const multer = require('../middleware/multer-config');

// Routage de la ressource User

// Pour tout envoyer
router.post('/', auth, multer, controllersSauce.createSauce);
// put = mettre à jour
router.put('/:id', auth, multer, controllersSauce.modifySauce);

// delete id pour supprimer définitivement l'utilisateur de la base de données
// On va définir le delete qui est repérée par un id
router.delete('/:id', auth, controllersSauce.deleteSauce);

// Envoyer
router.post('/:id/like', auth, controllersSauce.likeSauce);

// Rien dedans, dans l'url /user pour la récupération globale
// get c'est pour tout récupérer, toute la liste d'une ressource
// get pour l'ensemble des utilisateurs
router.get('/', auth, controllersSauce.getAllSauces);

// Pour récupérer un utilisateur spécifique, dans l'url je vais mettre l'id de mon utilisateur
// get id pour récupérer un utilisateur par son id
// get id pour un utilisateur préciser par l'id et cette id préciser dans l'url qu'on va utiliser
router.get('/:id', auth, controllersSauce.getOneSauce);

// Export
module.exports = router;