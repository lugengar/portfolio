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

function renderProductos(info) {
    ubicacioncarpeta = info.configuracion.ubicacioncarpeta;
    productos = info.imagenes;
    const listaProductos = document.querySelector('.listaproductos');
    let indice = 0;
    
    productos.forEach(producto => {
        indice++;
        const item = document.createElement('div');
        const h3 = document.createElement('h1');
        const p = document.createElement('p');
        
        if (indice > 4) {
            item.style.display = "none";
            item.classList.add("oculto");
        }
        
        p.classList.add('texto');
        h3.textContent = producto.titulo;
        p.textContent = "$"+producto.precio;
        item.classList.add('producto');
        h3.classList.add('minititulo');
        item.setAttribute("data-marca", producto.marca);
        item.innerHTML = `<button class="botonegro" onclick="carrito('${producto.titulo}','${producto.precio}','${ubicacioncarpeta+producto.imagen}')">AGREGAR AL CARRITO</button>`;
       item.style.backgroundImage = `url(${ubicacioncarpeta+producto.imagen})`;
        item.style.backgroundPosition = producto.posicionimagen;
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
            if(a <= 4){
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
    
    if (productosOcultos.length === 0 || productosVisibles.length === 0 || productosVisibles.length < 4) {
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