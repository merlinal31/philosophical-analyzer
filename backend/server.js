import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.0-flash-exp';

// Vérification de la clé API au démarrage
if (!GEMINI_API_KEY) {
    console.error('❌ ERREUR: La variable GEMINI_API_KEY n\'est pas définie dans le fichier .env');
    process.exit(1);
}

// Middleware
app.use(cors()); // Permet les requêtes cross-origin
app.use(express.json()); // Parse le JSON dans les requêtes

// Route de santé pour vérifier que le serveur fonctionne
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Le serveur backend fonctionne correctement',
        timestamp: new Date().toISOString()
    });
});

// Route principale pour l'analyse philosophique
app.post('/api/analyze', async (req, res) => {
    try {
        const { subject } = req.body;

        // Validation de l'entrée
        if (!subject || subject.trim().length < 5) {
            return res.status(400).json({
                error: 'Le sujet doit contenir au moins 5 caractères'
            });
        }

        // Liste des penseurs
        const thinkers = [
            "Socrate", "Saint Augustin", "Épictète", "Friedrich Nietzsche",
            "Pierre Bourdieu", "Charles Péguy", "Eva Illouz", "Michel Foucault"
        ];
        const thinkersList = thinkers.join(', ');

        // Construction du prompt système
        const systemPrompt = `Tu es un spécialiste de l'analyse sociologique et philosophique. Ton rôle est de décortiquer le sujet proposé par l'utilisateur (qui est: "${subject}") à travers le prisme des grands penseurs suivants: ${thinkersList}. Pour chaque penseur, tu dois fournir une analyse structurée, séparant : 1) l'approche générale du penseur sur le thème large associé au sujet (ex: pour 'solitude numérique', le thème large est 'isolement' ou 'relation humaine'), et 2) l'application ou l'interprétation spécifique de ses idées au sujet exact proposé par l'utilisateur. Le ton doit être académique, rigoureux, et pédagogique. Réponds UNIQUEMENT en utilisant la structure JSON fournie ci-dessous.`;

        // Requête utilisateur
        const userQuery = `Analyse le sujet "${subject}" en appliquant les idées des penseurs suivants: ${thinkersList}.`;

        // Schéma JSON pour la réponse structurée
        const responseSchema = {
            type: "ARRAY",
            description: "Liste d'analyses, une pour chaque penseur.",
            items: {
                type: "OBJECT",
                properties: {
                    "thinker": {
                        type: "STRING",
                        description: "Nom du penseur (e.g., Socrate)."
                    },
                    "generalApproach": {
                        type: "STRING",
                        description: "Résumé de l'approche générale du penseur sur le grand thème lié au sujet (en français)."
                    },
                    "specificAnalysis": {
                        type: "STRING",
                        description: "Analyse spécifique et directe de comment les idées du penseur s'appliquent au sujet précis (en français)."
                    }
                },
                required: ["thinker", "generalApproach", "specificAnalysis"],
                propertyOrdering: ["thinker", "generalApproach", "specificAnalysis"]
            }
        };

        // Préparation du payload pour l'API Gemini
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        };

        // Appel à l'API Gemini (la clé est protégée côté serveur)
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        console.log(`📚 Analyse en cours pour le sujet: "${subject}"`);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('❌ Erreur API Gemini:', errorDetails);
            throw new Error(`Erreur API Gemini: ${response.status}`);
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!jsonText) {
            throw new Error('Réponse vide de l\'API Gemini');
        }

        // Nettoyage et parsing du JSON
        const cleanedJsonText = jsonText.trim().replace(/^(```json|```)/gm, '').trim();
        const analysisData = JSON.parse(cleanedJsonText);

        console.log(`✅ Analyse complétée avec succès pour "${subject}"`);

        // Retour de la réponse au client
        res.json({
            success: true,
            subject: subject,
            analysis: analysisData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur serveur:', error.message);
        res.status(500).json({
            error: 'Erreur lors de l\'analyse',
            message: error.message
        });
    }
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        availableRoutes: [
            'GET /health',
            'POST /api/analyze'
        ]
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   🚀 Serveur Backend Démarré avec Succès   ║
╚════════════════════════════════════════════╝

📍 URL: http://localhost:${PORT}
🔐 Clé API: ${GEMINI_API_KEY ? '✅ Configurée' : '❌ Manquante'}
🌐 Environnement: ${process.env.NODE_ENV || 'development'}

Routes disponibles:
  • GET  /health       → Vérifier l'état du serveur
  • POST /api/analyze  → Analyser un sujet philosophique

Appuyez sur Ctrl+C pour arrêter le serveur
    `);
});
