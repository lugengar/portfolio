let data = []; 
let indice = 0;
let ruta = "";
let segundos = 10
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const textoEl = document.getElementById("titulo");
const botonesEl = document.getElementById("botones");
const minitextoEl = document.getElementById("minitexto");
let videoActual = video1;
let videoSiguiente = video2;
let botones = [];
let avanceTimeout; // para controlar el tiempo de cada video

// Cargar JSON
fetch("src/JSON/videos.json")
  .then(res => res.json())
  .then(json => {
    ruta = json.direccion;
    data = json.videos;
    initCarrusel();
  })
  .catch(err => console.error(err));

function initCarrusel() {
  cargarVideo(indice);

  data.forEach((_, i) => {
    const btn = document.createElement("button");
    if(i == 0){
      btn.classList.add("activo");
    } else {
      btn.classList.add("inactivo");
    }

    btn.onclick = () => cambiarVideo(i);
    botonesEl.appendChild(btn);
    botones.push(btn);
  });
}

function siguienteVideo() {
  indice = (indice + 1) % data.length;
  cargarVideo(indice);
}

function cargarVideo(i) {
  // Limpiar cualquier timeout anterior
  if(avanceTimeout) clearTimeout(avanceTimeout);

  // Actualizar botones
  botones.forEach((b, idx) => {
    b.classList.toggle("activo", idx === i);
    b.classList.toggle("inactivo", idx !== i);
  });

  // Preparar siguiente video debajo
  videoSiguiente.src = `${ruta}/${data[i].video}`;
  videoSiguiente.style.opacity = 1;
  videoSiguiente.currentTime = 0;
  videoSiguiente.play();

  // Animar fade del actual
  videoActual.style.opacity = 0;

  // Animar textos
  textoEl.classList.add("fade-out-text");

  setTimeout(() => {
    // Cambiar texto
    textoEl.textContent = data[i].texto;
    minitextoEl.textContent = data[i].minitexto;
    textoEl.classList.remove("fade-out-text");
    textoEl.classList.add("fade-in-text");

    setTimeout(() => {
      textoEl.classList.remove("fade-in-text");
    }, 500);

    // Intercambiar videos
    let temp = videoActual;
    videoActual = videoSiguiente;
    videoSiguiente = temp;
    videoSiguiente.style.opacity = 0;

    // Programar avance automático a los 10 segundos
    avanceTimeout = setTimeout(siguienteVideo, segundos* 1000);

  }, 800); // coincide con el fade
}

// Cambiar video manual
function cambiarVideo(i) {
  indice = i;
  cargarVideo(indice);
}
