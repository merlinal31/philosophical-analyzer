# 🧪 Exemples de Tests API

## Test avec cURL

### 1. Vérifier l'état du serveur

```bash
curl http://localhost:3000/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "message": "Le serveur backend fonctionne correctement",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. Lancer une analyse

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "La solitude à l'\''ère du numérique"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "subject": "La solitude à l'ère du numérique",
  "analysis": [
    {
      "thinker": "Socrate",
      "generalApproach": "...",
      "specificAnalysis": "..."
    },
    ...
  ],
  "timestamp": "2024-01-15T10:35:00.000Z"
}
```

## Test avec JavaScript (Fetch)

```javascript
// Test de santé
fetch('http://localhost:3000/health')
  .then(response => response.json())
  .then(data => console.log(data));

// Analyse d'un sujet
fetch('http://localhost:3000/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    subject: 'Le rôle du travail dans la vie moderne'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## Test avec Python (requests)

```python
import requests

# Test de santé
response = requests.get('http://localhost:3000/health')
print(response.json())

# Analyse d'un sujet
response = requests.post(
    'http://localhost:3000/api/analyze',
    json={'subject': 'L\'impact de l\'IA sur la morale'}
)
print(response.json())
```

## Exemples de Sujets à Tester

```bash
# Philosophie moderne
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"subject": "La quête de sens dans la société de consommation"}'

# Technologie et société
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"subject": "Les réseaux sociaux et l'\''identité personnelle"}'

# Éthique contemporaine
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"subject": "L'\''éthique de l'\''intelligence artificielle"}'

# Sociologie du travail
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"subject": "Le burn-out dans le monde professionnel"}'
```

## Codes de Réponse HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 400 | Bad Request | Sujet manquant ou trop court |
| 404 | Not Found | Route inexistante |
| 500 | Internal Server Error | Erreur serveur ou API |

## Cas d'Erreur

### Sujet trop court

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"subject": "IA"}'
```

**Réponse :**
```json
{
  "error": "Le sujet doit contenir au moins 5 caractères"
}
```

### Route inexistante

```bash
curl http://localhost:3000/api/inexistante
```

**Réponse :**
```json
{
  "error": "Route non trouvée",
  "availableRoutes": [
    "GET /health",
    "POST /api/analyze"
  ]
}
```

## Monitoring et Logs

Les logs du serveur affichent :

```
📚 Analyse en cours pour le sujet: "La solitude à l'ère du numérique"
✅ Analyse complétée avec succès pour "La solitude à l'ère du numérique"
```

En cas d'erreur :

```
❌ Erreur API Gemini: {...}
❌ Erreur serveur: Message d'erreur
```
