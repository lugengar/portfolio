const input = document.getElementById("pdf");
const output = document.getElementById("output");
const paginas = document.getElementById("paginas");
const nextPar = document.getElementById("nextPar");
const prevPar = document.getElementById("prevPar");
const boton = document.getElementById("play");
const voiceSelect = document.getElementById('voiceSelect');

let elementosActuales = [];
let contenidoActual = [];
let leyendo = false;
let indiceParrafo = 0;
let indicePagina = 1;
let voces = [];

// ------------------------ VOICES ------------------------
function populateVoiceList() {
    voces = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voces.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Voz ${i+1} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// ------------------------ LECTURA ------------------------
function play() {

    if (leyendo) {
        pausa();
        return;
    }
    boton.textContent = "❚❚";
    leyendo = true;

    indicePagina = parseInt(paginas.value, 10) || 1;
    cargarPagina(indicePagina, true);
}

function cargarPagina(pagina, autoLeer = false) {
    const pageDiv = document.getElementById(pagina);
    if (!pageDiv) return;
    pageDiv.scrollIntoView({ behavior: "smooth", block: "start" });
    const titulo = pageDiv.querySelector(".titulo");
    const parrafos = pageDiv.querySelectorAll(".par");

    contenidoActual = [titulo.textContent, ...Array.from(parrafos).map(p => p.textContent)];
    elementosActuales = [titulo, ...Array.from(parrafos)];
    indiceParrafo = 0;

    limpiarResaltado();

    if (autoLeer) leerSiguiente();
}

function leerSiguiente() {
    if (!leyendo) return;

    if (indiceParrafo >= contenidoActual.length) {
        // limpiar resaltado al terminar la página
        limpiarResaltado();

        if (indicePagina < paginas.options.length) {
            indicePagina++;
            paginas.value = indicePagina;
            cargarPagina(indicePagina, true);
        } else {
            pausa();
        }
        return;
    }

    // resaltar el párrafo actual
    resaltarParrafo(true);

    const texto = contenidoActual[indiceParrafo];
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.voice = voces[voiceSelect.value] || null;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
        indiceParrafo++;
        leerSiguiente();
    };

    window.speechSynthesis.speak(utterance);
}

function limpiarResaltado() {
    elementosActuales.forEach(el => el.style.backgroundColor = "");
}


function resaltarParrafo(soloResaltar = true) {
    limpiarResaltado();
    elementosActuales[indiceParrafo].style.backgroundColor = "yellow";
    // No hablamos aquí si es solo resaltar
}



function pausa() {
    leyendo = false;
    boton.textContent = "►";
    window.speechSynthesis.cancel();
}

// ------------------------ NAVEGACION ------------------------
function siguientepagina() {
    if (indicePagina < paginas.options.length) {
        indicePagina++;
        paginas.value = indicePagina;
        cargarPagina(indicePagina, leyendo);
    }
}

function paginaprev() {
    if (indicePagina > 1) {
        indicePagina--;
        paginas.value = indicePagina;
        cargarPagina(indicePagina, leyendo);
    }
}

function retrocederParrafo() {
    if (indiceParrafo > 0) {
        window.speechSynthesis.cancel();
        indiceParrafo--;
        resaltarParrafo(true); // solo resaltar
        leerSiguiente();       // continuar lectura automática
    } else if (indicePagina > 1) {
        // retroceder a la página anterior
        limpiarResaltado()

        indicePagina--;
        paginas.value = indicePagina;
        cargarPagina(indicePagina, false);
        indiceParrafo = contenidoActual.length - 1;
        resaltarParrafo(true);
        leerSiguiente();
    }
}

function avanzarParrafo() {
    if (indiceParrafo < contenidoActual.length - 1) {
        window.speechSynthesis.cancel();
        indiceParrafo++;
        resaltarParrafo(true);
        leerSiguiente();
    } else if (indicePagina < paginas.options.length) {
        // pasar a la siguiente página automáticamente
        limpiarResaltado()

        indicePagina++;
        paginas.value = indicePagina;
        cargarPagina(indicePagina, true); // ya hace leerSiguiente internamente
    }
}



// ------------------------ CARGA PDF ------------------------
input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    paginas.innerHTML = "";
    paginas.style.display = "block";
    boton.style.display = "block";
    prevPar.style.display = "block";
    nextPar.style.display = "block";
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        output.innerHTML = `<h1>${file.name}</h1>`;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            let parrafos = [];
            let currentY = null;
            let buffer = "";

            content.items.forEach(item => {
                const y = item.transform[5];
                if (currentY !== null && Math.abs(currentY - y) > 5) {
                    if (buffer.trim().length > 0) parrafos.push(buffer.trim());
                    buffer = "";
                }
                buffer += item.str + " ";
                currentY = y;
            });
            if (buffer.trim().length > 0) parrafos.push(buffer.trim());

            const pageDiv = document.createElement("div");
            const option = document.createElement("option");
            option.value = i;
            option.textContent = "Pag-" + i;
            pageDiv.classList.add("pagina");
            pageDiv.id = i;

            const titulo = document.createElement("h3");
            titulo.classList.add("titulo");
            titulo.textContent = `Página ${i} / ${pdf.numPages}`;
            pageDiv.appendChild(titulo);

            parrafos.forEach(p => {
                const pTag = document.createElement("pre");
                pTag.textContent = p;
                pTag.classList.add("par");
                pageDiv.appendChild(pTag);
            });

            paginas.appendChild(option);
            output.appendChild(pageDiv);
        }
    };
    fileReader.readAsArrayBuffer(file);
});



const dropZone = document.getElementById("dropZone");

// Evitar que el navegador abra el PDF al arrastrarlo
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

// Cambiar estilos al arrastrar
dropZone.addEventListener("dragover", () => {
    dropZone.style.backgroundColor = "#f0f0f0";
});
dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "transparent";
});

// Manejar el drop
dropZone.addEventListener("drop", (e) => {
    dropZone.style.backgroundColor = "transparent";
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
        // asignar el archivo al input y disparar change
        input.files = e.dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
        alert("Solo se permiten archivos PDF");
    }
});

dropZone.addEventListener("click", () => input.click());