const video = document.getElementById('video');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
let ws;
let peerConnections = {};
let stream;
let streamId;
let inicio = false
let streamerName;
async function iniciar() {
if(!inicio){
 inicio = true
  streamId = Math.random().toString(36).substring(2, 10);
  streamerName = prompt('Escribí tu nombre:')|| 'Streamer desconocido';
  const titulo = prompt('Escribí un titulo para el stream:') || 'Sin título';

  /*streamId = document.getElementById('streamId').value.trim();
  streamerName = document.getElementById('streamerName').value.trim() || 'Streamer desconocido';
  const titulo = document.getElementById('tituloStream').value || 'Sin título';*/
  document.getElementById('streamId').value = streamId;
  document.getElementById('streamerName').value = streamerName;
  document.getElementById('tituloStream').value= titulo;
  if (!streamId) {
    alert('Debes ingresar un ID de stream');
    return;
  }

  ws = new WebSocket(`https://streaming-0qb5.onrender.com/?id=${streamId}`);

  ws.onopen = () => {
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
    if (msg.type === 'viewerCount') {
      document.getElementById('viewerCount').textContent = msg.count;
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
  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = stream;
  console.log('Streamer: cámara y micrófono activados.');
}

function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  ws.send(JSON.stringify({ type: 'chat', message: msg }));
  addChatMessage(`Yo: ${msg}`);
  chatInput.value = '';
}

function addChatMessage(msg) {
  const div = document.createElement('div');
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
  console.log('Streamer detuvo la transmisión.');
}

