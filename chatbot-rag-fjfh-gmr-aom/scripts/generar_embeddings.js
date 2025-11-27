import fs from "fs";
import dotenv from "dotenv"; 
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || "http://192.168.50.99:11434";
console.log(OLLAMA_URL);
const MODEL = process.env.OLLAMA_MODEL_EMBEDDINGS || "nomic-embed-text";

export async function generarEmbedding(texto) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: MODEL,
                prompt: texto
            })
        });

        if (!response.ok) throw new Error("Error al conectar con Ollama");

        const data = await response.json();
        return data.embedding;

    } catch (err) {
        console.error("Error generando embedding:", err.message);
        return null;
    }
}

async function procesarTodos() {
    console.log(`Conectando a Ollama en ${OLLAMA_URL}...`);

    // Probar conexión rápida
    try {
        await fetch(`${OLLAMA_URL}/api/tags`);
        console.log("✅ Ollama disponible");
    } catch (err) {
        console.error("❌ Ollama NO está disponible. Ejecuta: ollama serve");
        return;
    }

    // Cargar fragmentos
    const chunks = JSON.parse(fs.readFileSync("./datos/chunks.json", "utf8"));
    console.log(`📝 Cargados ${chunks.length} fragmentos de datos/chunks.json\n`);

    const resultados = [];
    const total = chunks.length;

    console.log("Generando embeddings:\n");

    const start = Date.now();

    for (let i = 0; i < total; i++) {
        const chunk = chunks[i];

        process.stdout.write(
            `Procesando ${i + 1}/${total}...\r`
        );

        const embedding = await generarEmbedding(chunk.contenido);

        if (!embedding) {
            console.log(`\n⚠ Embedding fallido para fragmento ID ${chunk.id}`);
            continue;
        }

        resultados.push({
            ...chunk,
            embedding
        });
    }

    const end = Date.now();
    const seconds = ((end - start) / 1000).toFixed(2);

    // Guardar embeddings
    fs.writeFileSync("./datos/embeddings.json", JSON.stringify(resultados, null, 2));

    console.log("\n\n✅ Embeddings generados exitosamente");
    console.log(`⏱  Tiempo total: ${seconds} segundos`);
    console.log(`💾 Guardados en datos/embeddings.json`);
    console.log(`📊 Dimensión de cada embedding: ${resultados[0]?.embedding.length || 0}`);
}

procesarTodos();
