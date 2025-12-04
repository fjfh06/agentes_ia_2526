//Fichero encargado de levantar una API REST con Express

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
//   CONFIG OLLAMA + FUNCION IA
// ================================
const OLLAMA_URL = process.env.OLLAMA_URL || "http://192.168.50.99:11434";
const MODEL_IA = process.env.OLLAMA_MODEL_LLM || "mistral";

// Funcion que llama a la IA igual que generarEmbedding
async function preguntarIA(prompt) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL_IA,
                prompt: prompt,
                stream: false
            })
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
//        RUTAS API
// ================================

// Bienvenida
app.get('/', (req,res) => {
    res.json({
        message:"API chatBot",
        version: "1.0.0",
        endpoints: {
            "POST /consultar": "Enviar una pregunta al bot"
        }
    })
});

// ------ ENDPOINT PRINCIPAL ------
app.post('/consultar', async (req, res) => {
    console.log("Peticion POST recibida en /consultar");

    const { pregunta } = req.body;

    if (!pregunta) {
        return res.status(400).json({
            success: false,
            message: "Debes enviar una 'pregunta' en el body"
        });
    }

    console.log(pregunta);

    try {
        // 1. Obtener fragmentos similares
        const fragmentos = await buscarFragmentosSimilares(pregunta);

        // 2. Crear prompt para la IA (pregunta + fragmentos)

        const promptIA = `
Eres un asistente que responde SOLO usando la información del contexto.

PREGUNTA:
${pregunta}

CONTEXTO (fragmentos relevantes):
${JSON.stringify(fragmentos, null, 2)}

INSTRUCCIONES:
- Si el contexto NO contiene información útil o relacionada con la pregunta → responde EXACTAMENTE: "No dispongo de informacion suficiente".
- Si la respuesta SI esta en el contexto → responde con un máximo de 150 caracteres.
- No inventes datos que no estén en el contexto.
- Responde de forma clara, directa y util.
`;


        // 3. Preguntar a la IA
        const respuestaIA = await preguntarIA(promptIA);

        // 4. Enviar respuesta final
        res.json({
            success: true,
            pregunta,
            fragmentos,
            respuesta: respuestaIA
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al procesar la pregunta"
        });
    }
});

// ================================
//        INICIAR SERVIDOR
// ================================
app.listen(PORT, HOST, () => {
    console.log(`Server ChatBot --> ${SERVER_URL}:${PORT}`);
});
