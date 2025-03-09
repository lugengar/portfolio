feriadosArgentina = [
{ dia: 1, mes: 1, festividad: "Año Nuevo" },
{ dia: 12, mes: 2, festividad: "Carnaval" },
{ dia: 13, mes: 2, festividad: "Carnaval" },
{ dia: 24, mes: 3, festividad: "Día Nacional de la Memoria por la Verdad y la Justicia" },
{ dia: 28, mes: 3, festividad: "Jueves Santo" },
{ dia: 29, mes: 3, festividad: "Viernes Santo" },
{ dia: 1, mes: 5, festividad: "Día del Trabajador" },
{ dia: 2, mes: 4, festividad: "Día del Veterano y de los Caídos en la Guerra de Malvinas" },
{ dia: 25, mes: 5, festividad: "Día de la Revolución de Mayo" },
{ dia: 20, mes: 6, festividad: "Día de la Bandera" },
{ dia: 9, mes: 7, festividad: "Día de la Independencia" },
{ dia: 8, mes: 12, festividad: "Inmaculada Concepción de María" },
{ dia: 25, mes: 12, festividad: "Navidad" },
{ dia: 21, mes: 12, festividad: "Verano" },
{ dia: 21, mes: 3, festividad: "Otoño" },
{ dia: 21, mes: 6, festividad: "Invierno" },
{ dia: 21, mes: 9, festividad: "Primavera" }
]
function fechas(){
    this.fecha = new Date()
    this.fechahoy = new Date()
    this.calendario = document.getElementById("calendario")
    this.cambiaranio = document.getElementById("cambiaranio")
    this.diasem = document.querySelectorAll(".diasem")
    this.particulas = document.querySelectorAll(".particulas")
    this.opciones = document.querySelectorAll(".op")
    this.anio = document.getElementById("año")
    this.mes = document.getElementById("mes")
    this.estacioness = document.getElementById("estaciones")
    this.anio.value = this.fecha.getFullYear()
    this.mes.value = this.fecha.getMonth()
    this.maxaño = 2080
    this.minaño = 2000
    this.estacion = ""
    this.meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
    ]
    this.estaciones = [
        { dia: 21, mes: 12, festividad: "Verano" },
        { dia: 21, mes: 3, festividad: "Otoño" },
        { dia: 21, mes: 6, festividad: "Invierno" },
        { dia: 21, mes: 9, festividad: "Primavera" }
    ]
    this.dia = this.getDate
    this.dias = []
    this.diashtml = []
    this.extraerfechas = function(año, mes) {
        año = parseInt(año.value)
        mes = parseInt(mes.value)
        this.mes.value = mes
        this.fecha = new Date(año, mes)
        this.ultimodia = new Date(año, mes + 1, 0).getDate()
        this.nombredia = new Date(año, mes, 1).getDay()
        this.calendario.innerHTML = ""
        this.diashtml = []

        if (this.nombredia !== 0) {
            for (var i = this.nombredia - 1; i > -1; i--) {
                this.obj = document.createElement('div')
                this.diashtml.push(this.obj)
                this.calendario.appendChild(this.diashtml[this.diashtml.length - 1])
            }
        }
        this.obtenerestacion(mes)
        for (var i = 1; i <= this.ultimodia; i++) {
            this.obj = document.createElement('div')
            this.diashtml.push(this.obj)
            this.diashtml[this.diashtml.length - 1].className = "dias centro "+this.estacion+"2"
            this.diashtml[this.diashtml.length - 1].textContent = i;
            if (this.fechahoy.getFullYear() === año && this.fechahoy.getMonth() === mes && this.fechahoy.getDate() === i) {
                this.diashtml[this.diashtml.length - 1].className = "hoy centro "+this.estacion+"2"
            }
            feriadosArgentina.forEach(element => {
                if(element.dia == i && element.mes-1 == mes){
                    console.log(element.dia, i+1, element.mes-1, mes)
                    if(this.diashtml[this.diashtml.length-1].className != "hoy centro "+this.estacion+"2"){
                        this.diashtml[this.diashtml.length-1].className = "festividad centro "+this.estacion+"2"
                    }
                    this.diashtml[this.diashtml.length-1].addEventListener("mouseover", this.cambiartexto.bind(this,this.diashtml[this.diashtml.length-1],element.festividad))
                    this.diashtml[this.diashtml.length-1].addEventListener("mouseleave", this.cambiarfecha.bind(this,this.diashtml[this.diashtml.length-1],element.dia))
                }
            });
            
            this.calendario.appendChild(this.diashtml[this.diashtml.length - 1])
        }
    }

    this.cambiartexto = function(obj,festividad){
        obj.textContent = festividad
        obj.style.fontSize = "2vh"
    }
    this.cambiarfecha = function(obj,dia){
        obj.textContent = dia
        obj.style.fontSize = ""
    }
    this.obtenerestacion = function(mes){
        this.estacion = ""
        if(mes <= 2){
            this.estacion = "Verano"
            this.estacioness.value = "11"
        }
        this.estaciones.forEach(element => {
            if(element.mes-1 <= mes){
                this.estacion = element.festividad
                this.estacioness.value = (parseInt(element.mes)-1)

            }
        })
        if(mes == 11){
            this.estacion = "Verano"
            this.estacioness.value = "11"
        }
        
        this.cambiaranio.className = "cambiaranio "+this.estacion
        this.diasem.forEach(element => {
            element.className = "diasem centro "+this.estacion
        })
        this.opciones.forEach(element => {
            element.className = "op centro "+this.estacion+"2"
        })
        this.cont = 0
        this.particulas.forEach(element => {
            this.cont++
            element.id = this.estacion+this.cont
        })
    }
    this.extraerfechas(this.anio,this.mes)
    this.mes.addEventListener("change",this.extraerfechas.bind(this,this.anio,this.mes))
    this.estacioness.addEventListener("change",this.extraerfechas.bind(this,this.anio,this.estacioness))
    this.anio.addEventListener("change",this.extraerfechas.bind(this,this.anio,this.mes))
}
var fechas = new fechas()