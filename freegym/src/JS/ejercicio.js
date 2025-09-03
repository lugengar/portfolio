import { getUsuario, setUsuario } from "./store.js";
import { guardarRutinasEnLaNube } from "./cloud.js";
let usuario = getUsuario();
if (!usuario) window.location.href = "index.html";

let rutinaIndex = parseInt(localStorage.getItem("rutinaIndex"));
let rutina = usuario.rutinas[rutinaIndex];

// Elementos
const ejerciciosList = document.getElementById("exerciseList");
const descansoBar = document.getElementById("descansoBar");
const descansoTexto = document.getElementById("descansoTexto");
const progressGeneral = document.getElementById("progressGeneral");
const modalEjercicios = document.getElementById("modalEjercicios");
const listaModalEjercicios = document.getElementById("listaModalEjercicios");
const buscadorModal = document.getElementById("buscadorModal");
const filtrosMusculo = document.getElementById("filtrosMusculocon");
const filtrosEquipamiento = document.getElementById("filtrosequipamiento");
const agregarEjercicioBtn = document.getElementById("agregarEjercicioBtn");
const cerrarlistaBtn = document.getElementById("cerrarlistaBtn");

let ejerciciosJSON = [];
let progreso = JSON.parse(localStorage.getItem("progresoRutina")) || {
    ejercicios: rutina.ejercicios.map(ex => ex.series.map(s => false))
};

// Variables descanso
let descansoInterval = null;
let descansoSegundos = 0, descansoMax = 0;
let abierto = false
// Variables modal
let filtroMusculoActivo = "";
let filtroEquipamientoActivo = "";

// ---------------- Inicialización ----------------
document.getElementById("tituloRutina").textContent = rutina.nombre;

// Cargar JSON de ejercicios
fetch('src/JSON/ejercicios.json')
.then(res => res.json())
.then(data => {
    ejerciciosJSON = data;
    inicializarFiltros();
});

// ---------------- Render de ejercicios ----------------
function renderEjercicios(){
    ejerciciosList.innerHTML = "";
    rutina.ejercicios.forEach((ex,i)=>{
        const divEj = document.createElement("div");
        divEj.classList.add("ejercicio");
        divEj.dataset.tipo = ex.tipo;

        const h3 = document.createElement("h3");
        h3.textContent = ex.ejercicio;
        divEj.appendChild(h3);

        const ulSeries = document.createElement("div");
        ulSeries.classList.add("series-list");

        ex.series.forEach((s,j)=>{
            crearSerie(ulSeries, ex.tipo, s.cantidad, s.peso, i, j, s.descanso || 60);
        });

        // Botón para agregar series
        const btnAgregar = document.createElement("button");
        btnAgregar.type = "button";
        btnAgregar.classList.add("boton");
        btnAgregar.textContent = "Agregar Serie";
        btnAgregar.addEventListener("click", ()=>{
            crearSerie(ulSeries, ex.tipo, "", "", i, ulSeries.children.length, ex.descanso || 60);
        });

        divEj.appendChild(ulSeries);
        divEj.appendChild(btnAgregar);
        ejerciciosList.appendChild(divEj);
    });

    actualizarProgresoGeneral();
}

// ---------------- Crear serie ----------------
function crearSerie(ul, tipo="reps", cantidad="", peso="", exIndex=0, serieIndex=0, descanso=60){
    const divSerie = document.createElement("div");
    divSerie.classList.add("serie");

    const numero = document.createElement("div");
    numero.classList.add("numeroSerie","boton");
    numero.textContent = serieIndex+1;

    const inputCantidad = document.createElement("input");
    inputCantidad.type="number";
    inputCantidad.placeholder = (tipo==="tiempo")?"Minutos":(tipo==="distancia")?"Km":"Cantidad";
    inputCantidad.value = cantidad;

    let inputPeso;
    if(tipo==="kg"){
        inputPeso = document.createElement("input");
        inputPeso.type="number";
        inputPeso.placeholder="Peso";
        inputPeso.value = peso;
    }

    const btnCheck = document.createElement("button");
    btnCheck.type = "button";
    btnCheck.classList.add("check");
    btnCheck.textContent = "✔";

    // Verificar medalla según historial
    function agregarMedalla(exIndex, serieIndex, cantidad, peso) {
        usuario.historial = usuario.historial || [];
        
        // Buscar historial de esta rutina
        let histRutina = usuario.historial.find(h => h.rutina === rutina.nombre);
        if(!histRutina){
            // Primera vez que se hace la rutina: crear historial pero sin logros
            histRutina = { rutina: rutina.nombre, ejercicios: rutina.ejercicios.map(ex => ex.series.map(s => ({ cantidad: s.cantidad, peso: s.peso, completado: false }))) };
            usuario.historial.push(histRutina);
            return; // No mostrar logros en la primera vez
        }
    
        const serieHist = histRutina.ejercicios[exIndex][serieIndex];
        const actual = parseFloat(cantidad || 0) * parseFloat(peso || 1);
        const mejor = parseFloat(serieHist.cantidad || 0) * parseFloat(serieHist.peso || 1);
    
        if(actual > mejor){
            serieHist.cantidad = cantidad;
            serieHist.peso = peso;
            // Mostrar medalla visual
            const numero = ejerciciosList.children[exIndex].querySelectorAll(".serie .numeroSerie")[serieIndex];
            numero.textContent = `🏅`;
        }
    
        setUsuario(usuario);
    }
    

    btnCheck.addEventListener("click", ()=>{
        const completado = divSerie.classList.toggle("completed");
        btnCheck.classList.toggle("completed", completado);
        progreso.ejercicios[exIndex][serieIndex] = completado;
        localStorage.setItem("progresoRutina", JSON.stringify(progreso));
    
        if(completado){
            agregarMedalla(exIndex, serieIndex, inputCantidad.value, inputPeso?.value);
            iniciarDescanso(descanso);
        }
    
        actualizarProgresoGeneral();
    });
    

    divSerie.appendChild(numero);
    divSerie.appendChild(inputCantidad);
    if(inputPeso) divSerie.appendChild(inputPeso);
    divSerie.appendChild(btnCheck);

    ul.appendChild(divSerie);
}

// ---------------- Barra de descanso ----------------
function iniciarDescanso(segundos){
    if(descansoInterval) clearInterval(descansoInterval);
    descansoMax = segundos;
    descansoSegundos = segundos;
    actualizarDescanso();
    descansoInterval = setInterval(()=>{
        descansoSegundos--;
        actualizarDescanso();
        if(descansoSegundos<=0) clearInterval(descansoInterval);
    },1000);
}

function actualizarDescanso(){
    const porcentaje = (descansoSegundos/descansoMax)*100;
    descansoBar.style.width = porcentaje + "%";
    descansoTexto.textContent = descansoSegundos>0?`${descansoSegundos}s`:"Listo para la siguiente serie";
}

// ---------------- Barra de progreso general ----------------
function actualizarProgresoGeneral(){
    const total = progreso.ejercicios.flat().length;
    const completados = progreso.ejercicios.flat().filter(s=>s).length;
    const porcentaje = total? (completados/total)*100 : 0;
    progressGeneral.style.width = porcentaje + "%";
}

// ---------------- Modal de ejercicios ----------------
function inicializarFiltros(){
    fetch("src/JSON/musculos.json").then(r=>r.json()).then(data=>{
        const musculos = data.musculos;
        const equipamiento = data.equipamiento;

        filtrosEquipamiento.innerHTML = `<option value="">Equipamiento</option>`;
        filtrosMusculo.innerHTML = `<option value="">Músculos</option>`;

        musculos.forEach(m=>{
            const opt = document.createElement("option");
            opt.value = m.nombre; opt.textContent = m.nombre;
            filtrosMusculo.appendChild(opt);
        });

        equipamiento.forEach(e=>{
            const opt = document.createElement("option");
            opt.value = e.nombre; opt.textContent = e.nombre;
            filtrosEquipamiento.appendChild(opt);
        });

        filtrosMusculo.addEventListener("change", e=>{
            filtroMusculoActivo = e.target.value;
            mostrarListaModal();
        });
        filtrosEquipamiento.addEventListener("change", e=>{
            filtroEquipamientoActivo = e.target.value;
            mostrarListaModal();
        });
        buscadorModal.addEventListener("input", ()=> mostrarListaModal());
    });
}

function abrirModalEjercicios(){
    abierto = true
    modalEjercicios.style.display = "grid";
    mostrarListaModal();
}
function cerrarModal(){
    if(!abierto){
        window.location.href = "home.html";
    }
    abierto = false
    modalEjercicios.style.display = "none";
    buscadorModal.value = "";
}

function mostrarListaModal(){
    listaModalEjercicios.innerHTML = "";
    let lista = ejerciciosJSON;

    const busq = buscadorModal.value.toLowerCase();
    if(busq) lista = lista.filter(e=> e.nombre.toLowerCase().includes(busq));
    if(filtroMusculoActivo) lista = lista.filter(e=> e.musculo === filtroMusculoActivo);
    if(filtroEquipamientoActivo) lista = lista.filter(e=> e.equipamiento === filtroEquipamientoActivo);

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

// ---------------- Agregar ejercicio desde modal ----------------
function agregarEjercicioLista(nombre, series=[], tipo="reps", descanso=60){
    const divEj = document.createElement("div");
    divEj.classList.add("ejercicio");
    divEj.dataset.tipo = tipo;

    const h3 = document.createElement("h3");
    h3.textContent = nombre;
    divEj.appendChild(h3);

    const ulSeries = document.createElement("div");
    ulSeries.classList.add("series-list");

    if(series.length===0) crearSerie(ulSeries, tipo);
    else series.forEach((s,j)=> crearSerie(ulSeries, tipo, s.cantidad, s.peso, 0, j, descanso));

    divEj.appendChild(ulSeries);

    const btnAgregarSerie = document.createElement("button");
    btnAgregarSerie.type="button"; btnAgregarSerie.classList.add("boton");
    btnAgregarSerie.textContent = "Agregar Serie";
    btnAgregarSerie.addEventListener("click", ()=> crearSerie(ulSeries, tipo));

    divEj.appendChild(btnAgregarSerie);
    ejerciciosList.appendChild(divEj);

    // Actualizar progreso
    progreso.ejercicios.push(series.map(()=>false));
    actualizarProgresoGeneral();
}

// ---------------- Finalizar rutina ----------------
document.getElementById("guardarBtn").addEventListener("click", async () => {
    rutina.ejercicios = [];
    const historialEjercicios = [];

    ejerciciosList.querySelectorAll(".ejercicio").forEach((divEj, exIndex) => {
        const nombre = divEj.querySelector("h3").textContent;
        const tipo = divEj.dataset.tipo;
        const descanso = 60;

        const series = [];
        const seriesHistorial = [];

        divEj.querySelectorAll(".series-list .serie").forEach((sLi, serieIndex) => {
            const inputs = sLi.querySelectorAll("input[type=number]");
            const cantidad = inputs[0]?.value || "";
            const peso = inputs[1]?.value || "";
            const completado = sLi.classList.contains("completed");

            if (cantidad) {
                series.push({ cantidad, peso, descanso });

                let medalla = false;
                if (usuario.historial?.length) {
                    let mejorSerie = 0;
                    usuario.historial.forEach(h => {
                        if (h.rutina === rutina.nombre && h.ejercicios[exIndex]) {
                            const serieHist = h.ejercicios[exIndex].series?.[serieIndex];
                            if (serieHist) {
                                const val = parseFloat(serieHist.cantidad || 0) * parseFloat(serieHist.peso || 1);
                                if (val > mejorSerie) mejorSerie = val;
                            }
                        }
                    });
                    const actual = parseFloat(cantidad) * parseFloat(peso || 1);
                    if (actual > mejorSerie) medalla = true;
                }

                seriesHistorial.push({ cantidad, peso, completado, medalla });
            }
        });

        if (series.length > 0) rutina.ejercicios.push({ ejercicio: nombre, series, tipo, descanso });
        historialEjercicios.push({ ejercicio: nombre, series: seriesHistorial });
    });

    // Guardar historial local
    if (!usuario.historial) usuario.historial = [];
    usuario.historial.push({
        fecha: new Date().toISOString(),
        rutina: rutina.nombre,
        ejercicios: historialEjercicios
    });

    setUsuario(usuario);
    localStorage.removeItem("progresoRutina");

    // ---------------- Guardar en la nube ----------------
    try {
        await guardarRutinasEnLaNube(usuario);
        console.log("Rutinas guardadas en la nube correctamente");
    } catch (err) {
        console.error("Error guardando en la nube:", err);
    }

    // Redirigir
    window.location.href = "historial.html";
});


// ---------------- Inicial render ----------------
renderEjercicios();
