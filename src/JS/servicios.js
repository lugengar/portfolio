async function cargarServicios() {
  const contenedor = document.getElementById("listaservicios");

  // Cargar JSON
  const respuesta = await fetch("src/JSON/servicios.json");
  const data = await respuesta.json();

  // Generar HTML dinámico
  data.servicios.forEach(servicio => {
    const div = document.createElement("div");
    div.classList.add("servicio", "escondido");

    // Título
    const h3 = document.createElement("h3");
    h3.textContent = servicio.titulo;
    div.appendChild(h3);

    // Lista
    const ul = document.createElement("ul");
    ul.classList.add("custom-ul");

    servicio.items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });

    div.appendChild(ul);

    // Botón
    const boton = document.createElement("button");
    boton.textContent = "COTIZAR AHORA";
    div.appendChild(boton);

    // ✅ callback correcto
    boton.addEventListener("click", () => {
      escribirmensaje("¡Hola! Estoy interesado en el servicio de " + servicio.titulo + ". ¿Podrían enviarme más información y una cotización?");
    });

    contenedor.appendChild(div);
  });

  const cajas = document.querySelectorAll(".escondido");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("mostrar"); // aparece al scrollear
      }
    });
  });

  cajas.forEach(caja => observer.observe(caja));
}

// Ejecutar al cargar
cargarServicios();

function escribirmensaje(mensaje){
  document.getElementById("Mensaje").value = mensaje;
  redirigir("contacto")
}
