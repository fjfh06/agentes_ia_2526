# Checklist del Proyecto RAG-Embeddings

## 🟦 FASE 0 — Preparación del proyecto
**Responsable:** Francisco Javier Fernández
- [x] Crear carpeta del proyecto
- [x] Inicializar repo (`git init`)
- [x] Crear rama `hito2/rag-embeddings`
- [x] Crear estructura de carpetas (`datos/`, `scripts/`, `backend/`)
- [x] Configurar `package.json` con scripts
- [x] Crear `.gitignore`
- [x] Colocar `rof.txt` en `/datos`

## 🟦 FASE 1 — Configuración: entorno y variables
**Responsable:** Ángel Ortega 
- [x] Crear y configurar `.env`
- [x] Crear `.env.example`
- [x] Verificar funcionamiento de Ollama
- [x] Documentar configuración inicial en README (apartado instalación)

## 🟦 FASE 2 — Procesamiento del ROF
**Responsable:** Francisco Javier Fernández
- [x] Script: `procesar_rof.js`
- [x] Leer `rof.txt`
- [x] Dividir en fragmentos por `\n\n`
- [x] Filtrar fragmentos < 100 caracteres
- [x] Crear estructura de cada chunk
- [x] Mostrar estadísticas (nº, tamaño medio, descartados…)
- [x] Guardar `chunks.json`
- [x] **Commit:** `feat: process_rof`

## 🟧 FASE 3 — Generación de embeddings
**Responsable:** Gregorio López
- [x] Script: `generar_embeddings.js`
- [x] Comprobar conexión a Ollama
- [x] Generar embedding para cada fragmento
- [x] Mostrar progreso
- [x] Guardar `embeddings.json`
- [x] Registrar tiempo y dimensión
- [x] **Commit:** `feat: generate_embeddings`

## 🟧 FASE 4 — Base de Datos SQLite
**Responsable:** Gonzalo Mansera
- [x] Script: `cargar_bd.js`
- [x] Crear BD `rof_vectores.db`
- [x] Crear tabla `fragmentos`
- [x] Insertar datos desde `embeddings.json` con transacción
- [x] Evitar duplicados
- [x] Mostrar progreso
- [x] Verificar integridad
- [x] **Commit:** `feat: load_db`

## 🟧 FASE 5 — Búsqueda Semántica
**Responsable:** Angel Ortega  
- [x] Script: `test_busqueda.js`
- [x] Función de similitud de coseno
- [x] Generar embedding de consulta
- [x] Calcular similitudes contra todos los fragmentos
- [x] Ordenar y mostrar top N
- [x] Probar con varias consultas
- [x] **Commit:** `feat: test_search`

## 🟧 FASE 6 — Dockerización
**Responsable:** Gonzalo Mansera 
- [x] Crear `docker-compose.yml`
- [x] Añadir servicio de Ollama
- [x] Probar con `docker compose up -d`
- [x] Descargar modelos dentro del contenedor
- [x] Probar `/api/tags`
- [x] **Commit:** `feat: docker-compose`

## 🟩 FASE 7 — Documentación (README.md)
**Responsable:** Ángel Ortega
- [x] Descripción del proyecto
- [x] Qué es RAG
- [x] Qué son los embeddings
- [x] Requisitos
- [x] Instalación
- [x] Ejecución completa (`npm run ingesta`)
- [x] Explicación de cada script
- [x] Estructura de datos (chunks, embeddings, BD)
- [x] Próximas fases
- [x] **Commit:** `docs: README`

## 🟩 FASE 8 — Checklist del proyecto
**Responsable:** Gonzalo Mansera 
- [x] Crear `checklist.md`
- [x] **Commit:** `docs: checklist`

## 🟩 FASE 9 — Validación y Testing
**Responsable:** Ángel Ortega
- [x] Crear `validacion.http`
- [x] Añadir pruebas:
  - Conexión a Ollama
  - Verificar BD
  - Comprobar estructura del proyecto
- [x] Probar `npm run ingesta` completo
- [x] **Commit:** `test: validations`

## 🟩 FASE 10 — QA Final y Entrega
**Responsable:** Ángel Ortega(con apoyo de todos)
- [x] Revisión completa del proyecto
- [x] Comprobar que todo funciona en orden
- [x] Verificar que `.env` no está en Git
- [x] Crear Pull Request
- [x] Añadir resumen + división del trabajo
- [x] Confirmar `Co-authored-by`
- [x] Entregar PR antes del plazo
