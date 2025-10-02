# CHECKLIST - semana 01

## Tareas

### Parte 1 (Configuracion inicial)
- [] Crear proyecto (Francisco Javier)
- [] Instalar dependencias (Francisco Javier)
- [] Configurar package.json (Mateo)
- [] Crear estructura de carpetas (Mateo)
- [] Crear archivos de configuracion (Mateo)
- [] Importar la Base de Datos (db.json) (Francisco Javier)

### Parte 2 (Script CRUD con funciones js)
- [] Crear el archivo crud-curl.js
- [] Crear funciones
    - [] createStudent(studentData)
    - [] readAllStudents()
    - [] readStudentById(id)
    - [] updateStudent(id, studentData)
    - [] patchStudent(id, partialData)
    - [] deleteStudent(id)
- [] Ejecutar el script crud:curl

### Parte 3 (Documentacion CRUD con CURL)
- [] Documentar en el README las operaciones CRUD
    - [] create
    - [] read all
    - [] read by id
    - [] update
    - [] patch
    - [] delete
- [] Pruebas reales
    - [] Levantar json-server
    - [] Ejecutar cada comando curl generado por tu script
    - [] Capturar las respuestas reales
    - [] Documentar las respuestas en el README

### Parte 4 (Thunder Client)
- [] Configuracion
    - [] Crear una coleccion "CRUD, Students, Api"
    - [] Configurar un entorno de variables
- [] Peticiones
    - [] Create Student (POST)
    - [] GET All Students (GET)
    - [] GET Student By Id (GET)
    - [] Update Student (PUT)
    - [] Patch Student (PATCH)
    - [] Delete Student (DELETE)
- [] Capturas de pantalla
- [] Documentacion
    - [] Explicar como usar Thunder Client en el README
    - [] Incluir las capturas con descripcion

### Parte 5 (REST Client)
- [] Archivo peticiones-crud.http
- [] Peticiones requeridas
    - [] CREATE: Crear estudiante
    - [] READ: Todos los estudiantes
    - [] READ: Estudiante por ID
    - [] READ: Filtrar estudiantes activos
    - [] READ: Filtrar por nivel
    - [] UPDATE: Actualizar estudiante completo (PUT)
    - [] PATCH: Actualizar campo específico
    - [] DELETE: Eliminar estudiante
- [] Probar las peticiones desde VSCode y comprobar que funcionan

### Parte 6 (Script de validación)
- [] Crear un script validate.sh que verifique la existencia de todo lo realizado en el proyecto
- [] Configuración del script
    - [] Dar permisos de ejecución
    - [] Verificar que funciona desde terminal

### Parte 7 (Checklist)
- [x] Creación de la checklist (Francisco Javier y Mateo)