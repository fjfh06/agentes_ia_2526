//Fichero encargado de leventar una API REST con Express
// import
import { config } from "dotenv";
import express from "express";
import dataApi from "./db/db.js"
import cors from "cors";

//variables de entorno
config();
const PORT=process.env.PORT || 4001;
const NODE_ENV=process.env.NODE_ENV;
const SERVER_URL=process.env.SERVER_URL || "http://localhost";
const HOST=process.env.HOST;

//express
const app = express();

//CORS

app.use(cors())

//voy a permitir JSON como cuerpo de peticiones

app.use(express.json());

//midleware

app.use((req,res,next) => {
    const timeData = new Date().toISOString();
    console.log(`${timeData} ${req.method} ${req.url} - IP ${req.ip}`)

    next();
})

//Bienvenida...
app.get('/', (req,res) => {
    res.json({
        message:"Mini API de vinos",
        version: "1.0.0",
        endpoints: {
            "GET /posts": "Obtiene todos los post de mi api"
        }
    })
})

app.get('/posts', (req,res) => {
    console.log("Peticion GET para traer los post de mi api")
    res.json({
        succes: true,
        data: dataApi,
        //para que se auto incrementen: count posts.lenght
        count: dataApi.lenght
    })
})

app.delete('/posts/:id', (req,res) => {

})

//------INICIAR EL SERVIDOR-------
app.listen(PORT, HOST, ()=>{
    console.log(`Servidor de Javi FH --> ${SERVER_URL}:${PORT}`)
})