// Import du package de chiffrement
const bcrypt = require('bcrypt');

// Import du package token generator
const jwt = require('jsonwebtoken');

// Import du modèle User
const User = require('../models/user');

// La méthode hash() de bcrypt crée un hash crypté des mots de passe de mes utilisateurs pour les enregistrer de manière sécurisée dans la base de données

// Il s'agit d'une fonction asynchrone qui renvoie une Promise (objet) dans laquelle nous recevons le hash générée

// Dans notre bloc then, nous créons un utilisateur et l'enregistrons dans la base de données, en renvoyant une réponse de réussite en cas de succès, et des erreurs avec le code d'erreur en cas d'échec

/********La différence entre crypter et hasher********/
/* Exemple :
    Crypter = je vais couper les quatres morceaux de ma carotte, on vas pouvoir la rescontituer sans aucun problème
    Haschage = on prend une carotte, on fait des carottes rapées, c'est des petits morceaux, on ne peut pas la reconstituer
*/

// Un sallage avant de hacher pour complexifié la chose
// Un sallage ajoute une chaîne aléatoire à un mot de passe avant de le hacher. De cette façon, le hachage généré sera toujours différent à chaque fois. 

// req, res = requête et réponse sont des variables

// S'inscrire
exports.signup = (req, res, next) => {
    // Appeler fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisée.
    bcrypt.hash(req.body.password, 10)
        // Si tout vas bien
        .then(hash => {
            // Crée un utilisateur
            const user = new User({
            email: req.body.email,
            // Mot de passe hasher
            password: hash
            });
            // Enregistre dans la base de données
            user.save()
            // Si oui, on reçois un message de réussite
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            // Si non, on reçois un message d'erreur
            .catch(error => res.status(400).json({ error }));
        })
        // Si erreur
        .catch(error => res.status(500).json({ error }));
};

// Se connecter
exports.login = (req, res, next) => {
    // findOne pour chercher l'email
    // Nous utilisons notre modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant dans la base de données
    User.findOne({ email: req.body.email })
        // Si tout vas bien
        .then(user => {
            // Vérification si le champ est présent et cohérent
            // Si je ne l'ai pas, si j'ai false avec le !
            if (!user) {
                // Utilise le code 401 pour indiquer qu'on a un problème
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }

            // Si l'e-mail correspond à un utilisateur existant, nous continuons

            // Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données

            // La méthode compare de bcrypt compare un string avec un hash pour par exemple vérifier si un mot de passe entré par l'utilisateur correspond à un hash sécurisée enregistrée en base de données. Cela montre que même bcrypt ne peut pas décrypter ses propres hashs.

            bcrypt.compare(req.body.password, user.password)
                // Si oui
                .then(valid => {
                    // Vérification, compare les mots de passes
                    if (!valid) {
                        // Si ils ne correspondent pas, erreur401
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }

                    // S'ils correspondent, les informations d'identification de notre utilisateur sont valides

                    // Nous renvoyons une réponse 200 contenant l'ID utilisateur et un token de session pour le user maintenant connecté
                    res.status(200).json({
                        userId: user._id,
                        // Fonction sign de jsonwebtoken pour chiffrer un nouveau token
                        // Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token)
                        // sign de jsonwebtoken = pour chiffrer un nouveau token
                        token: jwt.sign(
                            { userId: user._id },
                            // Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token
                            // Puisque cette chaîne sert de clée pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur
                            process.env.TOKEN_KEY,
                            // Nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
                            { expiresIn: '24h' }
                        )
                    });
                })
                // Si erreur
                .catch(error => res.status(500).json({ error }));
        })
        // Si erreur
        .catch(error => res.status(500).json({ error }));
};