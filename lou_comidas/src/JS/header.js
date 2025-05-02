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
const pedidos = [];

function total(){
    const totaldiv = document.getElementById('total');
    let total = 0;
    if(pedidos.length > 0)
    { 
        pedidos.forEach(pedido => {
            total += Number(pedido.precio);
        });
    }
    totaldiv.textContent = "TOTAL: $"+total
}

function sidebar(){
    total()
    const circulorojo = document.getElementById('circulorojo');
    const rayas = document.getElementById('rayas');
    circulorojo.style.animation = "none"
    rayas.style.animation = "none"
    circulorojo.style.opacity = "0%"
    bar = !bar
    var sidebar = document.getElementById('sidebar');

    if(bar){
        sidebar.style.transform = "translateX(0%)"
    }else{
        sidebar.style.transform = "translateX(110%)"
    }
}

sino= true
function verSeleccionados(nombre) {
    const seleccionados = Array.from(document.querySelectorAll('input[name="'+nombre+'"]:checked'))
      .map(cb => cb.value);
    
    return seleccionados;
    // Podés mostrarlos también en el HTML si querés
  }
function carrito(nombre, precio, foto, sino2=false, sino3=false, sino4=false) {
    opcion = ""
    adicional = ""
    if(sino){
        sino = false;
        setTimeout(() => {
            sino = true;
        }, 500);
        const container = document.getElementById('carrito-container');
        const circulorojo = document.getElementById('circulorojo');
        const carrito = document.getElementById('rayas');
        circulorojo.style.opacity = "100%"
        circulorojo.style.animation = "titilar 1s infinite both"
        carrito.style.animation = "mover 1s infinite both "

        circulorojo.style.animationPlayState = "running"
       

        // Crear elementos
        const pedidoDiv = document.createElement('div');
        pedidoDiv.className = 'pedido';

        
        const imagenDiv = document.createElement('div');
        imagenDiv.className = 'imagenp';
        imagenDiv.style.backgroundImage = `url('${foto}')`;

        const imagenDiv2 = document.createElement('div');
        imagenDiv2.className = 'imagenp2';
        imagenDiv2.style.backgroundImage = `url('${foto}')`;
        setTimeout(() => {
            imagenDiv2.remove()
        }, 2000);
        const botonEliminar = document.createElement('button');
        botonEliminar.className = 'botonegro';
        botonEliminar.textContent = 'Eliminar';

        const titulo = document.createElement('h1');
        titulo.textContent = nombre;

        const precioP = document.createElement('p');
        precioP.textContent = `$${precio}`;
        if(sino2){ 
            valor = document.getElementById('p_'+nombre).value
            const opciond = document.createElement('p');
            opciond.className = 'texto, opcionp';
            opciond.textContent = "De "+valor;
            pedidoDiv.appendChild(opciond);
            opcion = "De "+valor
        }
        if(sino3){ 
            valor = document.getElementById('p2_'+nombre).value
            const opciond = document.createElement('p');
            opciond.className = 'texto, opcionp2';
            opciond.textContent = "Con "+valor
            pedidoDiv.appendChild(opciond);
            adicional = "Con "+valor
        }
        if(sino4){ 
            adicional = "Con "+verSeleccionados(nombre)
            console.log(adicional)
            valor = document.getElementById('p2_'+nombre).value
            const opciond = document.createElement('p');
            opciond.className = 'texto, opcionp2';
            opciond.textContent = adicional
            pedidoDiv.appendChild(opciond);
        }
        // Agregar elementos al pedidoDiv
        pedidoDiv.appendChild(imagenDiv);
        carrito.appendChild(imagenDiv2);
        pedidoDiv.appendChild(botonEliminar);
        pedidoDiv.appendChild(titulo);
        pedidoDiv.appendChild(precioP);

        // Agregar pedidoDiv al container
        container.appendChild(pedidoDiv);

        // Guardar en la lista
        const pedido = { nombre, precio, foto, opcion, adicional, elemento: pedidoDiv };
        pedidos.push(pedido);

        // Evento eliminar
        botonEliminar.onclick = function() {
            eliminar(pedido);
        };
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
        mensaje += `- ${pedido.nombre}`;

        if(pedido.opcion != ""){

            mensaje += ` ${pedido.opcion}`;

        }
        if(pedido.adicional != ""){

            mensaje += ` ${pedido.adicional}`;

        }
        mensaje += ` ($${pedido.precio})\n`;

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
    total()
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

