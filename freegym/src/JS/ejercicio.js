let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
if(!usuario) window.location.href="index.html";

let rutinaIndex = parseInt(localStorage.getItem("rutinaIndex"));
let rutina = usuario.rutinas[rutinaIndex];
document.getElementById("rutinaNombre").textContent = rutina.nombre;

let progreso = JSON.parse(localStorage.getItem("progresoRutina")) || {
    ejercicios: rutina.ejercicios.map(ex=>ex.series.map(s=>false))
};

const ejerciciosList = document.getElementById("ejerciciosList");
const descansoTexto = document.getElementById("descansoTexto");
const progressBar = document.getElementById("progressBar");

let descansoInterval = null;

// Render de ejercicios
function renderEjercicios(){
    ejerciciosList.innerHTML = "";
    rutina.ejercicios.forEach((ex,i)=>{
        const divEj = document.createElement("div");
        divEj.classList.add("ejercicio");

        const h3 = document.createElement("h3");
        h3.textContent = ex.ejercicio;
        divEj.appendChild(h3);
        const falserie = document.createElement("div");
        falserie.classList.add("serie2")
        switch(ex.tipo){
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
        const seriesList = document.createElement("div");
        seriesList.classList.add("series-list");

        ex.series.forEach((s,j)=>{
            crearSerie(seriesList, ex.tipo, s.cantidad, s.peso, i, j, s.descanso || 60);
        });

        // Botón para agregar serie
        const btnAgregar = document.createElement("button");
        btnAgregar.type = "button";
        btnAgregar.classList.add("boton");
        btnAgregar.textContent = "Agregar Serie";
        btnAgregar.addEventListener("click", ()=>{
            crearSerie(seriesList, ex.tipo, "", "", i, seriesList.children.length, ex.descanso || 60);
        });
      
        divEj.appendChild(falserie);
        divEj.appendChild(seriesList);
        divEj.appendChild(btnAgregar);
        ejerciciosList.appendChild(divEj);
    });
}

// Crear serie individual con opción de eliminar y eliminar ejercicio si no hay series
// Crear serie individual con opción de eliminar y eliminar ejercicio si no hay series
function crearSerie(ul, tipo="reps", cantidad="", peso="", exIndex=0, serieIndex=0, descanso=60){
    const divSerie = document.createElement("div");
    divSerie.classList.add("serie");
    divSerie.style.position = "relative";

    // Número de serie
    const numero = document.createElement("div");
    numero.classList.add("boton","numeroSerie");
    numero.textContent = serieIndex+1;

    // Input cantidad
    const inputCantidad = document.createElement("input");
    inputCantidad.type="number";
    inputCantidad.placeholder = (tipo==="tiempo")?"Minutos":(tipo==="distancia")?"Km":"Cantidad";
    inputCantidad.value = cantidad;

    // Input peso si corresponde
    let inputPeso;
    if(tipo==="kg"){
        inputPeso = document.createElement("input");
        inputPeso.type="number";
        inputPeso.placeholder="Peso";
        inputPeso.value = peso;
    }

    // Botón de completar serie
    const btnCheck = document.createElement("button");
    btnCheck.type = "button";
    btnCheck.classList.add("check");
    btnCheck.textContent = "✔";

    btnCheck.addEventListener("click", ()=>{
        const completado = divSerie.classList.toggle("completed");
        btnCheck.classList.toggle("completed", completado);
        if (!progreso.ejercicios[exIndex]) progreso.ejercicios[exIndex] = [];
        progreso.ejercicios[exIndex][serieIndex] = completado;
        localStorage.setItem("progresoRutina", JSON.stringify(progreso));
        if(completado) iniciarDescanso(descanso);
    });

    // Añadir elementos al div de serie
    divSerie.appendChild(numero);
    divSerie.appendChild(inputCantidad);
    if(inputPeso) divSerie.appendChild(inputPeso);
    divSerie.appendChild(btnCheck);

    ul.appendChild(divSerie);
    actualizarNumerosSeries(ul);

    // Swipe para móviles
    let startX = 0, currentX = 0, swiping = false, threshold = 100;
    divSerie.addEventListener("touchstart", (e)=>{
        startX = e.touches[0].clientX;
        swiping = true;
    });
    divSerie.addEventListener("touchmove", (e)=>{
        if(!swiping) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        if(deltaX < 0) divSerie.style.transform = `translateX(${deltaX}px)`;
    });
    divSerie.addEventListener("touchend", ()=>{
        swiping = false;
        if(currentX - startX < -threshold){
            const indexReal = Array.from(ul.children).indexOf(divSerie);
            if(indexReal !== -1) eliminarSerie(exIndex, indexReal, ul);
        } else {
            divSerie.style.transform = "translateX(0)";
        }
    });
    
    divSerie.addEventListener("contextmenu", (e)=>{
        e.preventDefault();
        if(confirm("Eliminar serie?")){
            const indexReal = Array.from(ul.children).indexOf(divSerie);
            if(indexReal !== -1) eliminarSerie(exIndex, indexReal, ul);
        }
    });
    
}
function eliminarSerie(exIndex, serieIndex, ul) {
    const ejercicio = rutina.ejercicios[exIndex];
    if (!ejercicio || !ejercicio.series) return;

    // Eliminar la serie del array
    ejercicio.series.splice(serieIndex, 1);

    // Eliminar el div visual
    if (ul.children[serieIndex]) ul.children[serieIndex].remove();

    // Actualizar numeración de series
    actualizarNumerosSeries(ul);

    // Actualizar progreso
    progreso.ejercicios[exIndex] = ejercicio.series.map(() => false);
    localStorage.setItem("progresoRutina", JSON.stringify(progreso));

    // Si no quedan series, eliminar todo el ejercicio
    if (ejercicio.series.length === 0) {
        rutina.ejercicios.splice(exIndex, 1);
        renderEjercicios();
    }
}

// Actualiza la numeración de series dentro de un contenedor
function actualizarNumerosSeries(ul){
    Array.from(ul.children).forEach((serie, index) => {
        const numeroDiv = serie.querySelector(".numeroSerie");
        if(numeroDiv) numeroDiv.textContent = index + 1;
    });
}


// Descanso con barra
let descansoSegundos=0, descansoMax=0;
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
    progressBar.style.width = porcentaje + "%";
    descansoTexto.textContent = descansoSegundos>0?`${descansoSegundos}s`:"Listo para la siguiente serie";
}

renderEjercicios();

// Finalizar entreno
// Guardar copia de rutina original
let rutinaOriginal = JSON.stringify(rutina);

// Finalizar entreno
document.getElementById("finalizarBtn").addEventListener("click", ()=>{
    const fecha = new Date().toISOString();
    
    // Verificar si la rutina cambió
    const rutinaActual = JSON.stringify(rutina);
    if(rutinaOriginal !== rutinaActual){
        const aplicarCambios = confirm("La rutina fue modificada. ¿Deseas aplicar estos cambios?");
        if(aplicarCambios){
            usuario.rutinas[rutinaIndex] = JSON.parse(rutinaActual);
            alert("Cambios aplicados a la rutina.");
        }
    }

    // Guardar historial
    usuario.historial = usuario.historial||[];
    usuario.historial.push({
        rutina: rutina.nombre,
        fecha,
        ejercicios: rutina.ejercicios.map(ex=>ex.series)
    });

    // Actualizar racha
    let hoy = new Date(); hoy.setHours(0,0,0,0);
    let lastWorkout = new Date(usuario.lastWorkout || 0);
    const diff = (hoy - lastWorkout)/(1000*60*60*24);
    usuario.streakDays = (diff === 1)?((usuario.streakDays||0)+1):1;
    usuario.lastWorkout = new Date().toISOString();

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    localStorage.removeItem("progresoRutina");
    alert("Entrenamiento finalizado y guardado!");
    window.location.href="historial.html";
});