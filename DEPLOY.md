# Déploiement gratuit (Render.com)

Ce guide vous permet de mettre le site en ligne **gratuitement** sur [Render](https://render.com). Le tier gratuit convient à ce projet (site + chatbot).

## Ce qu’il faut savoir (gratuit)

- **750 heures / mois** : suffisant pour un site qui tourne en continu.
- **Mise en veille** : après 15 min sans visite, le service s’éteint. La première visite après ça peut prendre **30 secondes à 1 minute** (redémarrage).
- Pas de carte bancaire requise pour le plan gratuit.

---

## Prérequis

1. **Code sur Git** : votre projet doit être sur **GitHub**, **GitLab** ou **Bitbucket**.  
   Si ce n’est pas fait :
   - Créez un dépôt sur [github.com](https://github.com) (gratuit).
   - Dans le dossier du projet :
     ```bash
     git init
     git add .
     git commit -m "Premier commit"
     git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git
     git push -u origin main
     ```
   (Remplacez `VOTRE-USERNAME` et `VOTRE-REPO` par les vrais noms.)

2. **Clé OpenAI** : vous devez avoir une clé API OpenAI (pour le chatbot).  
   Ne la mettez **jamais** dans le code : on la mettra uniquement dans les paramètres Render.

---

## Étapes sur Render (détaillées)

### 1. Compte Render

- Allez sur [render.com](https://render.com).
- Cliquez sur **Get Started for Free**.
- Inscrivez-vous avec **GitHub** (recommandé) pour connecter directement vos dépôts.

### 2. Nouveau Web Service

- Dans le **Dashboard**, cliquez sur **New +** → **Web Service**.
- Choisissez votre dépôt (ex. `site Adoc 1` ou le nom du repo).
- Si le repo n’apparaît pas : **Connect account** / **Configure account** et autorisez Render à voir vos dépôts, puis reselectionnez le repo.

### 3. Configuration du service

Remplissez comme suit :

| Champ | Valeur |
|--------|--------|
| **Name** | `site-adoc` (ou un nom de votre choix) |
| **Region** | Choisissez la plus proche (ex. Frankfurt) |
| **Branch** | `main` (ou la branche que vous utilisez) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

Ne changez pas le champ **Root Directory** sauf si votre projet n’est pas à la racine du dépôt.

### 4. Variable d’environnement (obligatoire pour le chatbot)

- Descendez jusqu’à **Environment Variables**.
- Cliquez sur **Add Environment Variable**.
- **Key** : `OPENAI_API_KEY`
- **Value** : collez votre clé OpenAI (commence par `sk-proj-...`).
- Cliquez sur **Add** (ou **Save**).

Vous pouvez aussi ajouter (optionnel) :

- **Key** : `NODE_ENV`  
- **Value** : `production`

### 5. Lancer le déploiement

- Cliquez sur **Create Web Service**.
- Render va :
  - cloner le repo,
  - lancer `npm install && npm run build`,
  - puis `npm start`.
- Attendez la fin du **Build** (log vert). Ensuite le **Deploy** démarre.
- Quand le statut est **Live**, le site est en ligne.

### 6. Voir le site

- En haut de la page du service, vous verrez une URL du type :  
  `https://site-adoc-xxxx.onrender.com`
- Cliquez dessus pour ouvrir le site. Le chatbot fonctionnera si `OPENAI_API_KEY` est bien renseignée.

---

## Après le premier déploiement

- **Mises à jour** : à chaque `git push` sur la branche connectée, Render redéploie automatiquement (Build + Start).
- **Logs** : onglet **Logs** sur la page du service pour voir les erreurs ou les messages du serveur.
- **Première visite lente** : sur le plan gratuit, après 15 min sans visite, le service s’éteint. La première visite suivante peut prendre 30 s à 1 min, c’est normal.

---

## Dépannage

- **Le site affiche une erreur**  
  → Onglet **Logs** : regardez la dernière erreur (souvent un problème de build ou de `npm start`).

- **Le chatbot ne répond pas**  
  → Vérifiez que la variable **OPENAI_API_KEY** est bien définie dans **Environment** (sans espace, toute la clé).  
  → Testez : `https://votre-url.onrender.com/api/chat/health` — vous devez voir `"hasOpenAIKey": true`.

- **Build failed**  
  → Vérifiez que **Build Command** est bien : `npm install && npm run build` et que le repo contient bien `package.json` à la racine.

Si vous suivez ces étapes, vous avez un déploiement gratuit fonctionnel. Si vous me dites à quelle étape vous bloquez (avec un message d’erreur ou une capture), on peut cibler la correction.
