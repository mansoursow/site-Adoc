
  # Site Web Cabinet Comptable

  This is a code bundle for Site Web Cabinet Comptable. The original project is available at https://www.figma.com/design/hshq8iBYbBnmZ4QQ0Xx1Ml/Site-Web-Cabinet-Comptable.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Chatbot IA (Assistant fiscal)

  Le chatbot utilise OpenAI (modèle gpt-4o-mini). Pour qu’il fonctionne :

  1. **Clé API** : à la **racine du projet** (à côté de `package.json`), créez un fichier **`.env`** avec une seule ligne, **sans espace** autour du `=` :
     ```
     OPENAI_API_KEY=sk-proj-votre-cle-ici
     ```
     Vous pouvez copier `.env.example` en `.env` puis y coller votre clé.

  2. **Installer les dépendances** :
     ```bash
     npm install
     ```

  3. **Lancer le site + l’API** (depuis la racine du projet) :
     ```bash
     npm run dev:all
     ```
     Ou en deux terminaux : `npm run dev` puis `npm run dev:api`.

  **Vérifier que la clé est chargée** : avec le serveur API démarré, ouvrez  
  `http://localhost:3001/api/chat/health` (ou via le site en dev, le proxy redirige `/api`).  
  Si `hasOpenAIKey` est `false`, le fichier `.env` n’est pas trouvé ou mal formaté (vérifiez qu’il est à la racine, sans BOM, une variable par ligne).

  ## Déploiement

  **Déploiement gratuit** : voir **[DEPLOY.md](DEPLOY.md)** pour un guide pas à pas sur Render.com (gratuit, sans carte bancaire).

  Le projet peut aussi être déployé sur Railway, Fly.io ou tout hébergeur Node.js.

  - **Build** : le front est compilé avec Vite, le serveur Node sert le site et l’API.
  - **Une seule app** : le même serveur sert les fichiers statiques (depuis `dist/`) et la route `/api/chat`.

  ### Étapes (ex. Render)

  1. Créer un **Web Service**, connecter le dépôt Git.
  2. **Build Command** : `npm install && npm run build`
  3. **Start Command** : `npm start`
  4. **Variables d’environnement** : ajouter `OPENAI_API_KEY` = votre clé (et éventuellement `NODE_ENV=production` si ce n’est pas déjà défini).
  5. Le port est fourni par la plateforme via `PORT` ; le serveur l’utilise automatiquement.

  En local pour simuler la prod : `npm run build` puis `NODE_ENV=production npm start` (sous Windows : `set NODE_ENV=production && npm start`).
  