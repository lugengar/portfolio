let bar =false

window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    var scrollPosition = window.scrollY || window.pageYOffset;


    if (scrollPosition >= 100) {
        header.classList.add('hidden');
        header.classList.remove('visible');
    } else {
     
        header.classList.add('visible');
        header.classList.remove('hidden');
    }

});

function sidebar(){
    const circulorojo = document.getElementById('circulorojo');
    circulorojo.style.animation = "none"
circulorojo.style.opacity = "0%"
    bar = !bar
    var sidebar = document.getElementById('sidebar');

    if(bar){
        sidebar.style.transform = "translateX(0%)"
    }else{
        sidebar.style.transform = "translateX(110%)"
    }
}
const pedidos = [];
sino= true
function carrito(nombre, precio, foto) {
   
if(sino){
    sino = false;
    setTimeout(() => {
        sino = true;
      }, 1000);
    const container = document.getElementById('carrito-container');
    const circulorojo = document.getElementById('circulorojo');
    const totaldiv = document.getElementById('total');
    const carrito = document.getElementById('rayas');
    circulorojo.style.opacity = "100%"
    circulorojo.style.animation = "titilar 1s infinite both"

    circulorojo.style.animationPlayState = "running"
    let total = 0;

   

    // Crear elementos
    const pedidoDiv = document.createElement('div');
    pedidoDiv.className = 'pedido';
    const imagenDiv = document.createElement('div');
    imagenDiv.className = 'imagenp';
    imagenDiv.style.backgroundImage = `url('${foto}')`;

    const imagenDiv2 = document.createElement('div');
    imagenDiv2.className = 'imagenp2';
    imagenDiv2.style.backgroundImage = `url('${foto}')`;

    const botonEliminar = document.createElement('button');
    botonEliminar.className = 'botonegro';
    botonEliminar.textContent = 'Eliminar';

    const titulo = document.createElement('h1');
    titulo.textContent = nombre;

    const precioP = document.createElement('p');
    precioP.textContent = `$${precio}`;

    // Agregar elementos al pedidoDiv
    pedidoDiv.appendChild(imagenDiv);
    carrito.appendChild(imagenDiv2);
    pedidoDiv.appendChild(botonEliminar);
    pedidoDiv.appendChild(titulo);
    pedidoDiv.appendChild(precioP);

    // Agregar pedidoDiv al container
    container.appendChild(pedidoDiv);

    // Guardar en la lista
    const pedido = { nombre, precio, foto, elemento: pedidoDiv };
    pedidos.push(pedido);

    // Evento eliminar
    botonEliminar.onclick = function() {
        eliminar(pedido);
    };
    pedidos.forEach(pedido => {
        total += Number(pedido.precio);
    });
    totaldiv.textContent = "TOTAL: $"+total
     }
}
function enviarPedido() {
    if (pedidos.length === 0) {
        alert("No hay pedidos para enviar.");
        return;
    }

    let mensaje = "Hola, quiero pedir:\n\n";
    let total = 0;

    pedidos.forEach(pedido => {
        mensaje += `- ${pedido.nombre} ($${pedido.precio})\n`;
        total += Number(pedido.precio);
    });

    mensaje += `\nTotal: $${total}`;

    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);

    // Número de WhatsApp (poné tu número real o uno de prueba)
    const numeroWhatsApp = "541125955288"; // <-- Cambiá este número

    // Abrir WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, "_blank");
}
function eliminar(pedido) {
    // Eliminar del DOM
    pedido.elemento.remove();
    // Eliminar de la lista
    const index = pedidos.indexOf(pedido);
    if (index !== -1) {
        pedidos.splice(index, 1);
    }
}
function redirigir(href){
    var sidebar = document.getElementById('sidebar');
    document.querySelector("#"+href).scrollIntoView({ behavior: 'smooth' });
    if(bar == true){
        bar = !bar
        sidebar.style.transform = "translateX(110%)"
    }
}
function consultar(consulta,producto){
    var asunto = document.getElementById('asunto');
    var mensaje = document.getElementById('mensaje');
    if(consulta=="COTIZACIÓN PRODUCTOS"){
        mensaje.textContent = "Hola, quisiera saber la cotización del "+consulta+' '+producto+". Gracias."
    }else  if(consulta=="COTIZACIÓN SERVICIOS"){
        mensaje.textContent = "Hola, quisiera saber la cotización del "+producto+". Gracias."
    }
    asunto.value = consulta
    document.querySelector("#contacto").scrollIntoView({ behavior: 'smooth' });
    
}

