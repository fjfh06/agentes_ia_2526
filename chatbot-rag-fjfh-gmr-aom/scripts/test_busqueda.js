import dotenv from "dotenv";
import Database from "better-sqlite3";
import { generarEmbedding } from "../scripts/generar_embeddings.js" 

dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || "http://192.168.50.99:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL_EMBEDDINGS || "nomic-embed-text";
const DB_PATH = process.env.DB_PATH || "./datos/rof_vectores.db";


// -------------------------------
// 1. Similitud de coseno
// -------------------------------
function calcularSimilitud(v1, v2) {
    // Convertir v2 a array si viene como Buffer
    if (v2.data) v2 = Float32Array.from(v2.data);

    const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
    const norma1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const norma2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

    if (norma1 === 0 || norma2 === 0) return 0;
    return dot / (norma1 * norma2);
}



// -------------------------------
// 2. Búsqueda semántica
// -------------------------------
export async function buscarFragmentosSimilares(consulta, limite = 3) {
    console.log(`\n🔍 Buscando fragmentos similares a: "${consulta}"\n`);

    // Obtenemos el embedding de la consulta del Usuario
    const embeddingConsulta = await generarEmbedding(consulta);

    // Obtenemos todos los embedding De la BD
    const db = new Database(DB_PATH);
    const filas = db.prepare("SELECT id, contenido, embedding FROM fragmentos").all();

    // Guradamos en resultado todos los embdding con su similitud 
    const resultados = filas.map((fila) => {
        const embedding = JSON.parse(fila.embedding);
        const similitud = calcularSimilitud(embeddingConsulta, embedding);

        return {
        id: fila.id,
        contenido: fila.contenido,
        similitud
        };
    });

    resultados.sort((a, b) => b.similitud - a.similitud);

    console.log("📍 Resultados (similitud):");

    let salida = "";

    resultados.slice(0, limite).forEach((r, i) => {
        salida += `${i + 1}. [${r.similitud.toFixed(4)}] "${r.contenido}"` + "\n";
    });
    
    db.close();

    return salida;
}

// -------------------------------
// 3. Pruebas reales
// -------------------------------
async function main() {
    await buscarFragmentosSimilares("¿Donde esta la sede?");
    await buscarFragmentosSimilares("¿dime los deberes de los participantes?");
    await buscarFragmentosSimilares("dime el horario");
}
