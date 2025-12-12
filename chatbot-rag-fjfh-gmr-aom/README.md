# Chatbot RAG (ROF)

Asistente conversacional para consultar el Reglamento de Organización y Funciones (ROF) usando **Retrieval-Augmented Generation**: ingesta de documentos, embeddings, búsqueda semántica y respuestas concisas servidas vía API y frontend Vite.

## Características clave
- Ingesta en 3 pasos: troceo de documentos, generación de embeddings y carga a vector store SQLite.
- API Express con endpoints de salud, modelos Ollama, generación libre y consulta con contexto.
- Frontend Vite con UI modernizada (chat + guía rápida).
- Seguridad básica: Helmet, CORS y rate limiting.

## Arquitectura rápida
- **Backend**: Node.js + Express, integra con Ollama para generación y embeddings. Vector store SQLite (better-sqlite3).
- **Frontend**: Vite (JS) consumiendo `POST /consultar`.
- **Ollama**: LLM (`OLLAMA_MODEL_LLM`, por defecto `mistral:instruct`) y embeddings (`nomic-embed-text`).

## Requisitos
- Node.js v18+
- Docker y Docker Compose
- Ollama levantado (local o en red)
- Documentos ROF en texto plano

## Instalación y arranque rápido
```bash
git clone <git@github.com:fjfh06/agentes_ia_2526.git>
cd chatbot-rag-fjfh-gmr-aom
npm install
docker-compose up -d   # levanta Ollama y dependencias si usas el compose
```

## Variables de entorno
Crear `.env` en la raíz con, al menos:
```
OLLAMA_URL=http://ollama:11434     # o http://localhost:11434
OLLAMA_MODEL_LLM=mistral:instruct  # modelo de generación
```
Opcionales (ingesta):
```
DATABASE_PATH=./db/vectorstore.db
MODEL_NAME=nomic-embed-text
CHUNK_SIZE=1000
```

## Scripts principales (raíz)
- `npm run procesar` → trocea documentos (`backend/scripts/procesar_rof.js`)
- `npm run embeddings` → genera vectores (`backend/scripts/generar_embeddings.js`)
- `npm run cargar_db` → carga embeddings a SQLite (`backend/scripts/cargar_db.js`)
- `npm run ingesta` → ejecuta el flujo completo (procesar + embeddings + carga)
- `npm run test_busqueda` → prueba búsqueda semántica
- `npm start` → levanta API Express (`backend/server.js`)
- `npm test` → tests con Jest

## Uso del frontend
```bash
cd frontend
npm install
npm run dev -- --host   # Vite en http://localhost:5173
```
Abre la UI y envía consultas; el backend debe estar escuchando en `http://localhost:3000`.

## Uso del backend (API)
### Salud y modelos
```bash
curl http://localhost:3000/health
curl http://localhost:3000/tags
```
### Consulta con contexto
```bash
curl -X POST http://localhost:3000/consultar \
  -H "Content-Type: application/json" \
  -d '{"pregunta":"¿Cuáles son las funciones de la oficina X?"}'
```
### Generación libre
```bash
curl -X POST http://localhost:3000/generar \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Resume el objetivo del ROF"}'
```

## Flujo completo RAG
1) `npm run procesar` — divide el ROF en chunks.  
2) `npm run embeddings` — genera embeddings y los guarda en JSON.  
3) `npm run cargar_db` — persiste vectores en SQLite.  
4) `npm start` — expone la API en `:3000`.  
5) UI Vite consume `POST /consultar` para mostrar respuestas.

## Docker Compose
Comandos típicos:
```bash
docker-compose up -d      # iniciar servicios
docker-compose down       # detener
docker-compose logs -f    # seguir logs
```

## Estructura resumida
- `backend/` → API Express y scripts de ingesta.
- `backend/scripts/` → procesar, generar embeddings, cargar DB, pruebas de búsqueda.
- `frontend/` → UI Vite (chat + estilo).
- `docker-compose.yml` → servicios (Ollama, DB).
- `datos/` y `backend/datos/` → artefactos y DB vectorial.

## Buenas prácticas y seguridad
- Rate limit (200 req/15 min) y Helmet activados.
+- Respuestas cortas (<150 chars) y basadas en contexto para evitar alucinaciones.
- Ajusta `OLLAMA_URL` si Ollama corre fuera de Docker o en otra IP.
- Limita el tamaño de `userInput` en frontend/back para evitar payloads grandes (ya se usa `express.json` 200kb).

## Roadmap breve
- Streaming de respuestas.
- Métricas y trazas (p.ej., OpenTelemetry).
- Controles de autenticación y cuotas por usuario.