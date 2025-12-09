// ================================
//     API COMPLETA CHATBOT + OLLAMA
// ================================

import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { buscarFragmentosSimilares } from "./scripts/test_busqueda.js";

config();

const PORT = 3000;
const SERVER_URL = "http://localhost";
const HOST = "0.0.0.0";

const app = express();
app.use(cors());
app.use(express.json());

// ================================
//   CONFIG OLLAMA
// ================================
const OLLAMA_URL = process.env.OLLAMA_URL || "http://192.168.50.99:11434";

const MODEL_IA = process.env.OLLAMA_MODEL_LLM || "mistral";

// Funcion generica para preguntar a la IA
async function preguntarIA(prompt, modelo = MODEL_IA) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: modelo, prompt, stream: false })
        });

        if (!response.ok) throw new Error("Error al conectar con Ollama");
        const data = await response.json();
        return data.response;

    } catch (err) {
        console.error("Error preguntando a IA:", err.message);
        return null;
    }
}

// ================================
//        ENDPOINTS API
// ================================

app.get('/', (req, res) => {
    res.json({
        message: "API chatBot",
        version: "1.1.0",
        endpoints: {
            "GET /": "Información general de la API",
            "GET /tags": "Modelos instalados en Ollama",
            "GET /modelos": "Alias de /tags",
            "GET /health": "Estado de Ollama y la API",
            "GET /info/:modelo": "Información detallada de un modelo",
            "POST /consultar": "Pregunta al chatbot usando contexto",
            "POST /generar": "Generar texto con un modelo",
            "POST /embeddings": "Generar embeddings con un modelo"
        }
    });
});

// ================================
//        /tags - modelos Ollama
// ================================
app.get('/tags', async (req, res) => {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`);
        if (!response.ok) throw new Error("No se pudo obtener los modelos");

        const data = await response.json();
        res.json({ success: true, modelos: data.models });

    } catch (err) {
        res.status(500).json({ success: false, message: "Error obteniendo modelos", error: err.message });
    }
});

app.get('/modelos', async (req, res) => {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    res.json({ modelos: data.models });
});

// ================================
//        /health
// ================================
app.get('/health', async (req, res) => {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/tags`);
        if (!response.ok) throw new Error();

        res.json({ api: "OK", ollama: "OK", modelosDisponibles: true });

    } catch {
        res.json({ api: "OK", ollama: "ERROR", modelosDisponibles: false });
    }
});

// ================================
//   /info/:modelo - detalles modelo
// ================================
app.get('/info/:modelo', async (req, res) => {
    const { modelo } = req.params;
    try {
        const response = await fetch(`${OLLAMA_URL}/api/show`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: modelo })
        });

        const data = await response.json();
        res.json({ success: true, info: data });

    } catch {
        res.status(404).json({ success: false, message: "Modelo no encontrado" });
    }
});

// ================================
//        /generar - texto libre
// ================================
app.post('/generar', async (req, res) => {
    const { prompt, modelo } = req.body;
    if (!prompt) return res.status(400).json({ message: "Falta 'prompt'" });

    const respuesta = await preguntarIA(prompt, modelo);
    res.json({ success: true, modelo: modelo || MODEL_IA, respuesta });
});

// ================================
//        /embeddings
// ================================
app.post('/embeddings', async (req, res) => {
    const { texto, modelo } = req.body;
    if (!texto) return res.status(400).json({ message: "Falta 'texto'" });

    try {
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model: modelo || MODEL_IA, input: texto })
        });

        const data = await response.json();

        res.json({ success: true, modelo: modelo || MODEL_IA, embedding: data.embedding });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ================================
//        /consultar - chatbot
// ================================
app.post('/consultar', async (req, res) => {
    const { pregunta, modelo } = req.body;
    const modeloUsado = modelo || MODEL_IA;

    if (!pregunta) {
        return res.status(400).json({ success: false, message: "Debes enviar una 'pregunta'" });
    }

    try {
        const fragmentos = await buscarFragmentosSimilares(pregunta);

        const promptIA = `
Eres un asistente que responde SOLO usando la informacion del contexto.

PREGUNTA:
${pregunta}

CONTEXTO:
${JSON.stringify(fragmentos, null, 2)}

INSTRUCCIONES:
- Responde unicamente usando los fragmentos.
- Si la respuesta no esta en el contexto → responde EXACTAMENTE: "No dispongo de informacion suficiente".
- Maximo 150 caracteres.
`;

        const respuestaIA = await preguntarIA(promptIA, modeloUsado);

        res.json({ success: true, modelo: modeloUsado, pregunta, fragmentos, respuesta: respuestaIA });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error interno" });
    }
});

// ================================
//        INICIAR SERVIDOR
// ================================
app.listen(PORT, HOST, () => {
    console.log(`Server ChatBot --> ${SERVER_URL}:${PORT}`);
});
