# CHECKLIST - semana 01

## Tareas

### Parte 1 (Configuracion inicial)
- [x] Crear proyecto (Francisco Javier)
- [x] Instalar dependencias (Francisco Javier)
- [x] Configurar package.json (Mateo)
- [x] Crear estructura de carpetas (Mateo)
- [x] Crear archivos de configuracion (Mateo)
- [x] Importar la Base de Datos (db.json) (Francisco Javier)

### Parte 2 (Script CRUD con funciones js) (Mateo)
- [x] Crear el archivo crud-curl.js
- [x] Crear funciones
    - [x] createStudent(studentData)
    - [x] readAllStudents()
    - [x] readStudentById(id)
    - [x] updateStudent(id, studentData)
    - [x] patchStudent(id, partialData)
    - [x] deleteStudent(id)
- [x] Ejecutar el script crud:curl

### Parte 3 (Documentacion CRUD con CURL) (Mateo)
- [x] Documentar en el README las operaciones CRUD
    - [x] create
    - [x] read all
    - [x] read by id
    - [x] update
    - [x] patch
    - [x] delete
- [x] Pruebas reales
    - [x] Levantar json-server
    - [x] Ejecutar cada comando curl generado por tu script
    - [x] Capturar las respuestas reales
    - [x] Documentar las respuestas en el README

### Parte 4 (Thunder Client) (Francisco Javier)
- [x] Peticiones
    - [x] Create Student (POST)
    - [x] GET All Students (GET)
    - [x] GET Student By Id (GET)
    - [x] Update Student (PUT)
    - [x] Patch Student (PATCH)
    - [x] Delete Student (DELETE)
- [x] Capturas de pantalla
- [x] Documentacion
    - [x] Explicar como usar Thunder Client en el README
    - [x] Incluir las capturas con descripcion

### Parte 5 (REST Client) (Francisco Javier)
- [x] Archivo peticiones-crud.http
- [x] Peticiones requeridas
    - [x] CREATE: Crear estudiante
    - [x] READ: Todos los estudiantes
    - [x] READ: Estudiante por ID
    - [x] READ: Filtrar estudiantes activos
    - [x] READ: Filtrar por nivel
    - [x] UPDATE: Actualizar estudiante completo (PUT)
    - [x] PATCH: Actualizar campo específico
    - [x] DELETE: Eliminar estudiante
- [x] Probar las peticiones desde VSCode y comprobar que funcionan

### Parte 6 (Script de validación) (Mateo)
- [x] Crear un script validate.sh que verifique la existencia de todo lo realizado en el proyecto
- [x] Configuración del script
    - [x] Dar permisos de ejecución
    - [x] Verificar que funciona desde terminal

### Parte 7 (Checklist)
- [x] Creación de la checklist (Francisco Javier y Mateo)