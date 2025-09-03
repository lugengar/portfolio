import { getUsuario } from "./store.js";
import { crearElemento, crearBoton } from "./uiHelpers.js";
import { deleteRutina } from "./rutinasStore.js";

const usuario = getUsuario();
if(!usuario) window.location.href = "index.html";

document.getElementById("welcome").textContent = `Bienvenido, ${usuario.nombre}`;

const rutinasList = document.getElementById("rutinasList");
const agregarRutinaBtn = document.getElementById("agregarRutinaBtn");

agregarRutinaBtn.addEventListener("click", ()=>{
    localStorage.removeItem("editarRutinaIndex");
    window.location.href="editarRutina.html";
});

function renderRutinas(){
    rutinasList.innerHTML = "";
    (usuario.rutinas || []).forEach((r, i) => {
        const divRutina = crearElemento("div","rutina");

        const divTitulo = crearElemento("div","titulo");
        const h3 = crearElemento("h3","",r.nombre);
        const btnOpciones = crearBoton("⋮", ()=>{ 
            menuOpciones.style.display = menuOpciones.style.display==="none"?"grid":"none"; 
        });
        btnOpciones.classList.add("config");

        const menuOpciones = crearElemento("div","opciones");
        menuOpciones.style.display="none";
        menuOpciones.innerHTML = `<button class="editar boton">Editar</button> <button class="eliminar boton">Eliminar</button>`;

        menuOpciones.querySelector(".editar").addEventListener("click", ()=>{
            localStorage.setItem("editarRutinaIndex", i);
            window.location.href="editarRutina.html";
        });

        menuOpciones.querySelector(".eliminar").addEventListener("click", (ev)=>{
            ev.stopPropagation();
            if(confirm("¿Eliminar rutina " + r.nombre + "?")){
                deleteRutina(i);
                const parent = ev.target.closest(".rutina");
                if(parent) parent.remove();
            }
        });

        divTitulo.append(h3, btnOpciones);
        btnOpciones.appendChild(menuOpciones);

        const divEjercicios = crearElemento("div","ejercicios");
        (r.ejercicios||[]).forEach(ex=>{
            const p = crearElemento("p","",""+ex.ejercicio+" ("+(ex.series?.length||0)+" series)");
            divEjercicios.appendChild(p);
        });

        const btnIniciar = crearBoton("Iniciar rutina", ()=>{
            localStorage.setItem("rutinaIndex", i);
            localStorage.setItem("progresoRutina", JSON.stringify({ejercicios:(r.ejercicios||[]).map(ex=>(ex.series||[]).map(()=>false))}));
            window.location.href="ejercicio.html";
        });

        divRutina.append(divTitulo, divEjercicios, btnIniciar);
        rutinasList.appendChild(divRutina);
    });
}

renderRutinas();
