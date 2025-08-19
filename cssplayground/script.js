const editor = document.getElementById("editor");
const play = document.getElementById("play");
const reiniciar = document.getElementById("reiniciar");
const siquiente = document.getElementById("siquiente");
const preview = document.getElementById("preview");
let nivel = [];
const params = new URLSearchParams(window.location.search);

const numnivel = parseInt(params.get("nivel"), 10) || 1;
if (numnivel >= 16){numnivel = 1}
editor.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
        e.preventDefault();
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        const tabNode = document.createTextNode("    ");
        range.deleteContents();
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
});

async function obtenerDatos(num) {
    try {
        const response = await fetch('src/niveles.json'); 
        if (!response.ok) throw new Error('Error al obtener el JSON: ' + response.status);
        const data = await response.json();
        return data[num-1];
    } catch (error) {
        console.error(error);
        return null;
    }
}

function imprimir(nivel) {
    if (!nivel) return;
    const doc = preview.contentDocument || preview.contentWindow.document;
    doc.open();
    doc.write(nivel.html);
    doc.close();
    const styleFinal = doc.createElement('style');
    styleFinal.textContent = nivel.final+"*{transition: all 0.5s ease-in-out}";
    doc.head.appendChild(styleFinal);
    const styleEdit = doc.createElement('style');
    styleEdit.id = "editable";
    styleEdit.textContent = editor.textContent;
    doc.head.appendChild(styleEdit);
    
}

function extraerPropiedades(css) {
    const propiedades = [];
    const bloques = css.match(/\{[^}]+\}/g) || [];
    bloques.forEach(bloque => {
        const contenido = bloque.replace(/[{}]/g, '').trim();
        const decls = contenido.split(';').filter(d => d.trim() !== '');
        const obj = {};
        decls.forEach(d => {
            const [prop, val] = d.split(':');
            if (prop && val) obj[prop.trim()] = val.trim();
        });
        propiedades.push(obj);
    });
    return propiedades;
}

function propiedadesIguales(propA, propB) {
    if (propA.length !== propB.length) return false;
    for (let i = 0; i < propA.length; i++) {
        const keysA = Object.keys(propA[i]).sort();
        const keysB = Object.keys(propB[i]).sort();
        if (keysA.length !== keysB.length) return false;
        for (let j = 0; j < keysA.length; j++) {
            if (keysA[j] !== keysB[j]) return false;
            if (propA[i][keysA[j]] !== propB[i][keysB[j]]) return false;
        }
    }
    return true;
}

function cssEquivalente(css1, css2) {
    const props1 = extraerPropiedades(css1);
    const props2 = extraerPropiedades(css2);
    return propiedadesIguales(props1, props2);
}

async function init() {
    nivel = await obtenerDatos(numnivel);
    if (!nivel) return;
    editor.textContent = nivel.inicio;
    imprimir(nivel);
    editor.addEventListener("input", () => {
        const doc = preview.contentDocument || preview.contentWindow.document;
        const editableStyle = doc.getElementById("editable");
        if (editableStyle) editableStyle.textContent = editor.textContent;
        if (cssEquivalente(editor.textContent, nivel.final)) {
            ganar()
        }
    });
    reiniciar.addEventListener("click", () => {
        editor.textContent = nivel.inicio
    });
}
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
    }, 5000);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

init();
function ganar(){
    startConfetti()
    play.style.pointerEvents = "none"
    siquiente.style.display = "block"
    play.style.display = "none"
    reiniciar.style.display = "none"
    siquiente.href = "./index.html?nivel="+ (numnivel+1)
}
play.addEventListener("click", () => {
    if (cssEquivalente(editor.textContent, nivel.final)) {
        ganar()
    }else{
        editor.style.animation = ""
        setTimeout(() => {
            editor.style.animation = "denegado 2s both"
        }, 10);
        
    }
});


const ayuda = document.getElementById("ayuda"); // Botón de ayuda

function mostrarSolucion(segundos = 3) {
    if (!nivel) return;
    const doc = preview.contentDocument || preview.contentWindow.document;

    // Guardamos el CSS actual del usuario
    const editableStyle = doc.getElementById("editable");
    const cssUsuario = editableStyle ? editableStyle.textContent : "";
    const codigoUsuario = editor.textContent;

    // Mostramos la solución en el iframe
    if (editableStyle) editableStyle.textContent = nivel.final;

    // Mostramos la solución en el editor
    editor.textContent = nivel.final;

    // Opcional: efecto visual para indicar ayuda
    doc.body.style.transition = "all 0.3s";
    editor.style.transition = "all 0.3s";
    editor.style.opacity = "0.5";

    // Volvemos al CSS y código del usuario después de X segundos
    setTimeout(() => {
        if (editableStyle) editableStyle.textContent = cssUsuario;
        editor.textContent = codigoUsuario;
        doc.body.style.opacity = "1";
        editor.style.opacity = "1";
    }, segundos * 1000);
}
// Listener para el botón de ayuda
ayuda.addEventListener("click", () => mostrarSolucion(3));
