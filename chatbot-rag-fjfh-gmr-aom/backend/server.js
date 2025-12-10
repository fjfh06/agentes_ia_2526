// ================================
//     API COMPLETA CHATBOT + OLLAMA (version segura)
// ================================

import { config } from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { buscarFragmentosSimilares } from "./scripts/test_busqueda.js";

config();

// ================================
//     CONFIG GENERAL
// ================================
const PORT = 3000;
const HOST = "0.0.0.0";
const SERVER_URL = `http://${HOST}:${PORT}`;

const app = express();

// Seguridad
app.use(helmet());
app.use(cors()); // CORS sin restricciones
app.use(express.json({ limit: "200kb" }));

// Rate limit generico
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { success: false, message: "Demasiadas peticiones, intenta mas tarde" }
}));

// ================================
//   CONFIG OLLAMA (validacion SSRF)
// ================================

const OLLAMA_URL = process.env.OLLAMA_URL || "http://192.168.50.99:11434";

const MODEL_IA = process.env.OLLAMA_MODEL_LLM || "mistral:instruct";

// ================================
//       FUNCIONES AUXILIARES
// ================================
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("❌ Error safeFetch:", err.message);
        throw new Error("Error al conectar con Ollama");
    }
}

function trimear(input = "") {
    return String(input).trim().replace(/[\n\r\t]/g, " ");
}

async function preguntarIA(prompt, modelo = MODEL_IA) {
    prompt = trimear(prompt);

    return safeFetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: trimear(modelo),
            prompt,
            stream: false
        })
    }).then(data => data.response);
}

// ================================
//        ENDPOINTS API
// ================================

app.get('/', (req, res) => {
    res.json({
        message: "API chatBot",
        version: "1.2.0",
        endpoints: {
            "GET /": "Informacion general de la API",
            "GET /tags": "Modelos instalados en Ollama",
            "GET /health": "Estado de Ollama y la API",
            "GET /info/:modelo": "Informacion detallada de un modelo",
            "POST /consultar": "Pregunta al chatbot usando contexto",
            "POST /generar": "Generar texto con un modelo",
            "POST /embeddings": "Generar embeddings"
        }
    });
});

// Listar modelos
app.get('/tags', async (req, res) => {
    try {
        const data = await safeFetch(`${OLLAMA_URL}/api/tags`);
        res.json({ success: true, modelos: data.models });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Alias
app.get('/modelos', (req, res) => res.redirect('/tags'));

// Health check
app.get('/health', async (req, res) => {
    try {
        await safeFetch(`${OLLAMA_URL}/api/tags`);
        res.json({ api: "OK", ollama: "OK" });
    } catch {
        res.json({ api: "OK", ollama: "ERROR" });
    }
});

// Info de un modelo
app.get('/info/:modelo', async (req, res) => {
    try {
        const modelo = trimear(req.params.modelo);
        const data = await safeFetch(`${OLLAMA_URL}/api/show`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: modelo })
        });

        res.json({ success: true, info: data });

    } catch {
        res.status(404).json({ success: false, message: "Modelo no encontrado" });
    }
});

// Generar texto libre
app.post('/generar', async (req, res) => {
    const { prompt, modelo } = req.body;

    if (!prompt) return res.status(400).json({ success: false, message: "Falta 'prompt'" });

    try {
        const respuesta = await preguntarIA(prompt, modelo);
        res.json({ success: true, modelo: modelo || MODEL_IA, respuesta });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Embeddings
app.post('/embeddings', async (req, res) => {
    const { texto, modelo } = req.body;

    if (!texto) return res.status(400).json({ success: false, message: "Falta 'texto'" });

    try {
        const data = await safeFetch(`${OLLAMA_URL}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: trimear(modelo || MODEL_IA),
                input: trimear(texto)
            })
        });

        res.json({ success: true, embedding: data.embedding });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Consultar chatbot con contexto
app.post('/consultar', async (req, res) => {
    const { pregunta, modelo } = req.body;

    if (!pregunta)
        return res.status(400).json({ success: false, message: "Debes enviar una 'pregunta'" });

    try {
        const fragmentos = await buscarFragmentosSimilares(trimear(pregunta));

        const promptIA = `
Eres un asistente que responde SOLO usando la informacion del contexto.

PREGUNTA:
${trimear(pregunta)}

CONTEXTO:
${JSON.stringify(fragmentos, null, 2)}

INSTRUCCIONES:
- Responde unicamente usando los fragmentos.
- Si la respuesta no esta en el contexto → responde EXACTAMENTE: "No dispongo de informacion suficiente".
- Maximo 150 caracteres.
`;

        const respuestaIA = await preguntarIA(promptIA, modelo);

        res.json({
            success: true,
            pregunta,
            modelo: modelo || MODEL_IA,
            fragmentos,
            respuesta: respuestaIA
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

// ================================
//        INICIAR SERVIDOR
// ================================
app.listen(PORT, HOST, () => {
    console.log(`Server ChatBot --> ${SERVER_URL}`);
});