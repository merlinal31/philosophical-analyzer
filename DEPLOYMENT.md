# 🚀 Guide de Déploiement

## 🌐 Options de Déploiement

### Option 1 : Heroku (Recommandé pour débuter)

#### Prérequis
- Compte Heroku gratuit
- Heroku CLI installé

#### Étapes

```bash
# 1. Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Se connecter
heroku login

# 3. Créer une application
cd backend
heroku create nom-de-votre-app

# 4. Configurer la variable d'environnement
heroku config:set GEMINI_API_KEY=votre_clé_api

# 5. Créer un Procfile
echo "web: node server.js" > Procfile

# 6. Déployer
git init
git add .
git commit -m "Initial commit"
git push heroku main

# 7. Ouvrir l'app
heroku open
```

#### Configuration du frontend

Mettez à jour `BACKEND_URL` dans `frontend/index.html` :

```javascript
const BACKEND_URL = 'https://nom-de-votre-app.herokuapp.com';
```

---

### Option 2 : Vercel (Frontend) + Railway (Backend)

#### Backend sur Railway

```bash
# 1. Créer un compte sur railway.app

# 2. Installer Railway CLI
npm install -g @railway/cli

# 3. Se connecter
railway login

# 4. Déployer
cd backend
railway init
railway up

# 5. Ajouter les variables d'environnement
railway variables set GEMINI_API_KEY=votre_clé
```

#### Frontend sur Vercel

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer le frontend
cd frontend
vercel

# 3. Suivre les instructions
```

---

### Option 3 : Serveur VPS (DigitalOcean, AWS EC2, etc.)

#### Configuration du serveur

```bash
# 1. Se connecter au serveur
ssh root@votre-ip

# 2. Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Installer PM2 (process manager)
sudo npm install -g pm2

# 4. Cloner ou transférer le projet
git clone votre-repo.git
cd philosophical-analyzer/backend

# 5. Installer les dépendances
npm install

# 6. Créer le fichier .env
nano .env
# Coller : GEMINI_API_KEY=votre_clé

# 7. Démarrer avec PM2
pm2 start server.js --name "philosophical-backend"
pm2 save
pm2 startup

# 8. Configurer Nginx (proxy inverse)
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Configuration Nginx :

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 9. Redémarrer Nginx
sudo systemctl restart nginx

# 10. Configurer SSL avec Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

---

### Option 4 : Docker (Pour tous les environnements)

#### Créer un Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Créer un docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PORT=3000
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
    depends_on:
      - backend
    restart: unless-stopped
```

#### Lancer avec Docker

```bash
# 1. Créer un fichier .env à la racine
echo "GEMINI_API_KEY=votre_clé" > .env

# 2. Construire et lancer
docker-compose up -d

# 3. Vérifier
docker-compose ps
docker-compose logs -f backend
```

---

## 🔐 Configuration CORS en Production

Dans `server.js`, remplacez :

```javascript
// Development
app.use(cors());

// Production
app.use(cors({
    origin: [
        'https://votre-domaine.com',
        'https://www.votre-domaine.com'
    ],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
```

---

## 📊 Monitoring et Logs

### Option 1 : PM2 Monitoring (VPS)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Voir les logs
pm2 logs

# Monitoring en temps réel
pm2 monit
```

### Option 2 : Sentry (Tous environnements)

```bash
npm install @sentry/node
```

```javascript
// Dans server.js
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: "https://votre-dsn@sentry.io/...",
    environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## ⚡ Optimisations Performance

### 1. Compression des réponses

```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Cache des réponses

```bash
npm install node-cache
```

```javascript
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 }); // 1 heure

app.post('/api/analyze', async (req, res) => {
    const cacheKey = req.body.subject;
    const cached = cache.get(cacheKey);
    
    if (cached) {
        return res.json(cached);
    }
    
    // ... appel API ...
    cache.set(cacheKey, result);
});
```

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max
    message: 'Trop de requêtes, réessayez plus tard'
});

app.use('/api/', limiter);
```

---

## 🔒 Sécurité en Production

### 1. Helmet (Headers de sécurité)

```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 2. Variables d'environnement (Heroku)

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
heroku config:set GEMINI_API_KEY=votre_clé
```

### 3. HTTPS forcé

```javascript
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

---

## 📋 Checklist avant le Déploiement

- [ ] `.env` configuré avec la bonne clé API
- [ ] `.gitignore` contient `.env` et `node_modules`
- [ ] CORS configuré pour votre domaine
- [ ] HTTPS activé (Let's Encrypt ou cloudflare)
- [ ] Rate limiting activé
- [ ] Logs configurés
- [ ] Monitoring activé (Sentry, DataDog, etc.)
- [ ] Tests effectués en environnement de staging
- [ ] Backup de la base de données (si applicable)
- [ ] Documentation à jour

---

## 🆘 Dépannage en Production

### Les requêtes échouent

```bash
# Vérifier les logs
pm2 logs backend
# ou
heroku logs --tail
# ou
docker-compose logs -f backend
```

### Problème de CORS

```javascript
// Vérifier la console du navigateur
// Si erreur CORS, ajouter le domaine dans server.js
```

### Erreur 502 Bad Gateway

```bash
# Vérifier que le backend tourne
pm2 status
# Redémarrer si nécessaire
pm2 restart backend
```

### Quotas API dépassés

```javascript
// Implémenter un système de cache
// Réduire les appels API
// Augmenter le quota Google Cloud
```

---

## 📞 Support

- Documentation Heroku : https://devcenter.heroku.com/
- Documentation Railway : https://docs.railway.app/
- Documentation Vercel : https://vercel.com/docs
- Forum DigitalOcean : https://www.digitalocean.com/community/

---

**Bon déploiement ! 🚀**
