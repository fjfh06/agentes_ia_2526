# Documentación del Proyecto

## 4.1.1 Descripción del proyecto

### Qué es RAG
### Qué es un embedding
### Flujo de ingesta de datos

## 4.1.2 Requisitos

Node.js, Docker, Ollama
ROF en formato texto

## 4.1.3 Instalación

Clonar repositorio
Instalar dependencias: npm install
Descargar archivo ROF
Configurar .env

## 4.1.4 Ejecución completa

```
npm run ingesta # Ejecuta: procesar → embeddings → cargar-bd

```

## 4.1.5 Scripts individuales

```
npm run procesar # Fase 1: Trocear ROF
npm run embeddings # Fase 2: Generar vectores
npm run cargar-bd # Fase 3: Cargar a BD
npm run test-busqueda # Probar búsqueda
```

## 4.1.6 Estructura de datos

Explicar chunks.json
Explicar embeddings.json
Explicar tabla fragmentos en BD

## 4.1.7 ¿Qué es un embedding?

Representación vectorial de texto
Textos similares = vectores cercanos
Búsqueda por similitud de coseno

## 4.1.8 Decisiones de diseño

Por qué SQLite3
Por qué nomic-embed-text
Tamaño mínimo de fragmentos (100 caracteres)

## 4.1.9 Próximas fases

Backend para responder consultas
Frontend para interfaz de usuario