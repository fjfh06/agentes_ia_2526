//el fichero cliente lanzara peticiones a la API REST

const traerPostVinos = async () => {
    const response = await fetch("http://localhost:4000/posts");
    const data = await response.json();
    console.log(data);
}
traerPostVinos();