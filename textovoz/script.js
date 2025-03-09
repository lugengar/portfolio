// Variables para almacenar las voces y el selector de voces
let voces = [];
const voiceSelect = document.getElementById('voiceSelect');

// Función para poblar el selector de voces
function populateVoiceList() {
    voces = window.speechSynthesis.getVoices();

    voces.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})`;

        if (voice.default) {
            option.textContent += ' -- DEFAULT';
        }

        voiceSelect.appendChild(option);
    });
}

// Llamar a populateVoiceList al cargar la página
populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Función para leer el texto
function leerTexto() {
    // Obtener el texto del textarea
    const texto = document.getElementById('texto').value;

    // Crear una instancia de SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(texto);

    // Configurar la voz seleccionada
    const selectedVoiceIndex = voiceSelect.value;
    utterance.voice = voces[selectedVoiceIndex];

    // Opcional: Configurar la velocidad y el tono
    utterance.rate = 1; // Velocidad (1 es la normal)
    utterance.pitch = 1; // Tono (1 es el normal)

    // Reproducir el texto
    window.speechSynthesis.speak(utterance);
}
