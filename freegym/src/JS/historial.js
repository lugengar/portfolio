let usuario=JSON.parse(localStorage.getItem("usuarioActivo"));
if(!usuario) window.location.href="index.html";

document.getElementById("rachaDias").textContent="Racha de días: "+(usuario.streakDays||0);

let historialList=document.getElementById("historialList");

(usuario.historial||[]).forEach(h=>{
  const li=document.createElement("li");
  const fecha=new Date(h.fecha).toLocaleString();
  li.innerHTML=`<b>${h.rutina}</b> - ${fecha}<ul></ul>`;
  const ul=li.querySelector("ul");

  h.ejercicios.forEach((ex,i)=>{
    const liEx=document.createElement("li");
    let seriesText=ex.map((s,j)=>`Serie ${j+1}: ${s.cantidad} ${s.tipo}`).join(", ");
    liEx.textContent=`Ejercicio ${i+1}: ${seriesText}`;
    ul.appendChild(liEx);
  });

  historialList.appendChild(li);
});