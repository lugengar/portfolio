
  const mesesNombre = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  let usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (!usuario) window.location.href = "index.html";

  let calendarioMes = new Date().getMonth();
  let calendarioAnio = Math.max(new Date().getFullYear(), 2025);

  const calendario = document.getElementById("calendario");
  const historialList = document.getElementById("historialList");

  // ====== Racha de semanas ======
  function calcularRachaSemanas(historial) {
    if (!historial || historial.length === 0) return 0;

    let semanas = historial.map(h => {
      let f = new Date(h.fecha);
      let firstDay = new Date(f.getFullYear(), 0, 1);
      let pastDays = Math.floor((f - firstDay) / 86400000);
      let week = Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
      return f.getFullYear() + "-" + week;
    });

    semanas = [...new Set(semanas)];
    semanas.sort((a, b) => {
      let [ay, aw] = a.split("-").map(Number);
      let [by, bw] = b.split("-").map(Number);
      return ay === by ? aw - bw : ay - by;
    });

    let racha = 1, maxRacha = 1;
    for (let i = 1; i < semanas.length; i++) {
      let [prevY, prevW] = semanas[i - 1].split("-").map(Number);
      let [currY, currW] = semanas[i].split("-").map(Number);

      let consecutiva = false;
      if (currY === prevY && currW === prevW + 1) consecutiva = true;
      if (currY === prevY + 1 && prevW >= 52 && currW === 1) consecutiva = true;

      if (consecutiva) {
        racha++;
        maxRacha = Math.max(maxRacha, racha);
      } else {
        racha = 1;
      }
    }

    return maxRacha;
  }

  let rachaSemanas = calcularRachaSemanas(usuario.historial);
  document.getElementById("rachaDias").textContent = rachaSemanas;

  // Mostrar historial
  (usuario.historial || []).forEach(h => {
    const li = document.createElement("div");
    const fecha = new Date(h.fecha).toLocaleString();
    li.innerHTML = `<p><b>${h.rutina}</b> - ${fecha}</p>`;
    li.classList.add("historial");
    historialList.appendChild(li);
  });

  // ====== CALENDARIO ======
  function generarCalendario(anio, mes) {
    calendario.innerHTML = "";

    const primerDia = new Date(anio, mes, 1).getDay();
    const ultimoDia = new Date(anio, mes + 1, 0).getDate();

    for (let i = 0; i < primerDia; i++) {
      let div = document.createElement("div");
      calendario.appendChild(div);
    }

    for (let d = 1; d <= ultimoDia; d++) {
      let fecha = new Date(anio, mes, d);
      let div = document.createElement("div");
      div.className = "dia";
      div.textContent = d;

      let hoy = new Date();
      if (fecha.getFullYear() === hoy.getFullYear() &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getDate() === hoy.getDate()) {
        div.classList.add("hoy");
      }

      (usuario.historial || []).forEach(h => {
        let entreno = new Date(h.fecha);
        if (entreno.getFullYear() === fecha.getFullYear() &&
            entreno.getMonth() === fecha.getMonth() &&
            entreno.getDate() === fecha.getDate()) {
          div.classList.add("entrenado");
        }
      });

      calendario.appendChild(div);
    }

    document.getElementById("mesAnio").textContent = `${mesesNombre[mes]} ${anio}`;
  }

  // Navegación de meses
  document.getElementById("prevMes").addEventListener("click", () => {
    if (calendarioMes === 0) {
      if (calendarioAnio > 2025) {
        calendarioAnio--;
        calendarioMes = 11;
      }
    } else {
      calendarioMes--;
    }
    generarCalendario(calendarioAnio, calendarioMes);
  });

  document.getElementById("nextMes").addEventListener("click", () => {
    if (calendarioMes === 11) {
      calendarioAnio++;
      calendarioMes = 0;
    } else {
      calendarioMes++;
    }
    generarCalendario(calendarioAnio, calendarioMes);
  });

  // Inicializar calendario
  generarCalendario(calendarioAnio, calendarioMes);