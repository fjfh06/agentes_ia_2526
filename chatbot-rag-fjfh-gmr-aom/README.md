# Documentación del Proyecto

## 4.1.1 Descripción del proyecto

### Qué es RAG
RAG (Retrieval-Augmented Generation) es una arquitectura que combina búsqueda de documentos con generación de texto. Recupera información relevante de una base de datos y la utiliza para generar respuestas precisas y contextualizadas.

### Qué es un embedding
Un embedding es una representación vectorial numérica de texto. Convierte palabras, frases o documentos en vectores de números en un espacio multidimensional, permitiendo medir similitud semántica entre textos.

### Flujo de ingesta de datos
1. Procesar y dividir documentos en fragmentos (chunks)
2. Generar embeddings para cada fragmento
3. Almacenar vectores y fragmentos en base de datos
4. Permitir búsqueda por similitud semántica

## 4.1.2 Requisitos

- Node.js v18+
- Docker
- Ollama
- ROF en formato texto

## 4.1.3 Instalación

1. Clonar repositorio: `git clone <url>`
2. Instalar dependencias: `npm install`
3. Descargar archivo ROF
4. Configurar archivo `.env` con variables necesarias

## 4.1.4 Ejecución completa

```bash
npm run ingesta  # Ejecuta: procesar → embeddings → cargar-bd
```

## 4.1.5 Scripts individuales

```bash
npm run procesar      # Fase 1: Trocear ROF en chunks
npm run embeddings    # Fase 2: Generar vectores
npm run cargar-bd     # Fase 3: Cargar a base de datos
npm run test-busqueda # Probar búsqueda por similitud
```

## 4.1.6 Estructura de datos

- **chunks.json**: Fragmentos de texto procesados del documento original
- **embeddings.json**: Vectores numéricos asociados a cada chunk
- **Tabla fragmentos**: BD SQLite3 con chunks, embeddings y metadatos

## 4.1.7 ¿Qué es un embedding?

- Representación vectorial de texto en espacio multidimensional
- Textos similares generan vectores cercanos
- Búsqueda por similitud de coseno para encontrar contenido relevante

## 4.1.8 Decisiones de diseño

- **SQLite3**: Ligero, sin servidor, ideal para desarrollo
- **nomic-embed-text**: Modelo eficiente y de código abierto
- **Tamaño mínimo de fragmentos**: 100 caracteres para mantener contexto

## 4.1.9 Próximas fases

- Backend API para responder consultas con RAG
- Frontend web para interfaz de usuario
- Integración con modelos de lenguaje LLM