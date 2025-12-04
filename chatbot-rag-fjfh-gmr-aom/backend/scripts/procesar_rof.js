import fs from "fs";
import { config } from "dotenv";
config();

/**
 * Esta funcion procesa el rof.txt y a partir de eso, crea un array de objetos (chunks) y guarda el resultado en chunks.json y muestra por consola unas estadisticas
 * @returns Retorna el array de objetos (chunks)
 */
export function procesarROF() {
  const ruta = "backend/datos/rof.txt";
  const texto = fs.readFileSync(ruta, "utf8");

  let parrafos = texto
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter((parrafo) => parrafo.length > 0);

  const minLength = 100;
  const descartados = parrafos.filter((p) => p.length < minLength);
  parrafos = parrafos.filter((p) => p.length >= minLength);

  const chunks = [];
  let paginaActual = 1;
  let buffer = "";

  for (const p of parrafos) {
    const parrafoLimpio = p.replace(/\s+/g, " ").trim();
    if (buffer.length + parrafoLimpio.length > 1000) {
      if (buffer.trim().length > 0) {
        chunks.push({
          id: chunks.length + 1,
          contenido: buffer.trim(),
          fuente: "rof.txt",
          pagina: paginaActual,
        });
        paginaActual++;
      }
      buffer = "";
    }
    buffer += parrafoLimpio + " ";
  }

  if (buffer.length > 0) {
    chunks.push({
      id: chunks.length + 1,
      contenido: buffer.trim(),
      fuente: "rof.txt",
      pagina: paginaActual,
    });
  }

  fs.writeFileSync(
    "backend/datos/chunks.json",
    JSON.stringify(chunks, null, 2),
    "utf8"
  );

  const total = chunks.length;
  const tamanoPromedio =
    chunks.reduce((acc, c) => acc + c.contenido.length, 0) / total;

  const primerFragmento = chunks[0].contenido;
  const longitudMax = 50;
  const primerFragmentoProcesado =
    primerFragmento.length > longitudMax
      ? primerFragmento.slice(0, longitudMax).trim() + "..."
      : primerFragmento;

  console.log("✅ ROF procesado exitosamente");
  console.log(`📊 Fragmentos generados: ${total}`);
  console.log(`📏 Tamaño promedio: ${Math.round(tamanoPromedio)} caracteres`);
  console.log(`📄 Primer fragmento: \"${primerFragmentoProcesado}\"`);
  console.log(`⚠ Fragmentos descartados: ${descartados.length} (muy pequeños)`);

  return chunks;
}

procesarROF();
