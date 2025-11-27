//Fichero encargado de levantar una API REST con Express

import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { buscarFragmentosSimilares } from "../scripts/test_busqueda.js";

config();

const PORT = 3000;
const SERVER_URL = "http://localhost";
const HOST = "0.0.0.0";

const app = express();

app.use(cors());
app.use(express.json());

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

// ------ AQUI EL ENDPOINT QUE QUIERES ------
app.post('/consultar', (req, res) => {
    console.log("Peticion POST recibida en /consultar");

    const { pregunta } = req.body;

    if (!pregunta) {
        return res.status(400).json({
            success: false,
            message: "Debes enviar una 'pregunta' en el body"
        });
    }
    console.log(pregunta)
    // Llamas a tu funcion asincrona
    buscarFragmentosSimilares(pregunta)
        .then(respuesta => {
            // Aqui ya tienes la respuesta
            res.json({
                success: true,
                pregunta,
                respuesta: respuesta
            });

        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).json({
                success: false,
                message: "Error interno al procesar la pregunta"
            });
        });
});


// Iniciar servidor
app.listen(PORT, HOST, () => {
    console.log(`Server ChatBot --> ${SERVER_URL}:${PORT}`);
});
