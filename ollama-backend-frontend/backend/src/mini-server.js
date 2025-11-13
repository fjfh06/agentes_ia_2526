import express from "express";
import cors from "cors";
import { config } from "dotenv";

// cargamos las variables desde el archivo .env
config();

// inicializamos la app
const app = express();
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const AI_API_URL = process.env.AI_API_URL || "http://localhost:11434";
const AI_MODEL = process.env.AI_MODEL || "llama3.2:1b";

app.use(cors());
app.use(express.json());

//ruta de prueba

const getAppInfo = () => {
  return {
    name: "Mini Server backend ollama",
    version: "1.0.0",
    status: "running",
    description: "Servidor backend para manejar solicitudes de IA",
    endpoints: {
      "GET /api": "Información basica del servidor y del modelo de IA",
      "GET /api/modelos": "Informacion de los modelos disponibles",
      "POST /api/consulta":
        "Enviar un prompt al modelo de IA y recibir una respuesta",
    },
    model: AI_MODEL,
    host: `${HOST}:${PORT}`,
    ollama: {
      url: AI_API_URL,
    },
  };
};

//ENDSPOINTS utilizados por el frontend

//Endpoint para info basica server
app.get("/", (req, res) => {
  res.json(getAppInfo());
});

//Endpoints /api
app.get("/api", (req, res) => {
  res.json(getAppInfo());
});

//Endpoint para obtener info del modelo IA configurado en ollama
app.get("/api/modelos", async (req, res) => {
  try {
    const response = await fetch(`${AI_API_URL}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Error al obtener la lista de modelos: ${response.statusText}`,
      });
    }
    const data = await response.json();
    const modelos = data.models || [];
    res.json({
      total: modelos.length,
      modelos,
      origen: AI_API_URL,
    });
  } catch (error) {
    res.status(502).json({
      error: `Error al obtener la lista de modelos`,
      message: error.message,
    });
  }
});

//Endpoint para enviar una consulta al modelo de IA

app.post("/api/consulta", async (req, res) => {
  const { prompt, model } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      error: "El campo 'prompt' es requerido y debe ser una cadena de texto",
    });
  }
  const targetModel = model || AI_MODEL;
  try {
    const response = await fetch(`${AI_API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: targetModel,
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Error al enviar la consulta: ${response.statusText}`,
      });
    }
    const data = await response.json();
    res.json({
      prompt,
      modelo: targetModel,
      respuesta: data.response || "",
      latencyMs: data.latencyMs || undefined,
      origen: AI_API_URL,
    });
  } catch (error) {
    res.status(502).json({
      error: `Error al enviar la consulta`,
      message: error.message,
    });
  }
});

//Iniciamos el servidor http de express con los endpoints definidos

app.listen(PORT, HOST, () => {
  console.log(`
    =====================================================
    💻 Mini Server backend ollama by Fco. Javier (fjfh) 
    Servidor backend mini-server escuchando en ${SERVER_URL} (entorno: ${process.env.NODE_ENV})
    Por favor accede a: ${SERVER_URL}/api para ver la informacion del servidor
    Asegurate de que el servicio de IA este correindo en ${AI_API_URL}
    =====================================================
    `);
});

export default app;