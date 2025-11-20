# Checklist del Proyecto RAG-Embeddings

## 🟦 FASE 0 — Preparación del proyecto
**Responsable:** Francisco Javier Fernández
- [ ] Crear carpeta del proyecto
- [ ] Inicializar repo (`git init`)
- [ ] Crear rama `hito2/rag-embeddings`
- [ ] Crear estructura de carpetas (`datos/`, `scripts/`, `backend/`)
- [ ] Configurar `package.json` con scripts
- [ ] Crear `.gitignore`
- [ ] Colocar `rof.txt` en `/datos`

## 🟦 FASE 1 — Configuración: entorno y variables
**Responsable:** Ángel Ortega 
- [ ] Crear y configurar `.env`
- [ ] Crear `.env.example`
- [ ] Verificar funcionamiento de Ollama
- [ ] Documentar configuración inicial en README (apartado instalación)

## 🟦 FASE 2 — Procesamiento del ROF
**Responsable:** Francisco Javier Fernández
- [ ] Script: `procesar_rof.js`
- [ ] Leer `rof.txt`
- [ ] Dividir en fragmentos por `\n\n`
- [ ] Filtrar fragmentos < 100 caracteres
- [ ] Crear estructura de cada chunk
- [ ] Mostrar estadísticas (nº, tamaño medio, descartados…)
- [ ] Guardar `chunks.json`
- [ ] **Commit:** `feat: process_rof`

## 🟧 FASE 3 — Generación de embeddings
**Responsable:** Gregorio López
- [ ] Script: `generar_embeddings.js`
- [ ] Comprobar conexión a Ollama
- [ ] Generar embedding para cada fragmento
- [ ] Mostrar progreso
- [ ] Guardar `embeddings.json`
- [ ] Registrar tiempo y dimensión
- [ ] **Commit:** `feat: generate_embeddings`

## 🟧 FASE 4 — Base de Datos SQLite
**Responsable:** Gonzalo Mansera
- [ ] Script: `cargar_bd.js`
- [ ] Crear BD `rof_vectores.db`
- [ ] Crear tabla `fragmentos`
- [ ] Insertar datos desde `embeddings.json` con transacción
- [ ] Evitar duplicados
- [ ] Mostrar progreso
- [ ] Verificar integridad
- [ ] **Commit:** `feat: load_db`

## 🟧 FASE 5 — Búsqueda Semántica
**Responsable:** Gonzalo Mansera 
- [ ] Script: `test_busqueda.js`
- [ ] Función de similitud de coseno
- [ ] Generar embedding de consulta
- [ ] Calcular similitudes contra todos los fragmentos
- [ ] Ordenar y mostrar top N
- [ ] Probar con varias consultas
- [ ] **Commit:** `feat: test_search`

## 🟧 FASE 6 — Dockerización
**Responsable:** Gonzalo Mansera 
- [ ] Crear `docker-compose.yml`
- [ ] Añadir servicio de Ollama
- [ ] Probar con `docker compose up -d`
- [ ] Descargar modelos dentro del contenedor
- [ ] Probar `/api/tags`
- [ ] **Commit:** `feat: docker-compose`

## 🟩 FASE 7 — Documentación (README.md)
**Responsable:** Ángel Ortega
- [ ] Descripción del proyecto
- [ ] Qué es RAG
- [ ] Qué son los embeddings
- [ ] Requisitos
- [ ] Instalación
- [ ] Ejecución completa (`npm run ingesta`)
- [ ] Explicación de cada script
- [ ] Estructura de datos (chunks, embeddings, BD)
- [ ] Próximas fases
- [ ] **Commit:** `docs: README`

## 🟩 FASE 8 — Checklist del proyecto
**Responsable:** Gonzalo Mansera 
- [x] Crear `checklist.md`
- [x] **Commit:** `docs: checklist`

## 🟩 FASE 9 — Validación y Testing
**Responsable:** Ángel Ortega
- [ ] Crear `validacion.http`
- [ ] Añadir pruebas:
  - Conexión a Ollama
  - Verificar BD
  - Comprobar estructura del proyecto
- [ ] Probar `npm run ingesta` completo
- [ ] **Commit:** `test: validations`

## 🟩 FASE 10 — QA Final y Entrega
**Responsable:** Ángel Ortega(con apoyo de todos)
- [ ] Revisión completa del proyecto
- [ ] Comprobar que todo funciona en orden
- [ ] Verificar que `.env` no está en Git
- [ ] Crear Pull Request
- [ ] Añadir resumen + división del trabajo
- [ ] Confirmar `Co-authored-by`
- [ ] Entregar PR antes del plazo
