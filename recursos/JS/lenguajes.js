fetch('recursos/JSON/lenguajes.json')
    .then(response => response.json())
    .then(info => {
        ubicacioncarpeta = info.configuracion.ubicacioncarpeta
        marcasData = info.imagenes
        const marcasContainer = document.getElementById("lenguajes");
        const totalMarcas = marcasData.length;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const imageWidth = screenHeight * 1;

        const animationDistance = screenWidth + imageWidth;

        const baseSpeed = 10; 
        const animationDuration = baseSpeed * (animationDistance / screenWidth);

        marcasData.forEach((marcaData, index) => {
            const marcaDiv = document.createElement("div");
            marcaDiv.classList.add("lenguaje");

            marcaDiv.style.backgroundImage = `url('${ubicacioncarpeta+marcaData.image}')`;
       
            marcaDiv.style.animation = `animarca ${animationDuration}s linear infinite`;

            const delay = index * (animationDuration / totalMarcas);
            marcaDiv.style.animationDelay = `${delay}s`;

            marcasContainer.appendChild(marcaDiv);
        });
    })
    .catch(error => console.error("Error cargando el JSON:", error));
