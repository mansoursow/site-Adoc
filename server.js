const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

// Sert les fichiers statiques du dossier 'dist' généré par Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Redirige toutes les requêtes vers l'index.html (important pour React/Vite)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
