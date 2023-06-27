// Import des modules nécessaires
const mongoose = require('mongoose');

// Crée schéma de données pour stocker informations utilisateur dans la base de données MongoDB

// Définition du Schema Sauce
const sauceSchema = mongoose.Schema({
    // Nom
    name: { type: String, required: true },
    // Descriptions
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    // Image
    imageUrl: { type: String },
    // Chaleur
    heat: { type: Number },
    // J'aime
    likes: { type: Number, default: 0},
    // Je n'aime pas
    dislikes: { type: Number, default: 0 },
    // Id de l'utilisateur
    userId: { type: String },
    // Id du j'aime
    usersLiked: [String],
    // Id du je n'aime pas
    usersDisliked: [String] ,  
});

// Export sous forme de modèle, on nomme le modèle 'Sauce' et on donne sa définition du schema
module.exports = mongoose.model('Sauce', sauceSchema);