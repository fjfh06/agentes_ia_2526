document.getElementById("btnModelos").addEventListener("click", async () => {
    try {
        const response = fetch("http://localhost:3002/api/modelos");
        if (!response.ok) {
            throw new Error(`Error fetching modelos: ${response.statusText}`);
        }
        const data = await response.json();
        console.table(data.modelos);
        const nombreModelos = data.modelos.map(modelo => modelo.name);

        //seleccionamos el parrafo
        document.getElementById("mostrarModelos").textContent = nombreModelos.join(", ");
    } catch (error) {
        console.error("Error fetching modelos: ", error);
        document.getElementById("mostrarModelos").textContent = "Error al cargar los modelos";
    
    }
});