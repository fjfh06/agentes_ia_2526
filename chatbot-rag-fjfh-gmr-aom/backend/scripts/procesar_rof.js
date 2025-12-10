import * as fs from "fs";
import { config } from "dotenv";
config();

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

  return chunks;
}

// ❗ NO ejecutar en import — solo si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  procesarROF();
}
