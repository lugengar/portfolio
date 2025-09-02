export function initProgreso(rutina) {
  return { ejercicios: rutina.ejercicios.map(ex => ex.series.map(() => false)) };
}

export function toggleSerie(progreso, exIndex, serieIndex) {
  progreso.ejercicios[exIndex][serieIndex] = !progreso.ejercicios[exIndex][serieIndex];
  localStorage.setItem("progresoRutina", JSON.stringify(progreso));
}
