const video = document.getElementById('video');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
let ws;
let peerConnections = {};
let stream;
let streamId;
let inicio = false
let streamerName;
let titulo
let cooldown = false;


async function iniciar() {
if(!inicio){
 inicio = true
  streamId = Math.random().toString(36).substring(2, 10);
  streamerName = prompt('Escribí tu nombre:') || 'Streamer desconocido';
  titulo = prompt('Escribí un titulo para el stream:') || 'Sin título';

  /*streamId = document.getElementById('streamId').value.trim();
  streamerName = document.getElementById('streamerName').value.trim() || 'Streamer desconocido';
  const titulo = document.getElementById('tituloStream').value || 'Sin título';*/
  document.getElementById('streamId').value = streamId;
  document.getElementById('streamerName').value = streamerName;
  document.getElementById('tituloStream').value= titulo;
  
  document.getElementById('nombrestreamer').textContent = streamerName;
  document.getElementById('titulostreamer').textContent = titulo;
  if (!streamId) {
    alert('Debes ingresar un ID de stream');
    return;
  }

  ws = new WebSocket(`https://streaming-0qb5.onrender.com/?id=${streamId}`);

  ws.onopen = () => {
    document.getElementById('playButton').style.display = 'none';
    console.log('WebSocket conectado como streamer.');
    ws.send(JSON.stringify({ type: 'broadcaster', name: streamerName }));
    ws.send(JSON.stringify({ type: 'setTitle', title: titulo }));
    startStream();
  };

  ws.onmessage = async (event) => {
    const msg = JSON.parse(event.data);
    console.log('Streamer recibió:', msg);

    if (msg.type === 'watcher') {
      const watcherId = msg.watcherId;
      console.log(`Nuevo watcher conectado: ${watcherId}`);

      const pc = new RTCPeerConnection();
      peerConnections[watcherId] = pc;

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = event => {
        if (event.candidate) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, watcherId }));
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ws.send(JSON.stringify({ type: 'offer', sdp: offer, watcherId }));
    }

    if (msg.type === 'answer') {
      const pc = peerConnections[msg.watcherId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        console.log(`Streamer recibió answer de ${msg.watcherId}`);
      }
    }
    if (msg.type === 'heart') {
      tirarCorazon();
    }
    if (msg.type === 'viewerCount') {
      actualizarespectadores(msg.count)
  }
    
    if (msg.type === 'candidate') {
      const pc = peerConnections[msg.watcherId];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
        console.log(`Streamer ICE candidate recibido de ${msg.watcherId}`);
      }
    }

    if (msg.type === 'chat') {
      addChatMessage(`${msg.from}: ${msg.message}`);
    }

    if (msg.type === 'endStream') {
      stopStream();
      addChatMessage('📴 Transmisión finalizada.');
    }
  };

  ws.onclose = () => {
    console.log('Conexión WebSocket cerrada.');
  };
 }
}

async function startStream() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
    console.log('Streamer: cámara y micrófono activados.');
  } catch (error) {
    console.error('Error al acceder a la cámara o micrófono:', error);
    alert('No se pudo acceder a la cámara o micrófono. Verificá los permisos.');
    
    // Cerramos la conexión si ya se abrió
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'endStream' }));
      ws.close();
    }

    document.getElementById('playButton').style.display = 'grid';
    inicio = false;
  }
}

function sendChat() {
 

  const msg = chatInput.value.trim();
  if (!msg) return;
  if (!streamerName) {
    alert('Debes ingresar un nombre para enviar mensajes.');
    return;
  }
  if (cooldown) return;
  cooldown = true;
  ws.send(JSON.stringify({ type: 'chat', message: msg }));
  addChatMessage(`Yo: ${msg}`);
  chatInput.value = '';
  setTimeout(() => {
    cooldown = false;
  }, 500);
}

function tirarCorazon() {
  const contenedor = document.getElementById("corazon");

  const cora = document.createElement("div");
  cora.classList.add("cora");

  const img = document.createElement("div");
  img.classList.add("imgstream");
  const num = Math.floor(Math.random() * 3) + 1; // 1, 2 o 3
  cora.style.animation = "1.5s both corazon" + num
  cora.appendChild(img);
  contenedor.appendChild(cora);

  // Quitarlo cuando termina la animación
  cora.addEventListener("animationend", () => {
    cora.remove();
  });
}

function addChatMessage(msg) {
  const div = document.createElement('div');
  div.classList.add("mensaje")
  div.textContent = msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function stopStream() {
  inicio = false
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
  Object.values(peerConnections).forEach(pc => pc.close());
  peerConnections = {};
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'endStream' }));
    ws.close();
  }
  addChatMessage('📴 Transmisión finalizada.');
  document.getElementById('playButton').style.display = 'grid';
  console.log('Streamer detuvo la transmisión.');
}

function actualizarespectadores(n){
  let viewerText = '';
  
  if (n >= 1000000) {
      // Para millones
      let value = n / 1000000;
      viewerText = (value % 1 === 0) ? value.toFixed(0) + "M" : value.toFixed(1) + "M";
  } else if (n >= 1000) {
      // Para miles
      let value = n / 1000;
      viewerText = (value % 1 === 0) ? value.toFixed(0) + "k" : value.toFixed(1) + "k";
  } else {
      // Menos de 1000
      viewerText = n.toString();
  }
  document.getElementById('viewerCount').textContent = viewerText;
  }