fetch('src/JSON/carrusel.json')
.then(respuesta => respuesta.json())
.then(info => {
    ubicacioncarpeta = info.configuracion.ubicacioncarpeta
    datos = info.imagenes
    let intervalo;
    const carrusel = document.querySelector(".imagenes");
    const controles = document.querySelector(".controles");
    const textos = document.querySelector(".textos");
    const contenedorIndicadores = document.querySelector(".indicadores");
    var segundosespera = info.configuracion.segundosespera
    var animaciontexto = info.configuracion.animaciontexto

    let imagenes = [...info.imagenes];

    imagenes.unshift(imagenes[imagenes.length - 1]);
    imagenes.push(imagenes[1]);

    imagenes.forEach((item, indice) => {
        const slide = document.createElement("div");
        const titulo = document.createElement("h1");
        const texto = document.createElement("div");
        slide.classList.add("imagen");
        texto.classList.add("filtro2");

        slide.style.left = `${indice * 100}%`;
        slide.style.backgroundImage = `url(${ubicacioncarpeta+item.imagen})`;
        slide.style.backgroundPosition = item.posicionimagen;
        carrusel.appendChild(slide);
       
        if (indice > 0 && indice < imagenes.length - 1) {
            titulo.textContent=item.titulo
            texto.textContent=""

            textos.appendChild(texto);
            textos.appendChild(titulo);
            const indicador = document.createElement("buttom");
            indicador.classList.add("indicador");
            if (indice === 1) indicador.classList.add("activo");
            indicador.setAttribute("onclick", `irASlide(${indice})`);
            contenedorIndicadores.appendChild(indicador);
            if(indice == 1){
                setTimeout(() => {
                    titulo.style.opacity = "100%"
                    texto.style.opacity = "100%"
                    titulo.style.transform = `translateY(0vh)`;
                    texto.style.transform = `translateY(0vh)`;
                }, 500);
    
            }
        }
    });

    let indiceActual = 1;
    let indiceAnterior = 1;
    const elementos = document.querySelectorAll(".imagen");
    const textoos = textos.querySelectorAll(".filtro2");
    const tiulos = textos.querySelectorAll("h1");
    const indicadores = document.querySelectorAll(".indicador");
    carrusel.style.transform = `translateX(-${indiceActual * 100}%)`;

    function actualizarCarrusel() {
        carrusel.style.transition = 'transform 0.5s ease-in-out';
        carrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
        indicadores.forEach((ind, i) => 
            ind.classList.toggle("activo", i === (indiceActual > indicadores.length ? 0 : indiceActual < 1 ? indicadores.length - 1 : indiceActual - 1))
        );
    }

    function moverSlide(adelante = true) {
        iniciarIntervalo()
        if (adelante) {
            indiceActual++;
            indiceAnterior = indiceActual - 1

            actualizarCarrusel();
            if (indiceActual === elementos.length - 1) {
                setTimeout(() => {
                    carrusel.style.transition = 'none';
                    indiceActual = 1;
                    carrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
                }, 500);
            }
        } else {
            indiceActual--;
            indiceAnterior = indiceActual + 1
            actualizarCarrusel();
            if (indiceActual === 0) {
                setTimeout(() => {
                    carrusel.style.transition = 'none';
                    indiceActual = elementos.length - 2;
                    carrusel.style.transform = `translateX(-${indiceActual * 100}%)`;
                }, 500);
            }
        }
        animarTexto();
    }

    // Función para animar el texto
    function animarTexto() {
        let indiceCorregido2 = (indiceAnterior > textoos.length ? 0 : indiceAnterior < 1 ? textoos.length - 1 : indiceAnterior - 1);
        let indiceCorregido = (indiceActual > textoos.length ? 0 : indiceActual < 1 ? textoos.length - 1 : indiceActual - 1);
        textoos[indiceCorregido2].style.transition = `transform 0.1s ease-in-out, opacity 0.1s ease-in-out`;
        textoos[indiceCorregido2].style.transitionDelay = `0s`;
        textoos[indiceCorregido2].style.transform = `translateX(-50vh)`;
        textoos[indiceCorregido2].style.opacity = `0%`;

        textoos[indiceCorregido].style.transition = `transform 0.5s ease-in-out, opacity 0.5s ease-in-out`;
        textoos[indiceCorregido].style.transitionDelay = `0.2s`;
        textoos[indiceCorregido].style.transform = `translateY(0vh)`;
        textoos[indiceCorregido].style.opacity = `100%`;

        tiulos[indiceCorregido2].style.transition = `transform 0.1s ease-in-out, opacity 0.1s ease-in-out`;
        tiulos[indiceCorregido2].style.transitionDelay = `0s`;
        tiulos[indiceCorregido2].style.transform = `translateY(5vh)`;
        tiulos[indiceCorregido2].style.opacity = `0%`;
        
        tiulos[indiceCorregido].style.transition = `transform 0.5s ease-in-out, opacity 0.5s ease-in-out`;
        tiulos[indiceCorregido].style.transitionDelay = `0.2s`;
        tiulos[indiceCorregido].style.transform = `translateY(0vh)`;
        tiulos[indiceCorregido].style.opacity = `100%`;
    }

    window.anteriorSlide = function() { moverSlide(false); };
    window.siguienteSlide = function() { moverSlide(true); };

    window.irASlide = function(indice) {
        indiceAnterior = indiceActual;
        indiceActual = indice;
        actualizarCarrusel();
        animarTexto();
    };

    let inicioX = 0;
    let desplazamiento = 0;
    
    controles.addEventListener("touchstart", (e) => {
        inicioX = e.touches[0].clientX;
    }, { passive: true });  
    
    controles.addEventListener("touchmove", (e) => {
        desplazamiento = e.touches[0].clientX - inicioX;
    }, { passive: true });  
    
    controles.addEventListener("touchend", () => {
        if (desplazamiento > 50) {
            moverSlide(false);
        } else if (desplazamiento < -50) {
            moverSlide(true);
        }
        desplazamiento = 0;
    });
    
    function iniciarIntervalo() {
        clearInterval(intervalo); 
        intervalo = setInterval(() => moverSlide(true), segundosespera * 1000);
    }

    iniciarIntervalo();
});
