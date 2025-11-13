import express from "express";
import cors from "cors";
import { config } from "dotenv";

// 0 cargar las variables de entorno cargadas en memoria

config();

// 1 Paso crear un servidor con express
const app = express();
// 2 Crear variables basandonos en las variables de entorno cargadas con config

const PORT=Number(process.env.PORT) || 3002;
const HOST=process.env.HOST || "0.0.0.0";
const NODE_ENV=process.env.NODE_ENV || "development";
const SERVER_URL=process.env.SERVER_URL || "http://localhost:3002";
const AI_API_URL=process.env.AI_API_URL || "http://localhost:11434";
const AI_MODEL=process.env.AI_MODEL || "llama3.2:1b";

// 3 Paso midleware a mi aplicacion:
// a) Habilitar los cors en los navegadores.
app.use(cors());
// b) Habilitar JSON para preguntas y respuestas
app.use(express.json());

// 4 paso (opcional) Crear una funcion que muestre info al usuario

const getInfoApi = () => ({ 
    //SI DEVUELVES UN OBJETO (EMPIZA POR LLAVES) COMO SABE QUE ESTAS HACIENDO UN RETURN PONIENDOLO ENTRE PARENTESIS
    service : "Servicio api-ollama",
    status : "ready",
    endpoints : {
        "GET /api": "Mostramos informacion de la API-OLLAMA",
        "GET /api/modelos": "Mostramos informacion de los modelos disponibles",
        "POST /api/consulta": "Envia un prompt para realizar consultas a la IA",
    },
    model: AI_MODEL,
    host: `${HOST}:${PORT}`,
    ollama_url: AI_API_URL,
});


// -----------5 GENERAR LOS ENCPOINTS

//--> /
app.get("/", (req, res) => {
    res.json(getInfoApi());
});

//--> /api
app.get("/api", (req, res) => {
    res.json(getInfoApi());
});

app.get("/api/modelos",async (req, res) => {
    try{
        const response = await fetch(`${AI_API_URL}/api/tags`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            signal: AbortSignal.timeout(5000),
        });
        if(!response.ok) throw new Error("Error al realizar la peticion");
        const data = await response.json();
        const models = data.models.map((model) => ({modelo: model.name})) || [];
        res.json(models)
    }catch (error){
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message,
        });
    }
});

//--> /api/consulta

app.post("/api/consulta", async (req, res) => {
    const {prompt, model} = req.body || {};
    //el prompt es de tipo string
    if(!prompt || typeof prompt !== "string"){
        return res.status(400).json({
            error: "Fallo al escribir el prompt",
            message: "Mal escrito el prompt",
        });
    }
    const modelSelect = model || AI_MODEL;
    try{
        const response = await fetch(`${AI_API_URL}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: modelSelect,
                prompt,
                stream: false
            }),
            signal: AbortSignal.timeout(30000),
        });
        if(!response.ok) throw new Error("Error al realizar la peticion");
        const data = await response.json();
        res.json({
            prompt,
            model: modelSelect,
            respuesta: data.response
        })
    }catch (error) {
        res.status(502).json({
            error: "Fallo en el acceso al servidor con los modelos",
            message: error.message,
        });
    }
});

// 6 levantar el servidor express para escuchar peticiones a mis endpoints
app.listen( PORT, HOST, () => {
    console.log("----------- Servidor express funcionando -----------");
    console.log(`\t Servidor escuchando en http://${HOST} en el puerto ${PORT}`);
    console.log("\t Escuchando peticiones...")
})