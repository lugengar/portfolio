fetch('src/JSON/proyectos.json') 
    .then(response => response.json())
    .then(info => {
        ubicacioncarpeta = info.configuracion.ubicacioncarpeta
        ubicacionlogocarpeta = info.configuracion.ubicacionlogocarpeta
        data2 = info.imagenes
        const listaproyectos = document.getElementById('listaproyectos');
        data2.forEach(proyecto => {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            const imegen = document.createElement('img');
            const pTexto2 = document.createElement('p');
     
            details.classList.add('proyecto');
            if(proyecto.logo){
                details.style.backgroundImage = `url(${ubicacionlogocarpeta+proyecto.logo})`;
                details.style.backgroundSize = proyecto.tam;
                details.style.backgroundPosition = proyecto.pos
                pTexto2.innerHTML = proyecto.titulo+"</br>"+proyecto.texto;

            }else{
                summary.textContent = proyecto.titulo;
                pTexto2.textContent = proyecto.texto;
            }
            
            imegen.src = ubicacioncarpeta+proyecto.imagen;
            details.appendChild(summary);

 

            details.appendChild(pTexto2);
            details.appendChild(imegen);
            details.innerHTML +=`</br><a target="_blank" href="${proyecto.url}">VISITAR LA WEB</a>`
            
            listaproyectos.appendChild(details);
        });
       
    })
    .catch(error => console.error('Error cargando el JSON:', error));

