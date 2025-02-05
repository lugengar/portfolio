fetch('recursos/JSON/proyectos.json') 

    .then(response => response.json())
    .then(info => {
        ubicacioncarpeta = info.configuracion.ubicacioncarpeta
        data = info.imagenes
        const listaServicios = document.querySelector('.listaproyectos');
        
        data.forEach(servicio => {
            const divServicio = document.createElement('div');
            const iframe = document.createElement('iframe');
            divServicio.classList.add('proyecto');
            //divServicio.style.backgroundImage = `url(${ubicacioncarpeta+servicio.imagen})`;
            //divServicio.style.backgroundPosition = servicio.posicionimagen;
            
            const divBlur = document.createElement('div');
            divBlur.classList.add('blur');
            iframe.classList.add('proyectoiframe');
            iframe.src = servicio.url;
            
            const h1Titulo = document.createElement('h1');
            h1Titulo.classList.add('subtitulo');
            h1Titulo.textContent = servicio.titulo;
            divServicio.innerHTML= `<a class="botonegro" target="_blank" href="${servicio.url}">VISITAR LA WEB</a>`
            const pTexto = document.createElement('p');
            pTexto.textContent = servicio.texto;
            
            divServicio.appendChild(divBlur);
            divServicio.appendChild(iframe);
            divServicio.appendChild(h1Titulo);
            divServicio.appendChild(pTexto);
            
            listaServicios.appendChild(divServicio);
        });
    })
    .catch(error => console.error('Error cargando el JSON:', error));

