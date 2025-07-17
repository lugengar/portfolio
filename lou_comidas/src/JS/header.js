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


function sidebar() {
  total();
  const circulorojo = document.getElementById('circulorojo');
  const rayas = document.getElementById('rayas');
  circulorojo.style.animation = "none";
  rayas.style.animation = "none";
  circulorojo.style.opacity = "0%";
  bar = !bar;
  var sidebar = document.getElementById('sidebar');

  if (bar) {
    sidebar.style.transform = "translateX(0%)";
    // Cuando abro el sidebar, agrego un estado al historial para detectar "atrás"
    history.pushState({ sidebarOpen: true }, "");
  } else {
    sidebar.style.transform = "translateX(110%)";
  }
}

// Escucho el evento popstate para el botón atrás
// Detectar botón atrás para cerrar el sidebar si está abierto
window.addEventListener('popstate', function(event) {
    if (bar) {
      // Si sidebar está abierto, lo cierro y cancelo la navegación "atrás"
      sidebar();
      history.pushState({ sidebarOpen: false }, "");
    } else {
      // Sidebar cerrado → dejamos que el historial funcione normalmente
    }
  });
  
  // Inicializo con un estado para poder detectar popstate luego
  history.replaceState({ sidebarOpen: false }, "");
  
  // Detectar si el usuario quiere salir o recargar la web
  window.addEventListener('beforeunload', function (e) {
    if (totalCarrito > 0) {
      // Mostrar alerta estándar del navegador
      e.preventDefault();
      e.returnValue = ''; // Obligatorio para que funcione en la mayoría de navegadores
    }
  });
  

sino= true
function verSeleccionados(nombre) {
    const seleccionados = Array.from(document.querySelectorAll('input[name="'+nombre+'"]:checked'))
      .map(cb => cb.value);
  
    const nombres = [];
    let total = 0;
  
    seleccionados.forEach(item => {
      const [nombre, precioStr] = item.split(',');
      nombres.push(nombre.trim());
      total += parseInt(precioStr);
    });
  
    // Armar la frase de nombres con "y"
    let nombresStr = '';
    if (nombres.length === 1) {
      nombresStr = nombres[0];
    } else if (nombres.length === 2) {
      nombresStr = `${nombres[0]} y ${nombres[1]}`;
    } else {
      nombresStr = nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1];
    }
  
    return {
      nombres: nombresStr,
      total
    };
  }
 
  function verSeleccionado(value) {
    const [nombre, precioStr] = value.split(',');
    console.log(nombre.trim())
    return {
      nombres: nombre.trim(),
      total: parseInt(precioStr)
    };
  }
  
  
  function carrito2(nombre, precio, foto, sino2=false, sino3=false, sino4=false){
    const opciones = document.getElementById('opciones');
    opciones.innerHTML = '<button class="botonegro2" >SALIR</button>'
    opciones.style.display = "grid"
    const item = document.getElementById('item_'+nombre);
    const copia = item.cloneNode(true);
    
    opciones.appendChild(copia);
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
        seleccionados = {}
        if(sino3){ 
            seleccionados = verSeleccionado(document.getElementById('p2_'+nombre).value)
            precio = parseInt(precio) + seleccionados.total;
        }
        if(sino4){ 
            seleccionados = verSeleccionados(nombre)
            precio = parseInt(precio) + seleccionados.total;
        }
        
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
            if(valor != ""){ 
                const opciond = document.createElement('p');
                opciond.className = 'texto, opcionp2';
                if (seleccionados.nombres != undefined) {
                    opciond.textContent = "Con " + seleccionados.nombres;
                  }
                  
                pedidoDiv.appendChild(opciond);
                adicional = "Con "+(seleccionados?.nombres || " ")
            }
        }
        if(sino4){ 
            adicional = "Con "+(seleccionados?.nombres || " ")
            console.log(adicional)
            valor = document.getElementById('p2_'+nombre).value
            const opciond = document.createElement('p');
            opciond.className = 'texto, opcionp2';
            console.log(seleccionados.nombres)
            if (seleccionados.nombres != " y undefined") {
                opciond.textContent = "Con " + seleccionados.nombres;
              }
              
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

