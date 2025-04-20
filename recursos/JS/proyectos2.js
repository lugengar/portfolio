fetch('recursos/JSON/proyectos.json') 

    .then(response => response.json())
    .then(info => {
        ubicacioncarpeta = info.configuracion.ubicacioncarpeta
        data = info.imagenes
        const listaServicios = document.querySelector('.listaproyectos');
        
        data.forEach(servicio => {
            const divServicio = document.createElement('details');
            const titulo = document.createElement('summary');
            const imegen = document.createElement('img');
     
            divServicio.classList.add('proyecto2');
          
            
       

            titulo.textContent = servicio.titulo;
            imegen.src = ubicacioncarpeta+servicio.imagen;
           const pTexto = document.createElement('p');
           pTexto.textContent = servicio.texto;
           divServicio.appendChild(titulo);

 

           divServicio.appendChild(pTexto);
                  divServicio.appendChild(imegen);
           divServicio.innerHTML +=`<a class="botonegro" target="_blank" href="${servicio.url}">VISITAR LA WEB</a>`
           
            
            listaServicios.appendChild(divServicio);
        });
    })
    .catch(error => console.error('Error cargando el JSON:', error));

