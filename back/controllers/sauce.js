// Import des modules nécessaires
const Sauce = require('../models/sauce');

// fs signifie « file system » (« système de fichiers »)
// file system est un package qui permet de modifier et/ou supprimer des fichiers
const fs = require('fs');

// Crée une sauce
exports.createSauce = (req, res, next) => {
    
    // Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data et non sous forme de JSON 
    // Le corps de la requête contient une chaîne thing, qui est simplement un objetThing converti en chaîne 
    // L'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable
    const sauceObject = JSON.parse(req.body.sauce);
    
    // Supprime l'id
    delete sauceObject._id;    

    // Un nouvel objet sauce est crée avec le model Sauce
    // Sauce est vide et dans la variable sauce on a une nouvelle instance Sauce "une copie" mais avec les données
    // On lui demande de fusionner le modèle actuel avec les données qu'on a ici
    const sauce = new Sauce({
        // ... = raccourci du modèle
        ...sauceObject,

        // Résoudre l'URL complète image, car req.file.filename ne contient que le segment filename. 

        // req.protocol = obtenir le premier segment (dans notre cas 'http'),
        // Ajoutons '://', 
        // Utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000'),
        // Ajoutons '/images/' et le nom de fichier pour compléter notre URL.

        // L'url de l'image enregistrée dans le dossier images du serveur est aussi stockée dans la base de données

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,     
    });

    // La sauce est sauvegardée dans la base de données
    sauce.save()

    // Si tout vas bien
    .then(() => res.status(201).json({ message: 'Sauce sauvegardée'}))

    // Si non erreur
    .catch(error => res.status(400).json({ error }))

};

// Modifie une sauce
exports.modifySauce = (req, res, next) => {

    // Crée un objet sauceObject qui regarde si req.file existe ou non
    // Si il existe, on traite la nouvelle image, s'il n'existe pas, on traite simplement l'objet entrant
    const sauceObject = req.file ? 
    {
        // L'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        // On a un body, c'est donc dans le corps de la requête que vont se trouver les données. Tout est dans req.body.
    } : { ...req.body };

    // Reçois un paramètre dans l'url
    Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})

    // Si tout vas bien
    .then(()=> res.status(200).json({ message: 'Sauce modifiée'}))

    // Si non erreur
    .catch(()=> res.status(400).json({ error}))

};

// Supprime une sauce
exports.deleteSauce = (req, res, next) => {

    // findOne pour chercher l'id
    // Utilisons l'ID que nous recevons comme paramètre pour accéder à la Thing correspondant dans la base de données
    Sauce.findOne({_id: req.params.id})

    .then(sauce => {

        const filename = sauce.imageUrl.split('/images/')[1];

        // On la supprime du serveur
        fs.unlink(`images/${filename}`, () => {

            // On supprime la sauce de la base de données
            Sauce.deleteOne({_id: req.params.id})

            // Si tout vas bien
            .then(()=> res.status(200).json({ message: 'Sauce supprimée'}))

            // Si non erreur
            .catch(error => res.status(400).json({ error}))

        });

    })

};

// Récupère toutes les sauces
exports.getAllSauces = (req, res, next) => { 

    // Utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les Things (choses) dans notre base de données
    Sauce.find()

    // Si oui
    .then(sauces => res.status(200).json(sauces))

    // Si non erreur
    .catch(error => res.status(400).json({ error }))

};

// On récupère une seule sauce
exports.getOneSauce = (req, res, next) => {

    // findOne pour chercher l'id
    // Utilisons l'ID que nous recevons comme paramètre pour accéder à la Thing correspondant dans la base de données
    Sauce.findOne({_id : req.params.id})

    // Si oui
    .then(sauce => res.status(200).json(sauce))
    
    // Si non erreur
    .catch(error => res.status(404).json({ error }))

};

// Like et dislike
exports.likeSauce = (req, res, next) => {  
    const like = req.body.like;

    // Bouton j'aime
    // Si oui
    if(like === 1) {

        // Utilisons l'ID que nous recevons comme paramètre pour accéder à la Thing correspondant dans la base de données, on ajoute le like et on le met à jour
        Sauce.updateOne({_id: req.params.id}, { $inc: { likes: 1}, $push: { usersLiked: req.body.userId}, _id: req.params.id })

        // Si tout vas bien
        .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))

        // Si non erreur
        .catch(error => res.status(400).json({ error}))

    // Bouton je n'aime pas
    // Non si
    } else if(like === -1) {

        // Utilisons l'ID que nous recevons comme paramètre pour accéder à la Thing correspondant dans la base de données, on retire le like et on le met à jour
        Sauce.updateOne({_id: req.params.id}, { $inc: { dislikes: 1}, $push: { usersDisliked: req.body.userId}, _id: req.params.id })

        // Si tout vas bien
        .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))

        // Si non erreur
        .catch(error => res.status(400).json({ error}))

    // Annulation du bouton j'aime ou alors je n'aime pas
    } else {
        // findOne pour chercher l'id
        // Utilisons l'ID que nous recevons comme paramètre pour accéder à la Thing correspondant dans la base de données
        Sauce.findOne( {_id: req.params.id})

        // Si tout vas bien
        .then(sauce => {

            // On annule le j'aime
            if( sauce.usersLiked.indexOf(req.body.userId)!== -1) {

                // pull = supprime et renvois l'élément usersLiked
                Sauce.updateOne({_id: req.params.id}, { $inc: { likes: -1},$pull: { usersLiked: req.body.userId}, _id: req.params.id })

                // Si tout vas bien
                .then(() => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))

                // Si non erreur
                .catch(error => res.status(400).json({ error}))

            }
                
            // On annule le je n'aime pas
            else if(sauce.usersDisliked.indexOf(req.body.userId)!== -1) {

                // pull = supprime et renvois l'élément usersDisliked
                Sauce.updateOne( {_id: req.params.id}, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId}, _id: req.params.id})

                // Si tout vas bien
                .then(() => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))

                // Si non erreur
                .catch(error => res.status(400).json({ error}))

            }           
        })

        // Si non erreur
        .catch(error => res.status(400).json({ error}))             
    }   

};