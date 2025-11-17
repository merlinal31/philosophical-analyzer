# ⚡ Guide de Démarrage Rapide

## 🎯 En 5 minutes

### 1️⃣ Installer les dépendances (1 min)

```bash
cd backend
npm install
```

### 2️⃣ Configurer la clé API (2 min)

```bash
# Copier le fichier exemple
cp .env.example .env

# Éditer le fichier .env avec votre éditeur
nano .env
# ou
code .env
```

Collez votre clé API Gemini :
```env
GEMINI_API_KEY=VOTRE_CLÉ_ICI
```

💡 **Obtenir une clé** : https://aistudio.google.com/app/apikey

### 3️⃣ Démarrer le serveur (30 sec)

```bash
npm start
```

### 4️⃣ Ouvrir l'application (30 sec)

Ouvrez `frontend/index.html` dans votre navigateur.

### 5️⃣ Tester (1 min)

Entrez un sujet et cliquez sur "Lancer l'Analyse" !

---

## 🎬 Commandes Essentielles

```bash
# Démarrer le backend
cd backend && npm start

# Mode développement (auto-reload)
cd backend && npm run dev

# Serveur local pour le frontend (optionnel)
cd frontend && python3 -m http.server 8000
```

---

## ⚠️ Erreurs Courantes

| Erreur | Solution |
|--------|----------|
| "Cannot find module" | Exécutez `npm install` |
| "GEMINI_API_KEY not defined" | Créez le fichier `.env` avec votre clé |
| "Backend déconnecté" | Démarrez le serveur avec `npm start` |
| "Port already in use" | Changez le port dans `.env` |

---

## 🔗 Liens Utiles

- [Documentation complète](README.md)
- [Obtenir une clé API Gemini](https://aistudio.google.com/app/apikey)
- [Documentation API Gemini](https://ai.google.dev/docs)

---

Besoin d'aide ? Consultez le fichier README.md complet !
