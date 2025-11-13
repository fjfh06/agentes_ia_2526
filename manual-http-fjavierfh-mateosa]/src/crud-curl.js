//importamos y cargamos el dotenv junto a las variables de entorno
import { exec } from 'child_process';
import dotenv from "dotenv";
dotenv.config();

//creamos la BASE_URL
const BASE_URL = `${process.env.API_BASE_URL}:${process.env.PORT}`;

//Escribimos las funciones crud que deben imprimir por consola el comando curl

/**
 * Esta función recibe un objeto como parámetro, 
 * posteriormente se convierte a un json de tipo String para el correcto funcionamiento del comando curl. 
 * Finalmente se muestra y ejecuta por consola el comando curl correspondiente de crear.
 * @param {Object} studentData - Todos los campos rellenos con datos de un estudiante nuevo
 */
const createStudent = (studentData)=>{
    const data = JSON.stringify(studentData) //Consultado en Stack Overflow para transformar el parámetro en un string json (para su correcto funcionamiento con el comando curl)
    console.log("Crear un nuevo estudiante: ");
    const cmd = `curl -s -X POST ${BASE_URL}/students -H "Content-Type: application/json" -d "${data.replace(/"/g, '\\"')}"`;
    console.log(cmd);
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error("Error ejecutando el comando create", error.message);
            return;
        }
        if(stderr){
            console.error("Error en la salida ->", stderr);
            return;
        }
        try {
            const newData = JSON.parse(stdout);
            console.log(newData);
            console.table(newData);
        } catch (e) {
            console.error(" La respuesta no es JSON válido. Contenido devuelto:");
            console.log(stdout);
        }
    });
};

/**
 * @author Mateo Sáez
 * Esta función muestra y ejecuta por consola el comando curl que permite obtener los datos de todos los estudiantes
 */
const readAllStudents = () =>{
    console.log("Leer todos los estudiantes: ");
    const cmd = `curl -s -X GET ${BASE_URL}/students`;
    console.log(cmd);
    exec(cmd,(error,stdout,stderr)=>{
        if(error){
            console.error("Error ejecutando el comando", error.message);
            return;
        }
        if(stderr){
            console.error("Error en la salida->", stderr);
            return;
        }
        try {
            const newData = JSON.parse(stdout);
            console.log(newData);
            console.table(newData);
        } catch (e) {
            console.error(" La respuesta no es JSON válido. Contenido devuelto:");
            console.log(stdout);
        }
    });
} 

/**
 * @author Mateo Sáez
 * Esta función recibe como parámetro un id de un estuante. Muestra y ejecuta por consola el comando curl que nos permitiría obtener
 * los datos del estudiante que contenga el mismo id que el parámetro
 * @param {String} id - el id que identifica a cada estudiante
 */
const readStudentById = (id) => {
    console.log("Leer un estudiante por su ID: ");
    const cmd = `curl -s -X GET ${BASE_URL}/students/${id}`;
    console.log(cmd);
    exec(cmd,(error,stdout,stderr)=>{
        if(error){
            console.error("Error ejecutando el comando", error.message);
            return;
        }
        if(stderr){
            console.error("Error en la salida->", stderr);
            return;
        }
        try {
            const newData = JSON.parse(stdout);
            console.log(newData);
            console.table(newData);
        } catch (e) {
            console.error(" La respuesta no es JSON válido. Contenido devuelto:");
            console.log(stdout);
        }
    });
}

/**
 * Esta función recibe como parámetros el id de un estudiante y toda su información. 
 * La información del estudiante se puede cambiar ya que muestra y ejecuta por consola el comando curl de actualizar un objeto completo. 
 * @param {String} id - el id que identifica a cada estudiante
 * @param {Object} studentData 
 */
const updateStudent = (id,studentData) => {
    const data = JSON.stringify(studentData);
    console.log("Actualizar un estudiante: ");
    const cmd = `curl -s -X PUT ${BASE_URL}/students/${id} -H "Content-Type: application/json" -d "${data.replace(/"/g, '\\"')}"`;
    console.log(cmd);
    exec(cmd,(error,stdout,stderr)=>{
        if(error){
            console.error("Error ejecutando el comando", error.message);
            return;
        }
        if(stderr){
            console.error("Error en la salida->", stderr);
            return;
        }
        try {
            const newData = JSON.parse(stdout);
            console.log(newData);
            console.table(newData);
        } catch (e) {
            console.error(" La respuesta no es JSON válido. Contenido devuelto:");
            console.log(stdout);
        }
    });
}

/**
 * Esta función recibe un id y datos de algunos campos de un estudiante. 
 * Posteriormente se muestra y ejecuta el comando curl que nos permite cambiar
 * solo los campos que especiquemos que se cambien.
 * @param {String} id - el id que identifica a cada estudiante
 * @param {Object} partialData - algunos campos que se deseen modificar
 */
const patchStudent = (id,partialData) => {
    const data = JSON.stringify(partialData);
    console.log("Actualizar un estudiante parcialmente: ");
    const cmd = `curl -s -X PATCH ${BASE_URL}/students/${id} -H "Content-Type: application/json" -d "${data.replace(/"/g, '\\"')}"`;
    console.log(cmd);
    exec(cmd,(error,stdout,stderr)=>{
        if(error){
            console.error("Error ejecutando el comando", error.message);
            return;
        }
        if(stderr){
            console.error("Error en la salida->", stderr);
            return;
        }
        try {
            const newData = JSON.parse(stdout);
            console.log(newData);
            console.table(newData);
        } catch (e) {
            console.error(" La respuesta no es JSON válido. Contenido devuelto:");
            console.log(stdout);
        }
    });
}

/**
 * Esta función recibe el id de un estudiante como parámetro. 
 * Muestra y ejecuta por consola el comando curl para eliminar un estudiante que coincida con el id pasado como parámetro.
 * @param {String} id 
 */
const deleteStudent = (id) => {
    console.log("Eliminar un estudiante: ");
    const cmd = `curl -s -i -X DELETE ${BASE_URL}/students/${id}`;
    console.log(cmd);
    exec(cmd,(error,stdout,stderr)=>{
        if(error){
            console.error("Error ejecutando el comando", error.message)
            return;
        }
        if(stderr){
            console.error("Error en la salida->", stderr);
            return;
        }
        console.log(stdout);
    });
}

//Llamadas a las funciones 
console.log("Inicio del script CRUD con CURL:");

createStudent({"id": "8",
      "name": "Pepe Llobregat Sanz",
      "email": "pepellobre@email.com",
      "enrollmentDate": "2024-10-04",
      "active": true,
      "level": "beginner"});

readAllStudents();

readStudentById(2);

updateStudent(8,{"id": "8",
      "name": "Pepe Llobregat Sanz",
      "email": "pepellobre@email.com",
      "enrollmentDate": "2024-10-04",
      "active": true,
      "level": "intermediate"});

patchStudent(8,{"active":false});

deleteStudent(8);

console.log("Fin del script.")