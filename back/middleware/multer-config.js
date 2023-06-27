// Import des modules nécessaires

// multer est un package de gestion de fichiers
const multer = require('multer');

// Dictionnaire d'extensions d'images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Passé à multer comme configuration qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
// diskStorage() configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
    // destination indique à multer d'enregistrer les fichiers dans le dossier images
    destination: (req, file, callback) => { 
        callback(null, 'images');
    },
    // filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
    // Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
    // Nouveau nom du fichier image pour éviter les doublons
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image
module.exports = multer({ storage: storage}).single('image');