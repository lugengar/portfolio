fetch('src/JSON/productos.json')
    .then(response => response.json())
    .then(data => {
       // renderConfiguracion(data);
        renderProductos(data);
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });

function renderConfiguracion(info) {
    config = info.configuracion
    const producto = document.getElementById('producto');
    const h1 = document.createElement('h1');
    const p = document.createElement('p');
    producto.style.backgroundPosition = config.posicionimagen
    producto.style.backgroundImage = `url(${config.ubicacioncarpeta+config.imagenprincipal})`;
    
    h1.textContent = config.titulo;
    p.textContent = config.texto;

    producto.appendChild(h1);
    producto.appendChild(p);
}
limite = 20
function renderProductos(info) {
    ubicacioncarpeta = info.configuracion.ubicacioncarpeta;
    productos = info.imagenes;
    const listaProductos = document.querySelector('.listaproductos');
    let indice = 0;
    
    productos.forEach(producto => {
        indice++;
        const item = document.createElement('div');
        const imagen = document.createElement('div');
        const h3 = document.createElement('h1');
        const p = document.createElement('p');
        imagen.classList.add("imagenp3");
        
        if (indice > limite) {
            item.style.display = "none";
            item.classList.add("oculto");
        }
        
        p.classList.add('texto');
        h3.textContent = producto.titulo;
        p.textContent = "$"+producto.precio;
        item.classList.add('producto');
        h3.classList.add('minititulo');
        item.setAttribute("data-marca", producto.marca);
        sino1 = false
        sino2= false
        sino3= false
        if(producto.adicionales != undefined && producto.solouno != undefined ){
            sino2= true
            text= `<select class="botonegro3" id="p2_${producto.titulo}">`;
            cont = 0
            producto.adicionales.forEach(opcion => { 
                if(cont == 0){
                    text+= `<option value="${opcion}">ADICIONALES</option>`;
                }
                cont++
                text += `<option value="${opcion}">${opcion}</option>`;
            })
            text += `</select>`;
            item.innerHTML += text;
           

        }else if(producto.adicionales != undefined){
            sino3= true
            text= `<details class="botonegro3"><summary>ADICIONALES</summary><div class=" checkboxes" id="p2_${producto.titulo}">`;
         
            producto.adicionales.forEach(opcion => { 
          
                
                text += ` <label><input type="checkbox" name="${producto.titulo}" value="${opcion}">${opcion}</label> `;
            })
            text += `</div></details>`;
            item.innerHTML += text;
           

        }
        if(producto.opciones != undefined){
            sino1= true

            text= `<select class="botonegro2" id="p_${producto.titulo}">`;
            cont = 0
            producto.opciones.forEach(opcion => { 
                if(cont == 0){
                    text+= `<option value="${opcion}">VER OPCIONES</option>`;
                }
                cont++
                text += `<option value="${opcion}">${opcion}</option>`;
            })
            text += `</select>`;
            item.innerHTML += text;
             }
        item.innerHTML += `<button class="botonegro" onclick="carrito('${producto.titulo}','${producto.precio}','${ubicacioncarpeta+producto.imagen}',${sino1},${sino2},${sino3})">AGREGAR AL CARRITO</button>`;

        
        if(producto.tamaño != undefined){
        imagen.style.backgroundSize =producto.tamaño;
            
        }
        imagen.style.backgroundImage = `url(${ubicacioncarpeta+producto.imagen})`;
        imagen.style.backgroundPosition = producto.posicionimagen;
        item.appendChild(imagen);
        item.appendChild(h3);
        item.appendChild(p);
        listaProductos.appendChild(item);
    });

   actualizarVisibilidadProductos()
    const botonVerMas = document.getElementById('vermas');
    botonVerMas.addEventListener("click", function () {
        let ocultos = document.querySelectorAll(".listaproductos .producto.oculto");
        ocultos.forEach((producto, index) => {
            if (index < 4 && producto.style.display === "none") {
                if (producto.classList.contains("oculto") && producto.style.display === "none") {
                    let titulo = producto.querySelector(".minititulo").textContent.toLowerCase();
                    let marca = producto.getAttribute("data-marca").toLowerCase();
                    let filtro = document.getElementById("buscar").value.toLowerCase();
                    let marcaSeleccionada = document.getElementById("marcasbuscar").value.toLowerCase();

                    if ((titulo.includes(filtro) || marca.includes(filtro)) && (marcaSeleccionada === "" || marca === marcaSeleccionada)) {
                        producto.style.display = "grid";
                        producto.classList.remove("oculto");
                    }
                }
            }
        });

        actualizarBotonVerMas();
    });
}

function actualizarVisibilidadProductos() {
    let filtro = document.getElementById("buscar").value.toLowerCase();
    let marcaSeleccionada = document.getElementById("marcasbuscar").value.toLowerCase();
    let productos = document.querySelectorAll(".listaproductos .producto");
    let sinResultados = document.getElementById("sinResultados");
    let hayResultados = false;
    let a = 0;
    productos.forEach(producto => {
        let titulo = producto.querySelector(".minititulo").textContent.toLowerCase();
        let marca = producto.getAttribute("data-marca").toLowerCase();
        if ((titulo.includes(filtro) || marca.includes(filtro)) && (marcaSeleccionada === "" || marca === marcaSeleccionada) ) {
            a++
            if(a <= limite){
                producto.style.display = "grid";
                producto.classList.remove("oculto");
            }else{
                producto.style.display = "none";
            producto.classList.add("oculto");
            }
            hayResultados = true;
        } else {
            producto.style.display = "none";
            producto.classList.add("oculto");
        }
    });

    if (sinResultados) {
        sinResultados.style.display = hayResultados ? "none" : "grid";
    }

    actualizarBotonVerMas();
}
function eliminarfiltros(){
    document.getElementById("buscar").value = "";
    document.getElementById("marcasbuscar").value = "";
    actualizarVisibilidadProductos()
}
function actualizarBotonVerMas() {
    const botonVerMas = document.getElementById('vermas');
    const productosOcultos = document.querySelectorAll(".listaproductos .producto.oculto");
    const productosVisibles = document.querySelectorAll(".listaproductos .producto[style*='display: grid']");
    
    if (productosOcultos.length === 0 || productosVisibles.length === 0 || productosVisibles.length < limite) {
        botonVerMas.style.display = "none";
    } else {
        botonVerMas.style.display = "block";
    }
}

document.getElementById("botbuscar").addEventListener("click", actualizarVisibilidadProductos);
document.getElementById("volver").addEventListener("click", eliminarfiltros);
document.getElementById("marcasbuscar").addEventListener("input", function() {
    if (this.value === "") {
        actualizarVisibilidadProductos();
    }
});
document.getElementById("buscar").addEventListener("input", function() {
    if (this.value === "") {
        actualizarVisibilidadProductos();
    }
});
document.getElementById("buscar").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
        actualizarVisibilidadProductos();
    }
});