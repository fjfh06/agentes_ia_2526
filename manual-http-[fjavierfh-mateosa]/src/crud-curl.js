//importamos y cargamos el dotenv junto a las variables de entorno
import dotenv from "dotenv";
dotenv.config();

//creamos la BASE_URL
const BASE_URL = `${process.env.BASE_URL}:${process.env.PORT}`;

//Escribimos las funciones crud que deben imprimir por consola el comando curl

/**
 * Esta función recibe un objeto como parámetro, 
 * posteriormente se convierte a un json de tipo String para el correcto funcionamiento del comando curl. 
 * Finalmente se muestra por consola el comando curl correspondiente de crear.
 * @param {Object} studentData - Todos los campos rellenos con datos de un estudiante nuevo
 */
const createStudent = (studentData)=>{
    const data = JSON.stringify(studentData) //Consultado en Stack Overflow para transformar el parámetro en un string json (para su correcto funcionamiento con el comando curl)
    console.log("Crear un nuevo estudiante:")
    console.log(`curl -X POST ${BASE_URL} -H "Content-Type: application/json" -d '${data}'\n`);
};

/**
 * @author Mateo Sáez
 * Esta función muestra por consola el comando curl que permite obtener los datos de todos los estudiantes
 */
const readAllStudents = () => console.log(`curl -X GET ${BASE_URL}\n`);

/**
 * @author Mateo Sáez
 * Esta función recibe como parámetro un id de un estuante, y muestra por consola el comando curl que nos permitiría obtener
 * los datos del estudiante que contenga el mismo id que el parámetro
 * @param {number} id - el id que identifica a cada estudiante
 */
const readStudentById = (id) => console.log(`curl -X GET ${BASE_URL}/${Number(id)}\n`);

/**
 * Esta función recibe como parámetros el id de un estudiante y toda su información. 
 * La información se puede cambiar ya que muestra por consola el comando curl de actualizar un objeto completo. 
 * @param {Number} id - el id que identifica a cada estudiante
 * @param {Object} studentData 
 */
const updateStudent = (id,studentData) => {
    const data = JSON.stringify(studentData);
    console.log(`curl -X PUT ${BASE_URL}/${Number(id)} -H "Content-Type: application/json" -d '${data}'\n`);
}

/**
 * 
 * @param {Number} id - el id que identifica a cada estudiante
 * @param {Object} partialData - algunos campos que se deseen modificar
 */
const patchStudent = (id,partialData) => {
    const data = JSON.stringify(partialData);
    console.log(`curl -X PUT ${BASE_URL}/${Number(id)} -H "Content-Type: application/json" -d '${data}'\n`)
}

/**
 * Esta función recibe un id como parámetro y muestra por consola el comando curl para eliminar un estudiante que coincida con el id pasado.
 * @param {Number} id 
 */
const deleteStudent = (id) => {
    console.log(`curl -X DELETE ${BASE_URL}/${Number(id)}`)
}

//Llamadas a las funciones 
console.log("Inicio del script CRUD con CURL:");

createStudent({"id": 8,
      "name": "Pepe Pérez Benítez",
      "email": "peperez@email.com",
      "enrollmentDate": "2024-10-04",
      "active": true,
      "level": "beginner"});

readAllStudents();

readStudentById(2);

updateStudent(8,{"id": 8,
      "name": "Pepe Pérez Benítez",
      "email": "peperez@email.com",
      "enrollmentDate": "2024-10-04",
      "active": true,
      "level": "intermediate"});

patchStudent(8,{"active":false});

deleteStudent(8);

console.log("Fin del script.")