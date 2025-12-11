# Chatbot RAG - Documentación del Proyecto

## 1. Descripción General

Este proyecto implementa un **Chatbot basado en RAG (Retrieval-Augmented Generation)** que procesa documentos, genera embeddings y responde consultas contextualizadas mediante búsqueda semántica.

## 2. Conceptos Clave

### RAG (Retrieval-Augmented Generation)
Arquitectura que combina búsqueda de documentos con generación de texto, recuperando información relevante para respuestas precisas y contextualizadas.

### Embeddings
Representación vectorial numérica de texto en espacio multidimensional, permitiendo medir similitud semántica entre contenidos.

### Flujo de Ingesta
1. Procesar y dividir documentos en fragmentos (chunks)
2. Generar embeddings para cada fragmento
3. Almacenar vectores en base de datos
4. Realizar búsqueda por similitud semántica

## 3. Requisitos

- Node.js v18+
- Docker y Docker Compose
- Ollama
- Documentos en formato texto

## 4. Instalación

```bash
git clone <url>
cd chatbot-rag-fjfh-gmr-aom
npm install
docker-compose up -d
```

## 5. Configuración

Crear archivo `.env` con las variables necesarias:
```
DATABASE_PATH=./db/vectorstore.db
MODEL_NAME=nomic-embed-text
CHUNK_SIZE=1000
OLLAMA_BASE_URL=http://ollama:11434
```

## 6. Docker Compose

El archivo `docker-compose.yml` configura:
- **Ollama**: Servicio de embeddings en puerto 11434
- **SQLite**: Base de datos vectorial persistente

```bash
docker-compose up -d      # Iniciar servicios
docker-compose down       # Detener servicios
docker-compose logs -f    # Ver logs
```

## 7. Ejecución

```bash
npm run ingesta      # Procesar → embeddings → BD
npm run procesar     # Fase 1: Trocear documentos
npm run embeddings   # Fase 2: Generar vectores
npm run cargar-bd    # Fase 3: Cargar a BD
npm run test-busqueda # Probar búsqueda
```

## 8. Estructura del Proyecto

- `chunks.json` - Fragmentos procesados
- `embeddings.json` - Vectores numéricos
- `db/` - Base de datos SQLite3
- `src/` - Código fuente
- `docker-compose.yml` - Configuración de servicios

## 9. Decisiones de Diseño

- **SQLite3**: Ligero, sin servidor
- **nomic-embed-text**: Modelo eficiente
- **Docker Compose**: Orquestación de servicios
- **Tamaño mínimo**: 100 caracteres por chunk