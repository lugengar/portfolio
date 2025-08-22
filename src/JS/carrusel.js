let data = []; 
let indice = 0;
let ruta = "";
let segundos = 10;
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const textoEl = document.getElementById("titulo");
const botonesEl = document.getElementById("botones");
const minitextoEl = document.getElementById("minitexto");
let videoActual = video1;
let videoSiguiente = video2;
let botones = [];
let avanceTimeout;

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
    btn.classList.add(i === 0 ? "activo" : "inactivo");
    btn.onclick = () => cambiarVideo(i);
    botonesEl.appendChild(btn);
    botones.push(btn);
  });

  // Agregar control táctil/mouse
  addSwipeSupport(video1.parentElement); 
}

function siguienteVideo() {
  indice = (indice + 1) % data.length;
  cargarVideo(indice);
}

function anteriorVideo() {
  indice = (indice - 1 + data.length) % data.length;
  cargarVideo(indice);
}

function cargarVideo(i) {
  if(avanceTimeout) clearTimeout(avanceTimeout);

  botones.forEach((b, idx) => {
    b.classList.toggle("activo", idx === i);
    b.classList.toggle("inactivo", idx !== i);
  });

  videoSiguiente.src = `${ruta}/${data[i].video}`;
  videoSiguiente.style.opacity = 1;
  videoSiguiente.currentTime = 0;
  videoSiguiente.play();

  videoActual.style.opacity = 0;
  textoEl.classList.add("fade-out-text");

  setTimeout(() => {
    textoEl.textContent = data[i].texto;
    minitextoEl.textContent = data[i].minitexto;
    textoEl.classList.remove("fade-out-text");
    textoEl.classList.add("fade-in-text");

    setTimeout(() => textoEl.classList.remove("fade-in-text"), 500);

    let temp = videoActual;
    videoActual = videoSiguiente;
    videoSiguiente = temp;
    videoSiguiente.style.opacity = 0;

    avanceTimeout = setTimeout(siguienteVideo, segundos * 1000);
  }, 800);
}

function cambiarVideo(i) {
  indice = i;
  cargarVideo(indice);
}

// ------------------ Swipe Support ------------------
function addSwipeSupport(container) {
  let startX = 0;
  let endX = 0;

  // Touch
  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });

  // Mouse
  container.addEventListener("mousedown", (e) => {
    startX = e.clientX;
  });
  container.addEventListener("mouseup", (e) => {
    endX = e.clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = endX - startX;
    if (Math.abs(diff) > 50) { // umbral de 50px
      if (diff > 0) {
        anteriorVideo(); // swipe right
      } else {
        siguienteVideo(); // swipe left
      }
    }
  }
}
