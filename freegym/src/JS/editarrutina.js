let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
if(!usuario) window.location.href="index.html";

let ejerciciosJSON = [];
let rutinaEditar = null; // null = crear, si viene será editar
let abierto= false;
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
// Cargar ejercicios
fetch('src/JSON/ejercicios.json')
  .then(res => res.json())
  .then(data => {
    ejerciciosJSON = data;
    inicializarFiltros();
    cargarRutinaSiEdit();
  });

// Cargar rutina si viene a editar
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
// Inicializar filtros por músculo
async function inicializarFiltros() { 
    // Cargar JSON de músculos
    
    const respuesta = await fetch("src/JSON/musculos.json");
    const data = await respuesta.json();
    const musculos = data.musculos;
    const equipamiento = data.equipamiento;

    // Limpiar el select y poner la opción "Todos"
    filtrosEquipamiento.innerHTML = `
    <option value="">Equipamiento</option>
    `;
    filtrosMusculo.innerHTML = `
        <option value="">Músculos</option>
    `;

    // Crear opciones dinámicamente
    musculos.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.nombre;          // usar value en vez de dataset
        opt.textContent = m.nombre;
        filtrosMusculo.appendChild(opt);
    });
    equipamiento.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.nombre;          // usar value en vez de dataset
        opt.textContent = m.nombre;
        filtrosEquipamiento.appendChild(opt);
    });

    // Eventos de cambio
    filtrosMusculo.addEventListener("change", (e) => {
        filtroMusculoActivo = e.target.value;
        mostrarListaModal(filtroMusculoActivo, filtroEquipamientoActivo);
    });

    filtrosEquipamiento.addEventListener("change", (e) => {
        filtroEquipamientoActivo = e.target.value;
        mostrarListaModal(filtroMusculoActivo, filtroEquipamientoActivo);
    });

    // Buscador también refresca con ambos filtros
    buscadorModal.addEventListener("input", () => {
        mostrarListaModal(filtroMusculoActivo, filtroEquipamientoActivo);
    });

}


async function inicializarFiltros2() { 
    // Cargar JSON de músculos
    const respuesta = await fetch("src/JSON/musculos.json");
    const data = await respuesta.json();
    const musculos = data.musculos;

    // Contenedor de botones
    filtrosMusculo.innerHTML = `
        <button class="filtroMusculo seleccionado" data-musculo="">
            <div style="background-image: url(src/SVG/todos0.svg); background-size: contain; background-position: center;"></div>
            <p>Todos</p>
        </button>
    `;

    // Crear botones dinámicamente
    musculos.forEach(m => {
        const btn = document.createElement("button");
        btn.classList.add("filtroMusculo");
        btn.dataset.musculo = m.nombre

        btn.innerHTML = `
            <div style="
                background-image: url(${m.archivo});
                background-position: ${btn.dataset.position};
            "></div>
            <p>${m.nombre}</p>
        `;
        filtrosMusculo.appendChild(btn);
    });

    // Eventos de click
    document.querySelectorAll(".filtroMusculo").forEach(btn => {
        btn.addEventListener("click", () => {
            mostrarListaModal(btn.dataset.musculo);
        });
    });
    //mostrarListaModal("");
}


modalEjercicios.style.display="none"; 
// Modal ejercicios
function abrirModalEjercicios(){ 
    abierto = true;
    modalEjercicios.style.display = "grid"; 
    mostrarListaModal(); 
    cerrarlistaBtn.textContent = "✖"
}
function cerrarModal(){ 
    if(!abierto){
        window.location.href="rutinas.html";
    }else{
        cerrarlistaBtn.textContent = "Salir"
        abierto = false;
        modalEjercicios.style.display="none"; 
        buscadorModal.value=""; 
    }
}

// Mostrar lista en modal
function mostrarListaModal(filtroMusculo = "", filtroEquipamiento = "") {
    listaModalEjercicios.innerHTML = "";
    let lista = ejerciciosJSON;

    const busq = buscadorModal.value.toLowerCase();
    if (busq) lista = lista.filter(e => e.nombre.toLowerCase().includes(busq));
    if (filtroMusculo) lista = lista.filter(e => e.musculo === filtroMusculo);
    if (filtroEquipamiento) lista = lista.filter(e => e.equipamiento === filtroEquipamiento);

    lista.forEach(e => {
        const li = document.createElement("div");
        const txt = document.createElement("p");
        const img = document.createElement("div");
        const boton = document.createElement("button");

        boton.classList.add("boton");
        boton.textContent = "?";
        img.classList.add("imagenejercicio");
        li.classList.add("ejericios2");

        txt.textContent = `${e.nombre} (${e.musculo} - ${e.equipamiento})`;

        // Click en el contenedor (agregar ejercicio)
        li.addEventListener("click", () => {
            agregarEjercicioLista(e.nombre, [], "", e.tipo, 60);
            cerrarModal();
        });

        // Click en el botón (info o lo que quieras)
        boton.addEventListener("click", (ev) => {
            ev.stopPropagation();
            console.log("click en botón de", e.nombre);
        });

        li.appendChild(img);
        li.appendChild(txt);
        li.appendChild(boton);

        listaModalEjercicios.appendChild(li);
    });
}


buscadorModal.addEventListener("input", ()=>{ mostrarListaModal(); });
agregarEjercicioBtn.addEventListener("click", ()=>{ abrirModalEjercicios(); });
cerrarlistaBtn.addEventListener("click", cerrarModal );

// Agregar ejercicio a lista visual
function agregarEjercicioLista(nombre, series=[], descripcion="", tipo="reps", descanso=60){
    const divEj = document.createElement("div");
    divEj.classList.add("ejercicio");

    const h3 = document.createElement("h3");
    const falserie = document.createElement("div");
    h3.textContent = nombre;
    divEj.appendChild(h3);
    falserie.classList.add("serie2")
    switch(tipo){
        case "reps":
            falserie.innerHTML =`
            <div></div><p>Repeticiones</div><div></p><div></div>
            `
            break;
        case "kg":

            falserie.innerHTML =`
            <div></div><p>Repeticiones</p><p>Peso</p><div></div>
            `
            break;
        case "tiempo":
            falserie.innerHTML =`
            <div></div><p>Repeticiones</p><p>Minutos</p><div></div>
            `
            break;
        case "distancia":
            falserie.innerHTML =`
            <div></div><p>Repeticiones</p><p>Km</p><div></div>
            `
            break;
        default:
            falserie.innerHTML =`
            <div></div><p>Repeticiones</div><div></p><div></div>
            `
    }
    
    // input descanso por ejercicio
    const inputDescanso = document.createElement("select");
    inputDescanso.style.marginTop="1vh"
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
    `
    divEj.appendChild(inputDescanso);
    divEj.appendChild(falserie);

    const ulSeries = document.createElement("div");
    ulSeries.classList.add("series-list");

    // Agregar series existentes
    series.forEach(s=>{
        crearSerie(ulSeries, tipo, s.cantidad, s.peso);
    });

    // **Agregar automáticamente una serie si no hay series existentes**
    if(series.length === 0){
        crearSerie(ulSeries, tipo);
    }

    const btnAgregarSerie = document.createElement("button");
    btnAgregarSerie.type = "button";
    btnAgregarSerie.classList.add("boton");
    btnAgregarSerie.textContent = "Agregar Serie";
    btnAgregarSerie.addEventListener("click", ()=>{ crearSerie(ulSeries, tipo); });

    divEj.appendChild(ulSeries);
    divEj.appendChild(btnAgregarSerie);

    exerciseList.appendChild(divEj);
    actualizarNumerosSeries(ulSeries);
}


// Crear serie dependiendo del tipo de ejercicio
function crearSerie(ul, tipo="reps", cantidad="", peso=""){
    const liSerie = document.createElement("div");
    liSerie.classList.add("serie");

    const numeroSerie = document.createElement("div");
    numeroSerie.classList.add("boton","numeroSerie");

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.value = cantidad;

    let inputPeso;
    switch(tipo){
        case "reps":
            inputCantidad.placeholder = "Repeticiones";
            break;
        case "kg":
            inputCantidad.placeholder = "Repeticiones";
            inputPeso = document.createElement("input");
            inputPeso.type="number";
            inputPeso.placeholder="Peso";
            inputPeso.value=peso;
            break;
        case "tiempo":
            inputCantidad.placeholder = "Minutos";
            break;
        case "distancia":
            inputCantidad.placeholder = "Km";
            break;
        default:
            inputCantidad.placeholder = "Repeticiones";
    }

    const btnEliminar = document.createElement("button");
    btnEliminar.type="button";
    btnEliminar.classList.add("boton");
    btnEliminar.textContent = "✖";
    btnEliminar.style.backgroundColor = "#ff271f"
    btnEliminar.addEventListener("click", () => {
        liSerie.remove();
        if(ul.children.length === 0){
            ul.parentElement.remove();
        } else {
            Array.from(ul.children).forEach((s, i)=>{
                s.querySelector(".boton").textContent = i + 1;
            });
        }
    });

    liSerie.appendChild(numeroSerie);
    liSerie.appendChild(inputCantidad);
    if(inputPeso) liSerie.appendChild(inputPeso);
    liSerie.appendChild(btnEliminar);
    ul.appendChild(liSerie);

    actualizarNumerosSeries(ul);
}


// Actualizar numeración de series
function actualizarNumerosSeries(ul){
    ul.querySelectorAll(".serie").forEach((s,i)=>{ 
        s.querySelector(".numeroSerie").textContent = i+1; 
    });
}

// Guardar rutina
guardarBtn.addEventListener("click", ()=>{
    const nombreRutina = nombreRutinaInput.value.trim();
    if(!nombreRutina) return alert("Ingresa un nombre de rutina");

    const ejercicios = [];

    // Recorrer todos los ejercicios en la lista
    exerciseList.querySelectorAll(".ejercicio").forEach(divEj=>{
        const nombreEx = divEj.querySelector("h3").textContent;
        const descanso = divEj.querySelector("input[type=number]").value || 60;
        const series = [];

        divEj.querySelectorAll(".series-list .serie").forEach(sLi=>{
            const cantidad = sLi.querySelector("input[type=number]").value;
            const peso = sLi.querySelectorAll("input[type=number]")[1]?.value || "";
            if(cantidad) series.push({cantidad, peso});
        });

        if(series.length > 0){
            ejercicios.push({ejercicio:nombreEx, series, descanso});
        }
    });

    if(ejercicios.length === 0) return alert("Agrega al menos un ejercicio con series");

    if(rutinaEditar){
        rutinaEditar.nombre = nombreRutina;
        rutinaEditar.ejercicios = ejercicios;
        localStorage.removeItem("editarRutinaIndex");
    } else {
        usuario.rutinas = usuario.rutinas || [];
        usuario.rutinas.push({nombre:nombreRutina, ejercicios});
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    window.location.href="rutinas.html";
});


cancelarBtn.addEventListener("click", ()=>{
    localStorage.removeItem("editarRutinaIndex");
    window.location.href="rutinas.html";
});
