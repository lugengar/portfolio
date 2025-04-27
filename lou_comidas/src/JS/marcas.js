fetch('src/JSON/marcas.json')
    .then(response => response.json())
    .then(info => {
        marcasData = info.imagenes
        const marcasContainer2 = document.getElementById("marcasbuscar");

        marcasData.forEach((marcaData, index) => {
            const marcaDiv2 = document.createElement("option");
            marcaDiv2.classList.add("marca2");
            marcaDiv2.textContent= marcaData.nombre;
            marcaDiv2.value= marcaData.nombre;
            marcasContainer2.appendChild(marcaDiv2);
        });
    })
    .catch(error => console.error("Error cargando el JSON:", error));
