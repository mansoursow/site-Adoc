const express = require('express');
const path = require('path');
const app = express();

// Hostinger utilise le port 3000 par défaut pour les Web Apps Node.js
const port = process.env.PORT || 3000;

// Sert les fichiers statiques du dossier 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Redirige toutes les requêtes vers index.html (pour le routage React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Serveur actif sur le port ${port}`);
});
