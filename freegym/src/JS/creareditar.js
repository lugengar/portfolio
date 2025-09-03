import { getUsuario, setUsuario } from "./store.js";
import { guardarRutinasEnLaNube } from "./cloud.js";
let usuario = getUsuario();
if(!usuario) window.location.href="index.html";

let rutinaEditar = null; 
const exerciseList = document.getElementById("exerciseList");
const nombreRutinaInput = document.getElementById("nombreRutinaInput");
const tituloRutina = document.getElementById("tituloRutina");
const agregarEjercicioBtn = document.getElementById("agregarEjercicioBtn");
const guardarBtn = document.getElementById("guardarBtn");
const cancelarBtn = document.getElementById("cancelarBtn");

// Modal
const modalEjercicios = document.getElementById("modalEjercicios");
const listaModalEjercicios = document.getElementById("listaModalEjercicios");
const buscadorModal = document.getElementById("buscadorModal");
const filtrosMusculo = document.getElementById("filtrosMusculocon");
const filtrosEquipamiento = document.getElementById("filtrosequipamiento");
const cerrarlistaBtn= document.getElementById("cerrarlistaBtn");

let ejerciciosJSON = [];
let abierto = true;

// Cargar JSON de ejercicios
fetch('src/JSON/ejercicios.json')
.then(res => res.json())
.then(data => {
    ejerciciosJSON = data;
    inicializarFiltros();
    cargarRutinaSiEdit();
});

function cargarRutinaSiEdit(){
    const index = localStorage.getItem("editarRutinaIndex");
    if(index!==null){
        rutinaEditar = usuario.rutinas[index];
        nombreRutinaInput.value = rutinaEditar.nombre;
        tituloRutina.textContent = "Editar Rutina";
        rutinaEditar.ejercicios.forEach(ex=>{
            agregarEjercicioLista(ex.ejercicio, ex.series, ex.descripcion, ex.tipo, ex.descanso);
        });
    }
}

let filtroMusculoActivo = "";
let filtroEquipamientoActivo = "";

// Inicializar filtros
async function inicializarFiltros(){
    const resp = await fetch("src/JSON/musculos.json");
    const data = await resp.json();
    const musculos = data.musculos;
    const equipamiento = data.equipamiento;

    filtrosEquipamiento.innerHTML = `<option value="">Equipamiento</option>`;
    filtrosMusculo.innerHTML = `<option value="">Músculos</option>`;

    musculos.forEach(m=>{
        const opt = document.createElement("option");
        opt.value = m.nombre; opt.textContent = m.nombre;
        filtrosMusculo.appendChild(opt);
    });

    equipamiento.forEach(m=>{
        const opt = document.createElement("option");
        opt.value = m.nombre; opt.textContent = m.nombre;
        filtrosEquipamiento.appendChild(opt);
    });

    filtrosMusculo.addEventListener("change", e=>{
        filtroMusculoActivo = e.target.value;
        mostrarListaModal(filtroMusculoActivo, filtroEquipamientoActivo);
    });
    filtrosEquipamiento.addEventListener("change", e=>{
        filtroEquipamientoActivo = e.target.value;
        mostrarListaModal(filtroMusculoActivo, filtroEquipamientoActivo);
    });
    buscadorModal.addEventListener("input", ()=> mostrarListaModal(filtroMusculoActivo, filtroEquipamientoActivo));
}

// Modal
function abrirModalEjercicios(){ 
    abierto = true;
    modalEjercicios.style.display = "grid"; 
    mostrarListaModal(); 
    cerrarlistaBtn.textContent = "✖";
}
function cerrarModal(){ 
    if(!abierto){
        window.location.href="home.html";
    }
    abierto = false;
    modalEjercicios.style.display="none"; 
    buscadorModal.value=""; 
}

// Mostrar ejercicios en modal
function mostrarListaModal(filtroMusculo="", filtroEquipamiento=""){
    listaModalEjercicios.innerHTML = "";
    let lista = ejerciciosJSON;

    const busq = buscadorModal.value.toLowerCase();
    if(busq) lista = lista.filter(e=> e.nombre.toLowerCase().includes(busq));
    if(filtroMusculo) lista = lista.filter(e=> e.musculo===filtroMusculo);
    if(filtroEquipamiento) lista = lista.filter(e=> e.equipamiento===filtroEquipamiento);

    lista.forEach(e=>{
        const li = document.createElement("div");
        li.classList.add("ejericios2");
        const txt = document.createElement("p");
        txt.textContent = `${e.nombre} (${e.musculo} - ${e.equipamiento})`;
        const boton = document.createElement("button");
        boton.classList.add("boton"); boton.textContent="?";
        const img = document.createElement("div"); img.classList.add("imagenejercicio");

        li.addEventListener("click", ()=>{ agregarEjercicioLista(e.nombre, [], "", e.tipo, 60); cerrarModal(); });
        boton.addEventListener("click", ev=>{ ev.stopPropagation(); });

        li.appendChild(img); li.appendChild(txt); li.appendChild(boton);
        listaModalEjercicios.appendChild(li);
    });
}

agregarEjercicioBtn.addEventListener("click", abrirModalEjercicios);
cerrarlistaBtn.addEventListener("click", cerrarModal);

// ---------------- Agregar ejercicio a la lista ----------------
function agregarEjercicioLista(nombre, series=[], descripcion="", tipo="reps", descanso=60){
    const divEj = document.createElement("div");
    divEj.classList.add("ejercicio");
    divEj.dataset.tipo = tipo;

    const h3 = document.createElement("h3");
    h3.textContent = nombre;
    divEj.appendChild(h3);

    const inputDescanso = document.createElement("select");
    inputDescanso.style.marginTop="1vh";
    inputDescanso.innerHTML=`
        <option value="0">Temporizador desactivado</option>
        <option value="5">5 seg</option>
        <option value="10">10 seg</option>
        <option value="20">20 seg</option>
        <option value="30">30 seg</option>
        <option value="60">1 min</option>
        <option value="120">2 min</option>
        <option value="180">3 min</option>
        <option value="240">4 min</option>
        <option value="300">5 min</option>
    `;
    divEj.appendChild(inputDescanso);

    const ulSeries = document.createElement("div");
    ulSeries.classList.add("series-list");
    if(series.length===0) crearSerie(ulSeries, tipo);
    else series.forEach(s=> crearSerie(ulSeries, tipo, s.cantidad, s.peso));
    divEj.appendChild(ulSeries);

    // Botón para agregar series
    const btnAgregarSerie = document.createElement("button");
    btnAgregarSerie.type="button"; btnAgregarSerie.classList.add("boton");
    btnAgregarSerie.textContent = "Agregar Serie";
    btnAgregarSerie.addEventListener("click", ()=> crearSerie(ulSeries, tipo));
    divEj.appendChild(btnAgregarSerie);

    exerciseList.appendChild(divEj);
}

// ---------------- Crear serie ----------------
function crearSerie(ul, tipo="reps", cantidad="", peso=""){
    const liSerie = document.createElement("div");
    liSerie.classList.add("serie");

    const numeroSerie = document.createElement("div");
    numeroSerie.classList.add("numeroSerie","boton");
    numeroSerie.textContent = ul.children.length+1;

    const inputCantidad = document.createElement("input");
    inputCantidad.type="number"; inputCantidad.value = cantidad;
    switch(tipo){
        case "reps": inputCantidad.placeholder="Repeticiones"; break;
        case "kg": inputCantidad.placeholder="Repeticiones"; break;
        case "tiempo": inputCantidad.placeholder="Minutos"; break;
        case "distancia": inputCantidad.placeholder="Km"; break;
    }

    let inputPeso;
    if(tipo==="kg"){
        inputPeso = document.createElement("input");
        inputPeso.type="number"; inputPeso.placeholder="Peso"; inputPeso.value=peso;
    }

    // Swipe para eliminar
    liSerie.addEventListener("touchstart", startTouch, false);
    liSerie.addEventListener("touchmove", moveTouch, false);
    liSerie.addEventListener("touchend", endTouch, false);

    liSerie.appendChild(numeroSerie);
    liSerie.appendChild(inputCantidad);
    if(inputPeso) liSerie.appendChild(inputPeso);

    ul.appendChild(liSerie);

    function startTouch(e){ liSerie.startX = e.touches[0].clientX; }
    function moveTouch(e){
        if(!liSerie.startX) return;
        let diff = e.touches[0].clientX - liSerie.startX;
        liSerie.style.transform = `translateX(${diff}px)`;
        if(diff < -50) liSerie.style.borderBottom="1px solid red"; // aviso visual
    }
    function endTouch(e){
        let diff = e.changedTouches[0].clientX - liSerie.startX;
        if(diff < -100){
            liSerie.remove();
            actualizarNumerosSeries(ul);
        } else liSerie.style.transform="translateX(0px)";
        liSerie.startX = null;
    }
}

function actualizarNumerosSeries(ul){
    ul.querySelectorAll(".serie").forEach((s,i)=> s.querySelector(".numeroSerie").textContent = i+1);
}

// ---------------- Guardar rutina ----------------
guardarBtn.addEventListener("click", async ()=>{
    const nombreRutina = nombreRutinaInput.value.trim();
    if(!nombreRutina) return alert("Ingresa un nombre de rutina");

    const ejercicios = [];
    exerciseList.querySelectorAll(".ejercicio").forEach(divEj=>{
        const nombreEx = divEj.querySelector("h3").textContent;
        const descanso = divEj.querySelector("select").value;
        const tipo = divEj.dataset.tipo;
        const series = [];

        divEj.querySelectorAll(".series-list .serie").forEach(sLi=>{
            const cantidad = sLi.querySelector("input[type=number]").value;
            const peso = sLi.querySelectorAll("input[type=number]")[1]?.value || "";
            if(cantidad) series.push({cantidad,peso});
        });

        if(series.length>0) ejercicios.push({ejercicio:nombreEx, series, tipo, descanso});
    });

    if(ejercicios.length===0) return alert("Agrega al menos un ejercicio con series");

    if(rutinaEditar){
        rutinaEditar.nombre = nombreRutina;
        rutinaEditar.ejercicios = ejercicios;
        localStorage.removeItem("editarRutinaIndex");
    } else {
        usuario.rutinas = usuario.rutinas || [];
        usuario.rutinas.push({nombre:nombreRutina, ejercicios});
    }

    setUsuario(usuario);                     // Guardado local
    await guardarRutinasEnLaNube(usuario);   // Guardado en la nube
    window.location.href="home.html";
});

cancelarBtn.addEventListener("click", ()=>{
    localStorage.removeItem("editarRutinaIndex");
    window.location.href="home.html";
});
