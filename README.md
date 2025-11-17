# 📚 Générateur d'Analyse Philosophique - Version Sécurisée

Application web permettant de générer des analyses philosophiques structurées sur n'importe quel sujet, à travers le prisme de 8 grands penseurs.

## 🔒 Architecture Sécurisée

Cette version utilise une architecture **client-serveur** pour protéger votre clé API Gemini :

```
Frontend (HTML/JS)  →  Backend (Node.js)  →  API Gemini
     ↓                      ↓                     ↓
  Navigateur          Serveur Express      Google Cloud
  (Public)            (Clé API cachée)    (Service IA)
```

## 📁 Structure du Projet

```
philosophical-analyzer/
├── backend/
│   ├── server.js          # Serveur Node.js avec Express
│   ├── package.json       # Dépendances Node.js
│   ├── .env              # Variables d'environnement (À CRÉER)
│   ├── .env.example      # Exemple de configuration
│   └── .gitignore        # Fichiers à ignorer dans Git
└── frontend/
    └── index.html        # Interface utilisateur
```

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** version 18 ou supérieure ([Télécharger](https://nodejs.org/))
- Une **clé API Google Gemini** ([Obtenir une clé](https://aistudio.google.com/app/apikey))

### Étape 1 : Installation des dépendances

```bash
cd backend
npm install
```

### Étape 2 : Configuration de la clé API

1. Créez un fichier `.env` dans le dossier `backend/` :

```bash
cp .env.example .env
```

2. Éditez le fichier `.env` et ajoutez votre clé API :

```env
GEMINI_API_KEY=VOTRE_CLÉ_API_ICI
PORT=3000
NODE_ENV=development
```

⚠️ **IMPORTANT** : 
- Ne partagez JAMAIS votre fichier `.env`
- Ne le commitez JAMAIS dans Git (il est déjà dans `.gitignore`)
- Révoquez immédiatement toute clé exposée publiquement

### Étape 3 : Démarrer le backend

```bash
cd backend
npm start
```

Vous devriez voir :

```
╔════════════════════════════════════════════╗
║   🚀 Serveur Backend Démarré avec Succès   ║
╚════════════════════════════════════════════╝

📍 URL: http://localhost:3000
🔐 Clé API: ✅ Configurée
```

### Étape 4 : Ouvrir le frontend

1. Ouvrez le fichier `frontend/index.html` dans votre navigateur
2. Ou utilisez un serveur local (recommandé) :

```bash
# Avec Python 3
cd frontend
python3 -m http.server 8000

# Puis ouvrez http://localhost:8000 dans votre navigateur
```

## 📖 Utilisation

1. **Vérifiez la connexion** : Un badge vert "✅ Backend connecté" doit apparaître
2. **Entrez un sujet** : Ex: "La solitude à l'ère du numérique"
3. **Cliquez sur "Lancer l'Analyse"**
4. **Consultez les résultats** : 8 analyses structurées apparaîtront

### Exemples de sujets

- La solitude à l'ère du numérique
- Le rôle du travail dans la vie moderne
- L'impact de l'intelligence artificielle sur la morale
- La quête de sens dans la société de consommation
- Les réseaux sociaux et l'identité personnelle

## 🔧 Configuration Avancée

### Changer le port du backend

Dans le fichier `.env` :

```env
PORT=5000  # Utilisez le port de votre choix
```

Puis mettez à jour `BACKEND_URL` dans `frontend/index.html` :

```javascript
const BACKEND_URL = 'http://localhost:5000';
```

### Mode développement avec auto-reload

```bash
npm run dev
```

## 🛡️ Sécurité

### ✅ Ce qui est protégé

- ✅ Clé API stockée côté serveur uniquement
- ✅ Validation des entrées utilisateur
- ✅ Gestion des erreurs appropriée
- ✅ CORS configuré (à restreindre en production)

### 🔴 Pour un déploiement en production

1. **Variables d'environnement** : Utilisez des services comme Heroku Config Vars, AWS Secrets Manager, etc.
2. **CORS** : Restreignez les origines autorisées
3. **Rate limiting** : Limitez le nombre de requêtes par IP
4. **HTTPS** : Utilisez obligatoirement HTTPS
5. **Monitoring** : Surveillez l'utilisation de votre API

Exemple de configuration CORS restrictive :

```javascript
app.use(cors({
    origin: 'https://votre-domaine.com'
}));
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifiez que Node.js est installé
node --version

# Réinstallez les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur "Backend déconnecté"

- Vérifiez que le backend est démarré
- Vérifiez l'URL dans `frontend/index.html` (ligne avec `BACKEND_URL`)
- Vérifiez les logs du backend dans le terminal

### Erreur 401 ou 403 de l'API Gemini

- Vérifiez que votre clé API est valide
- Vérifiez que l'API Gemini est activée sur votre projet Google Cloud
- Vérifiez les quotas de votre compte

## 📚 Technologies Utilisées

### Backend
- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **dotenv** : Gestion des variables d'environnement
- **cors** : Gestion des requêtes cross-origin
- **node-fetch** : Client HTTP pour l'API Gemini

### Frontend
- **HTML5/CSS3** : Structure et style
- **Tailwind CSS** : Framework CSS utility-first
- **JavaScript ES6** : Logique client
- **Fetch API** : Communication avec le backend

### IA
- **Google Gemini 2.0 Flash** : Modèle de langage pour les analyses

## 📄 Licence

MIT License - Libre d'utilisation et de modification

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amelioration`)
3. Commitez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une Pull Request

## 📧 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation de l'[API Gemini](https://ai.google.dev/docs)

---

Fait avec ❤️ pour l'amour de la philosophie et de la technologie sécurisée
