let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
if(!usuario) window.location.href="index.html";

const rutinasList = document.getElementById("rutinasList");
const agregarRutinaBtn = document.getElementById("agregarRutinaBtn");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");
const compartirBtn = document.querySelector("button.opcion");

// CREAR NUEVA RUTINA
agregarRutinaBtn.addEventListener("click", ()=>{
    localStorage.removeItem("editarRutinaIndex"); // crear nueva
    window.location.href="editarRutina.html";
});

// CERRAR SESIÓN


// RENDERIZAR RUTINAS
function renderRutinas(){
    rutinasList.innerHTML = "";
    (usuario.rutinas || []).forEach((r, i) => {

        const divRutina = document.createElement("div");
        divRutina.classList.add("rutina");

        // Título + botón opciones
        const divTitulo = document.createElement("div");
        divTitulo.classList.add("titulo");

        const h3 = document.createElement("h3");
        h3.textContent = r.nombre;

        const btnOpciones = document.createElement("button");
        btnOpciones.classList.add("boton");
        btnOpciones.classList.add("config");
        btnOpciones.textContent = "⋮";

        // Menu opciones
        const menuOpciones = document.createElement("div");
        menuOpciones.classList.add("opciones");

        menuOpciones.innerHTML = `<button class="editar boton">Editar</button> <button class="eliminar boton">Eliminar</button>`;
        menuOpciones.style.display = "none"
        btnOpciones.addEventListener("click", ()=>{
            menuOpciones.style.display = menuOpciones.style.display==="none"?"grid":"none";
        });

        menuOpciones.querySelector(".editar").addEventListener("click", ()=>{
            localStorage.setItem("editarRutinaIndex", i);
            window.location.href="editarRutina.html";
        });

        menuOpciones.querySelector(".eliminar").addEventListener("click", ()=>{
            if(confirm("¿Eliminar rutina "+r.nombre+"?")){
                usuario.rutinas.splice(i,1);
                localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
                renderRutinas();
            }
        });

        divTitulo.appendChild(h3);
        divTitulo.appendChild(btnOpciones);
        btnOpciones.appendChild(menuOpciones);

        // Ejercicios
        const divEjercicios = document.createElement("div");
        divEjercicios.id = "ejercicios";
        (r.ejercicios || []).forEach(ex=>{
            const p = document.createElement("p");
            const numSeries = ex.series ? ex.series.length : 0;
            p.textContent = `${ex.ejercicio} (${numSeries} ${numSeries===1?"serie":"series"})`;
            divEjercicios.appendChild(p);
        });

        // Botón iniciar rutina
        const btnIniciar = document.createElement("button");
        btnIniciar.type="button";
        btnIniciar.classList.add("boton");
        btnIniciar.textContent = "INICIAR RUTINA";
        btnIniciar.addEventListener("click", ()=>{
            localStorage.setItem("rutinaIndex", i);
            localStorage.setItem("progresoRutina", JSON.stringify({ejercicios:(r.ejercicios||[]).map(ex=>(ex.series||[]).map(s=>false))}));
            window.location.href="ejercicio.html";
        });

        divRutina.appendChild(divTitulo);
        divRutina.appendChild(divEjercicios);
        divRutina.appendChild(btnIniciar);

        rutinasList.appendChild(divRutina);
    });
}

renderRutinas();