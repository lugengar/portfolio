const header = document.getElementById("header");
const inicio = document.getElementById("inicio");
const button = document.getElementById("butsidebar");
const sidebar = document.getElementById("sidebar");
let abierto = false;

window.addEventListener("scroll", () => {
  // Si scrolleaste más de 5vh
  if(window.scrollY >= window.innerHeight * 0.05){ // 5% de la altura de la ventana
    header.style.top = "0";
    inicio.style.display="block"
    header.style.backgroundColor = "#001b6ade";
  } else {
    header.style.top = "5vh"; // vuelve a su posición inicial
     inicio.style.display="none"
    header.style.backgroundColor = "#001b6a70";
  }
});

button.addEventListener("click", () => {
    if (!abierto) {
        sidebar.style.transform = "translateX(0%)"; // lo mueve a la pantalla
        button.textContent = "✖"; // cambia a X
        abierto = true;
    } else {
        sidebar.style.transform = "translateX(100%)";   // lo oculta de nuevo
        button.textContent = "☰"; // vuelve a las tres rayas
        abierto = false;
    }
});

