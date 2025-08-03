const video = document.getElementById('remoteVideo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

let ws;
let peerConnection;
let viewerName = '';
let cooldown = false;
let stream = false
function playVideo() {
  if(stream){return}
 

  viewerName = prompt('Escribí tu nombre:');
  //viewerName = document.getElementById('viewerName').value.trim();
   document.getElementById('viewerName').value = viewerName;
  if (!viewerName) {
    alert('Por favor ingresa tu nombre para ver el stream.');
    return;
  } document.getElementById('playButton').style.display = 'none';
  document.getElementById('stream').style.display = 'grid';

  const params = new URLSearchParams(window.location.search);
  const streamId = params.get('id');
  if (!streamId) {
    alert('No se encontró ID del stream en la URL.');
    return;
  }

  ws = new WebSocket(`https://streaming-0qb5.onrender.com/?id=${streamId}`);

  ws.onopen = () => {
    stream= true
    console.log('WebSocket conectado como viewer.');
    ws.send(JSON.stringify({ type: 'watcher', watcherId: viewerName }));
    presentacion()
  };

  ws.onmessage = async (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === 'offer') {
      titulostreamer = msg.name;
      nombrestreamer = msg.title;
      document.getElementById('nombrestreamer').textContent = nombrestreamer;
      document.getElementById('titulostreamer').textContent = titulostreamer;

      peerConnection = new RTCPeerConnection();
      

      peerConnection.ontrack = event => {
        video.srcObject = event.streams[0];
      
        video.play();
      };

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate, watcherId: viewerName }));
        }
      };

      await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      ws.send(JSON.stringify({ type: 'answer', sdp: answer, watcherId: viewerName }));
    }

    if (msg.type === 'candidate') {
      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
      }
    }
    if (msg.type === 'heart') {
      tirarCorazon();
    }
    if (msg.type === 'viewerCount') {
        actualizarespectadores(msg.count)
    }
    if (msg.type === 'chat') {
      addChatMessage(`${msg.from}: ${msg.message}`);
    }

    if (msg.type === 'endStream') {
      video.srcObject = null;
      addChatMessage('📴 Transmisión finalizada.');
      ws.close();
    }
  };
}

function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  if (!viewerName) {
    alert('Debes ingresar un nombre para enviar mensajes.');
    return;
  }
  if (cooldown) return;
  cooldown = true;
  ws.send(JSON.stringify({ type: 'chat', message: msg, from: viewerName }));
  addChatMessage(`Yo (${viewerName}): ${msg}`);
  chatInput.value = '';
  setTimeout(() => {
    cooldown = false;
  }, 500);
}
function sendHeart() {

  if (!viewerName) {
    alert('Debes ingresar un nombre para enviar corazones.');
    return;
  }
  if (cooldown) return;
  cooldown = true;
  ws.send(JSON.stringify({ type: 'heart', from: viewerName }));
  tirarCorazon();
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

function presentacion() {
  if (!viewerName) {
    alert('Debes ingresar un nombre para enviar mensajes.');
    return;
  }
  const msg = viewerName + " se unió";
  addChatMessage("📢: "+msg);
  ws.send(JSON.stringify({ type: 'chat', message: msg, from: "📢" }));
}

function addChatMessage(msg) {
  const div = document.createElement('div');
  div.classList.add("mensaje")
  div.textContent = msg;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
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
//setInterval(playVideo, 1000);
