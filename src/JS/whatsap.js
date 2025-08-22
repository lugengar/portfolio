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
            tiltAngle: 0
        });
    }

    let angle = 0;
    let animationFrameId;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c) => {
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
                c.x = Math.random() * canvas.width;
                c.y = -20;
                c.tilt = Math.random() * 10 - 10;
            }
        });
        angle += 0.01;
        animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    // Detener el confeti después de 30 segundos
    setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}