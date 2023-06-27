// Import des modules nécessaires
const mongoose = require('mongoose');

// Les erreurs générées par défaut par MongoDB pouvant être difficiles à résoudre, 
// installe package de validation pour prévalider les informations avant de les enregistrer
const uniqueValidator = require('mongoose-unique-validator');

// Définition du Schema User
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
  password: { type: String, required: true }
});

// La valeur unique avec l'élément mongoose-unique-validator passé comme plug-in s'assurera que deux utilisateurs ne puissent pas partager la même adresse e-mail
// Utilisation du package
userSchema.plugin(uniqueValidator);

// Export sous forme de modèle, On nomme le modèle 'User' et on donne sa définition son schema
module.exports = mongoose.model('User', userSchema);