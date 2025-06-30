// ---------------------------
// JSONs base de ejemplo
// ---------------------------

const ejerciciosBase = [
    { id: 1, nombre: "Ejercicio1", tipo: 1, musculos: [1, 2] },
    { id: 2, nombre: "Ejercicio2", tipo: 1, musculos: [1, 2] }
  ];
  
  const usuarioBase = {
    nombre: "Luciano Barbini",
    cantidad_entrenos: 1,
    entrenamientos: [1]
  };
  
  const rutinasBase = [
    {
      id: 1,
      nombre: "Rutina 1",
      dias: ["lun", "mie", "vie"],
      ejercicios: [
        { id: 1, series: 4, repeticiones: [5, 6, 5, 4], descanso: 60 },
        { id: 2, series: 4, repeticiones: [5, 6, 5, 4], descanso: 60 }
      ]
    }
  ];
  
  // ---------------------------
  // Guardar en localStorage
  // ---------------------------
  
  function guardarJSON(nombre, datos) {
    localStorage.setItem(nombre, JSON.stringify(datos));
  }
  
  // ---------------------------
  // Leer desde localStorage
  // ---------------------------
  
  function leerJSON(nombre) {
    const data = localStorage.getItem(nombre);
    return data ? JSON.parse(data) : null;
  }
  
  // ---------------------------
  // Inicializar si no existen
  // ---------------------------
  
  function inicializarDatos() {
    if (!leerJSON("ejercicios")) guardarJSON("ejercicios", ejerciciosBase);
    if (!leerJSON("usuario")) guardarJSON("usuario", usuarioBase);
    if (!leerJSON("rutinas")) guardarJSON("rutinas", rutinasBase);
  }
  
  // Llamar al inicio
  inicializarDatos();
  