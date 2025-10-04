//importamos y cargamos el dotenv junto a las variables de entorno
import dotenv from "dotenv";
dotenv.config();

//creamos la BASE_URL
const BASE_URL = `${process.env.BASE_URL}:${process.env.PORT}`;

//Escribimos las funciones crud que deben imprimir por consola el comando curl

const createStudent = (studentData)=>{
    
};

const readAllStudents = () =>{

}

const readStudentById = (id) => {

}

const updateStudent = (id,studentData) => {

}

const patchStudent = (id,partialData) => {

}

const deleteStudent = (id) => {
    
}