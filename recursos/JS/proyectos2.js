fetch('recursos/JSON/proyectos.json') 

    .then(response => response.json())
    .then(info => {
        ubicacioncarpeta = info.configuracion.ubicacioncarpeta
        ubicacionlogocarpeta = info.configuracion.ubicacionlogocarpeta
        data = info.imagenes
        const listaServicios = document.querySelector('.listaproyectos');
       // let cont = 0
        data.forEach(servicio => {
            //cont++
            const divServicio = document.createElement('details');
            const titulo = document.createElement('summary');
            const imegen = document.createElement('img');
            const pTexto = document.createElement('p');
     
            divServicio.classList.add('proyecto2');
            if(servicio.logo){
                divServicio.style.backgroundImage = `url(${ubicacionlogocarpeta+servicio.logo})`;
                divServicio.style.backgroundSize = servicio.tam;
                divServicio.style.backgroundPosition = servicio.pos
                pTexto.innerHTML = servicio.titulo+"</br>"+servicio.texto;

            }else{
                titulo.textContent = servicio.titulo;
                pTexto.textContent = servicio.texto;
            }
            
            imegen.src = ubicacioncarpeta+servicio.imagen;
           divServicio.appendChild(titulo);

 

           divServicio.appendChild(pTexto);
                  divServicio.appendChild(imegen);
           divServicio.innerHTML +=`<a class="botonegro" target="_blank" href="${servicio.url}">VISITAR LA WEB</a>`
           
            
            listaServicios.appendChild(divServicio);
        });
        /*if(cont % 2 != 0){
            listaServicios.innerHTML += '<div class= "proyecto2"></div>'
        }*/
    })
    .catch(error => console.error('Error cargando el JSON:', error));

