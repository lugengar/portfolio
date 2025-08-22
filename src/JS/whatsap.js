function enviarWhatsApp() {
    let form = document.getElementById("formulario2");

    if (!form.checkValidity()) {
        alert("Por favor, completa todos los campos obligatorios.");
        return false;
    }
    startConfetti()
    let nombre = document.getElementById("Correo").value;
    let mensaje = document.getElementById("Mensaje").value;
    let texto = `Correo: ${nombre}%0A` +
                `Mensaje: ${mensaje}`;
    let url = `https://wa.me/5491153839865?text=${texto}`;
    
    window.open(url, '_blank');
}

const API_KEY = "$2a$10$LpIp5IysBLixWKyYXtxpSOQGk1TJqRtMoR./UMxtuAlwXk0NTDQoe";
  
  const BIN_ID = "68a7e214ae596e708fd0b9d9";
  
  const form = document.getElementById("formulario2");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    alert("Por favor, completa todos los campos obligatorios.");
    return false;
  }

  const correo = document.getElementById("Correo").value;
  const mensaje = document.getElementById("Mensaje").value;
  const fecha = new Date().toISOString().split("T")[0];

  const nuevoDato = { fecha, mensaje, correo };

  try {
    // Obtener JSON actual usando X-Access-Key
    const resGet = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      headers: { "X-Access-Key": API_KEY }
    });

    if (!resGet.ok) throw new Error("Error al leer el bin");

    const data = await resGet.json();
    const actual = Array.isArray(data.record) ? data.record : [];

    const actualizado = [...actual, nuevoDato];

    // Guardar en el bin con X-Access-Key
    const resPut = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": API_KEY
      },
      body: JSON.stringify(actualizado)
    });

    if (resPut.ok) {
      form.reset();
      startConfetti()
    } else {
      alert("Error al guardar ❌");
    }

  } catch (error) {
    console.error(error);
    alert("Error de conexión con JSONBin ❌");
  }
});


let form2 = document.getElementById("formulario");

function contacto(){
    if (!form2.checkValidity()) {
        alert("Por favor, completa todos los campos obligatorios.");
        return false;
    }
    let correo = document.getElementById("correo2");
    let nombre = document.getElementById("Correo");
    nombre.value = correo.value;
    redirigir("contacto");

}

function redirigir(href) {
    const elemento = document.querySelector("#" + href);
  
    if (elemento) {
      const offset = window.innerHeight * 0.15;
      const top = elemento.getBoundingClientRect().top + window.scrollY - offset;
  
      window.scrollTo({
        top: top,
        behavior: "smooth"
      });
    }
  }
  
  

form2.addEventListener("submit", (e) => {
    e.preventDefault(); 
    contacto()
  });

  function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 150;
    const confetti = [];

    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * confettiCount,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0,
            finished: false // nueva propiedad
        });
    }

    let angle = 0;
    let animationFrameId;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c) => {
            if (c.finished) return; // ya llegó al fondo, no moverlo

            ctx.beginPath();
            ctx.lineWidth = c.r / 2;
            ctx.strokeStyle = c.color;
            ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
            ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
            ctx.stroke();

            c.tiltAngle += c.tiltAngleIncrement;
            c.y += (Math.cos(angle + c.d) + 1 + c.r / 2) / 2;
            c.tilt = Math.sin(c.tiltAngle) * 15;

            if (c.y > canvas.height) {
                c.y = canvas.height; // se queda en el fondo
                c.finished = true;
            }
        });
        angle += 0.01;

        // Si todas las partículas terminaron, paramos la animación
        if (!confetti.every(c => c.finished)) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    draw();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}