import dotenv from "dotenv";
dotenv.config();

import { generarEmbedding } from "./generar_embeddings.js";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

async function testEmbeddings() {
    console.log("🔄 Probando conexión con Ollama...");

    try {
        const res = await fetch(`${OLLAMA_URL}/api/tags`);
        if (!res.ok) throw new Error();
        console.log(`✅ Ollama disponible en ${OLLAMA_URL}\n`);
    } catch (err) {
        console.error(`❌ No se pudo conectar a Ollama en ${OLLAMA_URL}`);
        console.error("Ejecuta: ollama serve");
        return;
    }

    console.log("🧪 Generando embedding de prueba...\n");

    const textoPrueba = "¿Cuál es el horario de entrada del centro?";
    const embedding = await generarEmbedding(textoPrueba);

    if (!embedding) {
        console.error("❌ Error: No se generó el embedding");
        return;
    }

    console.log("✅ Embedding generado con éxito\n");

    console.log(`📏 Dimensión del vector: ${embedding.length}`);
    console.log(`🔹 Primeros valores: ${embedding.slice(0, 5).join(", ")} ...`);
    console.log("🔍 Test completado correctamente.");
}

testEmbeddings();