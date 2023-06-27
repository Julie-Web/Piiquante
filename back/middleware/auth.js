// Import du package pour pouvoir créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

// Middleware vérifie que l’utilisateur est bien connecté et transmettre les informations de connexion aux différentes méthodes qui vont gérer les requêtes

// Implémenté le cryptage de mot de passe sécurisé afin de stocker en toute sécurité les mots de passe utilisateur
// Crée et envoyé des tokens au front-end pour authentifier les requêtes
// Ajouté le middleware d'authentification pour sécuriser les routes dans l'API. De cette façon, seules les requêtes authentifiées seront gérées.

module.exports = (req, res, next) => {
    // Si oui
    try {
        // On récupère le token du header Authorization de la requête entrante. Il contiendra également le mot-clé Bearer.
        // Nous utilisons donc la fonction split pour tout récupérer, il y a un espace,
        // Le split décompose cette espace là, on se retrouve avec un tableau qui contient en position 0 le bearer et en position 1 le token,
        // On récupére la position 1 grâce aux crochets [1].
        const token = req.headers.authorization.split(' ')[1];
        // Vérifications, fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
        // Récupère l'ID utilisateur du token
        const userId = decodedToken.userId;
        // Compare le userid de la requête à celui du token
        // Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next().
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User id non valable !';
        } else {
            next();
        }
    // Si non erreur
    } catch(error){
        res.status(401).json({ error: new Error('Requête non authentifiée !')});
    }
};