//IMPORTACIONES
import dotenv from "dotenv";

// CARGO las variables .env a este fichero
dotenv.config();

//todas las variables estan en process.env.NOMBRE_DE_LA_VARIABLE


//mostrar por consola el valor de las variables de entorno.

console.log("URL de acceso: ",process.env.URL);
console.log("Pueto: ",process.env.PORT);
console.log(`URL con Puerto: ${process.env.URL}:${Number(process.env.PORT)+1}}`)