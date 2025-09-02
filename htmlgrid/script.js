
function Pagina(){
    this.container = document.getElementById("CON")
    this.barracapas = document.getElementById("CONBAR")
    this.propbarra = document.getElementById("BAR2")
    this.agregarcapas = document.getElementById("AGRCAP")
    this.agregaretiquetas = document.getElementById("AGRETI")
    this.escondergrilla = document.getElementById("ESCGRID")
    this.exportarboton = document.getElementById("EXPORTAR")
    this.descargarboton = document.getElementById("DESCARGAR")
    this.subirboton = document.getElementById("SUBIR")
    this.pantalla = document.getElementById("PANTALLA")
    this.fuente = "'Courier New, monospace'"
    this.numerocapas = 0
    this.capas = []
    this.css = []
    this.etiquetasglobales = []
    this.name = "pagina"
    this.scrolling = []
    this.objetoenpropiedades = null
    this.grillasocultas = false
    this.grillasocultas2 = false
    this.seleccionado = null
    this.verificar = function(obj){
        if(this.seleccionado == null){
            this.seleccionado = obj
        }
        if(this.seleccionado != obj){
            this.seleccionado.cancelarseleccion()
            this.seleccionado = obj
        }
        
    }
    this.crearcapa = function(width,height,x,y,position,name,id,rows,columns){
        position = prompt('absolute o fixed')
        if(position == null){
            position = "absolute"
        }
        height = prompt("altura 200vh")  
        if(height == null && position != "fixed"){
            height = "200vh"
        }else if(height == null && position == "fixed"){
            height = "100%"
        }
        id = this.numerocapas
        
        this.css.push(new Estilos(this,"CSS_"+name+id))
        this.css[this.css.length-1].names.push(name+id)
        this.css[this.css.length-1].names.push("Grid_"+name+id)
        this.css[this.css.length-1].names.push("Sub_"+name+id)
        if(position == "fixed"){
            x = "auto"
            y="auto"
            this.css[this.css.length-1].propiedades.push(["display","grid", "position","absolute", "left","0%", "top","0%", "height",height, "width","100%", "pointer-events","none","z-index",id,"background-color", "none","background-repeat", "no-repeat","background-size", "contain","background-position-y", "center","background-position-x", "center", "background-image", "unset"])
            this.css[this.css.length-1].propiedades.push(["display","grid", "position","absolute", "left","0%", "top","0%", "height","100%", "width","100%", "pointer-events","none","grid-template-columns","repeat("+columns+", 1fr)", "grid-template-rows","repeat("+rows+", 1fr)"])
            this.css[this.css.length-1].propiedades.push(["display","grid", "position","absolute", "left","0%", "top","0%", "height","100%", "width","100%", "pointer-events","none", "grid-template","none",])
        }else{
            this.css[this.css.length-1].propiedades.push(["display","grid", "position",position, "left","0%", "top","0%", "height",height, "width","100%", "pointer-events","none","background-color", "none","background-repeat", "no-repeat","background-size", "contain","background-position-y", "center","background-position-x", "center","background-image", "unset"])
            this.css[this.css.length-1].propiedades.push(["display","grid", "position","absolute", "left","0%", "top","0%", "height","100%", "width","100%", "pointer-events","none","grid-template-columns","repeat("+columns+", 1fr)", "grid-template-rows","repeat("+rows+", 1fr)"])
            this.css[this.css.length-1].propiedades.push(["display","grid", "position","absolute", "left","0%", "top","0%", "height","100%", "width","100%", "pointer-events","none", "grid-template","none"])
        }
        this.capas.push(new Capas("100%",height,x,y,position,name,id,rows,columns,this,this.css[this.css.length-1],this,null,null,this,null))
        this.etiquetasglobales.push(this.capas[this.capas.length-1])
        if(this.grillasocultas == true){
            this.capas[this.capas.length-1].escondergrilla()
        }
        this.numerocapas++
    }
    this.eliminarcapa = function(capa){
        this.capas.splice(capa-1, 1)
        this.numerocapas--
    }
    this.ocultargrillas = function(){
        document.querySelectorAll(".EXP").forEach(element => {
            if(this.grillasocultas != true){
                element.style.display = "none"
            }else{
                element.style.display = "grid"
            }
        })
        this.grillasocultas= !this.grillasocultas
    }

    this.mostrargrillas = function(){
        this.capas.forEach(element => {
            element.mostrargrilla()
        })
    }
    this.crearetiqueta = function(){
        this.capas.forEach(element => {
            if(element.celdasSeleccionadas.length != 0){
                element.crearetiqueta()
            }else if(element.etiquetas.length != 0){
                element.etiquetas.forEach(element2 => {
                    if(element2.celdasSeleccionadas.length != 0){
                        element2.crearetiqueta()
                    }
                })
            }
        })
    }
    this.titulo2 = null
    this.propcontenido2 = null
    this.valores2 = null
    this.propiedades_etiquetas= []
    this.nombre_etiquetas= []
    this.titulo = null
    this.propcontenido = null
    this.valores = null
    this.listaids = ["#none"]
    this.propiedadesnomostradas = ["grid-area","grid-template","position","pointer-events"]
    this.propiedadestruefalse = ["display","text-decoration","background-repeat","overflow","border-left","border-right","border-top","border-bottom"]
    this.propiedadeslista= ["text-align","justify-content","align-items","background-size","background-position-x","background-position-y","href","font-family","box-shadow","border-style","filter"]
    this.cadasubpropiedad = [
        ["center","top","left","right","bottom","justify","unset"],
        ["center","top","left","right","bottom","justify","unset"],
        ["center","top","left","right","bottom","justify","unset"],
        ["contain","cover","none"],
        ["center","top","left","right","bottom"],
        ["center","top","left","right","bottom"],
        this.listaids,
        ['Arial, sans-serif',
        'Times New Roman, serif',
        'Helvetica, sans-serif',
        'Verdana, sans-serif',
        'Courier New, monospace',
        'Georgia, serif',
        'Palatino Linotype, Book Antiqua, Palatino, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Trebuchet MS, sans-serif',
        "Roboto, sans-serif",
        "Arial, sans-serif",
        "Times New Roman, serif",
        "Helvetica, sans-serif",
        "Verdana, sans-serif"],
        ['0 4vh 6vh rgba(0, 0, 0, 0.1)', // Sombra suave
        '2vh 2vh 4vh rgba(0, 0, 0, 0.3)', // Sombra más oscura
        '0 0 10vh 0 rgba(0, 0, 0, 0.2)', // Sombra difuminada
        'inset 0 0 10vh rgba(0, 0, 255, 0.5)', // Sombra interior
        '0 0 10vh 5vh rgba(255, 0, 0, 0.8)', // Sombra con desplazamiento
        '3vh 3vh 8vh rgba(0, 0, 0, 0.5)', // Otra sombra más difuminada
        '1vh 1vh 2vh rgba(0, 0, 0, 0.7)', // Sombra menos difuminada
        '5vh 2vh 10vh rgba(0, 0, 0, 0.4)',
        "none"],
        ['solid',
        'dashed',
        'dotted',
        'double',
        'groove',
        'ridge',
        'inset',
        'outset',
        'none',
        'hidden'],
        ['blur(3vh)', // Desenfoque
        'brightness(80%)', // Brillo reducido
        'contrast(150%)', // Contraste aumentado
        'grayscale(50%)', // Escala de grises parcial
        'hue-rotate(100deg)', // Rotación de tono
        'invert(100%)', // Inversión parcial de colores
        'opacity(50%)', // Opacidad reducida
        'saturate(100%)', // Saturación aumentada
        'saturate(0%)', // Saturación aumentada
        'sepia(30%)', // Tono sepia
        'drop-shadow(5vh 5vh 10vh rgba(0, 0, 0, 0.4))',
        "none"]        
    ]
    this.mostrarpropiedades = function(obj){
        if(this.objetoenpropiedades != obj.name){
            this.objetoenpropiedades = obj.name
            this.nombre_etiquetas= []
            this.propiedades_etiquetas= []
            this.propbarra.innerHTML = ""
            this.titulo = document.createElement("div")
            this.valores = document.createElement("div")
            this.propcontenido = document.createElement("div")
            this.titulo.className = "titulo"
            this.titulo.textContent = obj.name
            this.propcontenido.className = "propiedad"
            this.valores.className = "valor"
            this.propcontenido.appendChild(this.valores)
            this.propcontenido.appendChild(this.titulo)
            this.propbarra.appendChild(this.propcontenido)
            for (let clave in obj.estilos.propiedadescss[obj.container.className]) {
                if (obj.estilos.propiedadescss[obj.container.className].hasOwnProperty(clave)) {
                    if(!this.propiedadesnomostradas.includes(clave)){
                        if(this.propiedadeslista.includes(clave)){
                            this.propiedades_etiquetas.push(document.createElement("select"))
                            this.cadasubpropiedad[this.propiedadeslista.findIndex(elemento => elemento === clave)].forEach(element => {
                                this.nombre_etiquetas.push(document.createElement("option"))
                                this.nombre_etiquetas[this.nombre_etiquetas.length-1].textContent = element
                                this.nombre_etiquetas[this.nombre_etiquetas.length-1].value = element
                                this.nombre_etiquetas[this.nombre_etiquetas.length-1].for = clave
                                this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].appendChild(this.nombre_etiquetas[this.nombre_etiquetas.length-1]) 
                            })
                        }else{
                            this.propiedades_etiquetas.push(document.createElement("input")) 
                        }
                            this.nombre_etiquetas.push(document.createElement("label"))
                            this.nombre_etiquetas[this.nombre_etiquetas.length-1].textContent = clave
                            this.nombre_etiquetas[this.nombre_etiquetas.length-1].for = clave
                            this.valores.appendChild(this.nombre_etiquetas[this.nombre_etiquetas.length-1]) 
                        if(this.propiedadestruefalse.includes(clave)){
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].type = "checkbox"
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].name = "none"
                        }
                        this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].id = clave
                        if(clave == "background-image"){
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].type = "file"
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].accept="image/*"
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].addEventListener('change', function(obj2,event) {
                                file = event.target.files[0]; 
                                if (file) {
                                    reader = new FileReader()
                                    reader.onload = function(e) {
                                        obj.estilos.borrar()
                                        imageURL = e.target.result

                                        obj.estilos.propiedadescss[obj.container.className][clave] = "'"+imageURL+"'"
                                        obj.estilos.implementar()

                                    };
                                    reader.readAsDataURL(file)
                                }
                            }.bind(this,this.propiedades_etiquetas[this.propiedades_etiquetas.length-1]))
                        }else{
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].value = obj.estilos.propiedadescss[obj.container.className][clave]
                            this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].addEventListener('change', function(obj2){
                                obj.estilos.borrar()
                                if(obj2.type == "checkbox" && clave != "overflow"){
                                    if(obj.estilos.propiedadescss[obj.container.className][clave] == "none"){
                                        obj.estilos.propiedadescss[obj.container.className][clave] = "grid"
                                    }else{
                                        obj.estilos.propiedadescss[obj.container.className][clave] = "none"
                                    }
                                    if(clave == "display" && obj.estilos.propiedadescss[obj.container.className][clave] == "none"){
                                        obj.etiqueta.style.opacity = "80%"
                                    }else if(clave == "display" && obj.estilos.propiedadescss[obj.container.className][clave] == "grid"){
                                        obj.etiqueta.style.opacity = "100%"
                                    }
                                }else if(obj2.type == "checkbox" && clave == "overflow"){
                                    if(obj.estilos.propiedadescss[obj.container.className][clave] == "unset"){
                                        obj.estilos.propiedadescss[obj.container.className][clave] = "hidden"
                                    }else{
                                        obj.estilos.propiedadescss[obj.container.className][clave] = "unset"
                                    }
                                }else{
                                    obj.estilos.propiedadescss[obj.container.className][clave] = obj2.value
                                }
                                obj.estilos.implementar()
                            }.bind(this,this.propiedades_etiquetas[this.propiedades_etiquetas.length-1]))
                        }
                        this.valores.appendChild(this.propiedades_etiquetas[this.propiedades_etiquetas.length-1]) 
                    }

                }
            }
        
    
            this.titulo2 = document.createElement("div")
            this.valores2 = document.createElement("div")
            this.propcontenido2 = document.createElement("div")
            this.titulo2.className = "titulo"
            this.titulo2.textContent = "Atributos"
            this.propcontenido2.className = "propiedad"
            this.valores2.className = "valor"
            this.propcontenido2.appendChild(this.valores2)
            this.propcontenido2.appendChild(this.titulo2)
            this.propbarra.appendChild(this.propcontenido2)
            obj.propiedades.forEach(element => {
                if(this.propiedadeslista.includes(element)){
                    this.propiedades_etiquetas.push(document.createElement("select"))
                    this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].id = element
                    this.cadasubpropiedad[this.propiedadeslista.findIndex(elemento => elemento === element)].forEach(element2 => {
                        this.nombre_etiquetas.push(document.createElement("option"))
                        this.nombre_etiquetas[this.nombre_etiquetas.length-1].textContent = element2
                        this.nombre_etiquetas[this.nombre_etiquetas.length-1].value = element2
                        this.nombre_etiquetas[this.nombre_etiquetas.length-1].for = element
                        this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].appendChild(this.nombre_etiquetas[this.nombre_etiquetas.length-1]) 
                    })
                    this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].value = obj.container.getAttribute(element)
                    this.nombre_etiquetas.push(document.createElement("label"))
                }else{
                    this.propiedades_etiquetas.push(document.createElement("input"))
                    this.nombre_etiquetas.push(document.createElement("label"))
                    this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].value = obj.container.getAttribute(element)
                    this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].id = element
                }
                this.propiedades_etiquetas[this.propiedades_etiquetas.length-1].addEventListener('change', function(obj2){
                    obj.estilos.borrar()
                    if(element == "textContent"){
                        obj.container.textContent = obj2.value
                    }else{
                        obj.container.setAttribute(element, obj2.value)
                    }
                    obj.estilos.implementar()
                }.bind(this,this.propiedades_etiquetas[this.propiedades_etiquetas.length-1]))
                this.nombre_etiquetas[this.nombre_etiquetas.length-1].textContent = element
                this.nombre_etiquetas[this.nombre_etiquetas.length-1].for = element
                this.valores2.appendChild(this.nombre_etiquetas[this.nombre_etiquetas.length-1]) 
                this.valores2.appendChild(this.propiedades_etiquetas[this.propiedades_etiquetas.length-1]) 
            
            })
        }
    }
    this.exportar = function(){
        con = document.getElementById("estilosprede").innerHTML
        con2 = this.container.cloneNode()
        con2.innerHTML = this.container.innerHTML
        for(i=0;i<this.css.length;i++){
            con += this.css[i].estilos.innerHTML
        }
        con2.querySelectorAll(".EXP").forEach(element=>{
            element.remove()
        })
        contenidoHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Archivo Exportado</title>
            </head>
            <`+"body"+`>
                <div id="CON2">
                `+con2.innerHTML+`
                </div>
            <`+"/body"+`>
            </html>
            <style>`+con+`</style>
        `
        blob = new Blob([contenidoHTML], { type: 'text/html' })
        enlaceDescarga = document.createElement('a')
        enlaceDescarga.href = URL.createObjectURL(blob)
        enlaceDescarga.download = 'archivo_exportado.html'
        enlaceDescarga.click()
        enlaceDescarga.remove()
        con2.remove()
    }
    this.scroll = function() {
        var desplazamientoActual = this.container.scrollTop;
        this.scrolling.forEach(function(elemento) {
            window.requestAnimationFrame(function() {
            elemento.style.transform = 'translateY(' + desplazamientoActual + 'px)';
            });
        });
    };
    
    this.descargar = function(){ 
        this.archivo = []
        this.archivo.push("numerocapas",this.numerocapas)
        this.escribirarchivo(this.capas, this.archivo )
        console.log(this.archivo)
        contenidoHTML = this.archivo.join("-")
        blob = new Blob([contenidoHTML], { type: 'text/save' })
        enlaceDescarga = document.createElement('a')
        enlaceDescarga.href = URL.createObjectURL(blob)
        enlaceDescarga.download = 'archivo_exportado.save'
        enlaceDescarga.click()
        enlaceDescarga.remove()
    }
    this.escribirarchivo = function(lista,posicion){
        lista.forEach(element => {
            posicion.push("capa",[])
            posicion[posicion.length-1].push("celdas",[])
            element.celdas.forEach(celdas => {
                celdas.forEach(celdas2 => {
                    posicion[posicion.length-1][1].push(celdas2.ocupado)
                })
            })
            posicion[posicion.length-1].push("estilos",[])
            posicion[posicion.length-1][3].push(element.estilos.propiedades)
            posicion[posicion.length-1][3].push(element.estilos.names)
            posicion[posicion.length-1][3].push(element.estilos.propiedadescss)
            posicion[posicion.length-1][3].push(element.estilos.creado)
            posicion[posicion.length-1][3].push(element.estilos.id)
            posicion[posicion.length-1].push("name",element.name)
            posicion[posicion.length-1].push("id",element.id)
            posicion[posicion.length-1].push("parent",element.parent.name)
            posicion[posicion.length-1].push("height",element.height)
            posicion[posicion.length-1].push("width",element.width)
            posicion[posicion.length-1].push("columns",element.columns)
            posicion[posicion.length-1].push("rows",element.rows)
            posicion[posicion.length-1].push("x",element.x)
            posicion[posicion.length-1].push("y",element.y)
            posicion[posicion.length-1].push("type",element.type)
            posicion[posicion.length-1].push("profundidad",element.profundidad)
            posicion[posicion.length-1].push("gridtemplate",element.gridtemplate)
            posicion[posicion.length-1].push("etiquetas",[])
            this.escribirarchivo(element.etiquetas,posicion[posicion.length-1])
        })
        
    }
    this.subirarchivo = function(){
        if (this.subirboton.files.length > 0) {
            const archivo = this.subirboton.files[0]
            const lector = new FileReader()
            lector.onload = function (evento) {
                const contenido = evento.target.result
                if(confirm("¿Quieres continuar? Se eliminara todo lo no guardado.")){
                    this.interpretararchivo(contenido)
                }
            }.bind(this)
            lector.readAsText(archivo)
        } else {
            alert('Selecciona un archivo de texto antes de cargar.')
        }
    }
    this.interpretararchivo = function(archivo){
        this.convertido = archivo.split('-')
        this.convertido.forEach(element=>{
            element.split(",")
        })
        console.log(this.convertido)
        this.reset()
        this.recrear()
    }
    this.recrear = function(){
        this.convertido.forEach(function(element, i,lista=this.convertido) {
            console.log("Elemento:", element, "Índice:", i);
            if(element == "numerocapas"){
                this.numerocapas = parseInt(this.convertido[i+1])
            }
            if(element == "capa"){
                this.crearcapa("100%","200vh","1fr","1fr",null,"Capa_",null,60,60)
            }
        }.bind(this))
    }
    this.reset = function(){
        this.etiquetasglobales.forEach(etiqueta=>{
            etiqueta.eliminaretiqueta(true)
        })
        this.capas = []
        this.etiquetasglobales = []
        this.numerocapas = 0
        this.css = []
        this.propbarra.innerHTML = ""
        this.scrolling = []
    }
    this.container.addEventListener('scroll', this.scroll.bind(this));
    this.exportarboton.addEventListener("click",this.exportar.bind(this)) 
    this.descargarboton.addEventListener("click",this.descargar.bind(this)) 
    this.subirboton.addEventListener("change",this.subirarchivo.bind(this)) 
    this.agregarcapas.addEventListener("click",this.crearcapa.bind(this,"100%","200vh","1fr","1fr",null,"Capa_",null,60,60))
    this.escondergrilla.addEventListener("click",this.ocultargrillas.bind(this))
}
function Estilos(parent,name){
    this.parent = parent
    this.estilos = document.createElement("style")
    this.estilos.id = name
    document.body.appendChild(this.estilos)
    this.names = []
    this.propiedades = []
    this.propiedadescss = {}
    this.platilla = ""
    this.creado = false
    this.crearcss = function() {
        if(this.creado == false){
            this.creado = true
            this.propiedadescss = {}
            for (x = 0; x < this.propiedades.length; x++) {
                this.propiedadescss[this.names[x]] = {}
                for (y = 0; y < this.propiedades[x].length; y += 2) {
                    this.propiedadescss[this.names[x]][this.propiedades[x][y]] = this.propiedades[x][y +1]
                }
            }

        }
    }
    this.agregarcss = function(name,propiedades){
        this.names.push(name)
        this.propiedades.push(propiedades)
    }
    this.implementar = function(){
        this.platilla = ""
        for(x=0;x<this.propiedades.length;x++){
            this.platilla += "."+this.names[x]+"{"
            for(y=0;y<this.propiedades[x].length;y+=2){
                if(this.propiedades[x][y] == "background-image"){
                    this.platilla += this.propiedades[x][y]+": url("+this.propiedadescss[this.names[x]][this.propiedades[x][y]]+"); "
                }else{
                    this.platilla += this.propiedades[x][y]+":"+this.propiedadescss[this.names[x]][this.propiedades[x][y]]+"; "
                }
            }
            this.platilla += "} "
        }
        this.estilos.innerHTML += this.platilla
    }
    this.borrar = function(){
        this.estilos.innerHTML = null
    }
    this.reiniciarcss = function(){
        this.creado = false
        this.crearcss()
    }
}

function Capas(width,height,x,y,position,name,id,rows,columns,parent,css,pagin,type,coor,prof,capa){      
    this.profundidad = prof
    this.height = height
    this.width = width
    this.parent = parent
    this.pagina = pagin
    this.type = type
    this.x = x
    this.y = y
    if(capa == null){
        this.capa = this
    }else{
       this.capa = capa
    }
    this.columns = columns
    this.rows = rows
    this.total = columns*rows
    this.position = position
    this.name = name+id
    this.celdasSeleccionadas = []
    this.id = id
    this.estilos = css
    this.coordenadas = []
    this.ocupados = coor
    this.celdas = []
    this.colorandom = ""
    this.etiquetas = []
    this.gridtemplate = []
    this.cont = 0
    this.propiedades = ["id","textContent"]
    this.etiqueta = document.createElement("details")
    this.conombre = document.createElement("summary")
    this.nombre = document.createElement("div")
    this.ocultar = document.createElement("a")
    this.ocultar.id = "Ocultar_"+this.name
    this.etiqueta.className="etiquetas"
    this.nombre.textContent = name+id
    this.ocultar.textContent = "a"
    this.conombre.appendChild(this.ocultar)
    this.conombre.appendChild(this.nombre)
    this.etiqueta.appendChild(this.conombre)
    this.crearceldas = function(){
        for(i=0;i<this.rows;i++){
            this.celdas.push([])
            for(j=0;j<this.columns;j++){
                this.cont++
                this.celdas[i].push(new Celdas(i,j,"Celda_",this.cont,this))
            }
        }
    }
    this.crearestilo = function(name,propiedades){
        this.estilos.agregarcss(name,propiedades)
    }
    this.crearestaetiqueta = function(){
        this.pagina.listaids.push("#"+name+id)
        this.colorandom = prompt("Codigo de color o nombre en ingles")
        if(this.colorandom == null){
            this.colorandom = "white"
        }
      
        if(this.type == "a"){
            this.container = document.createElement(this.type)
            this.crearestilo(this.parent.name+"_"+this.type+"_"+this.name,[
            "grid-area",this.name, 
            "background-color",this.colorandom, 
            "display","grid", 
            "position","relative", 
            "pointer-events","auto",
            "border-color", "none",
            "border-width", "none",
            "border-style", "none",
            "border-left", "none",
            "border-right", "none",
            "border-top", "none",
            "border-bottom", "none",
            "border-radius", "none",
            "border-top-right-radius", "none",
            "border-top-left-radius", "none",
            "border-bottom-right-radius", "none",
            "border-bottom-left-radius", "none",
            "color", "black",
            "font-size", "2vh",
            "font-family", this.pagina.fuente,
            "text-align", "center",
            "justify-content", "center",
            "align-items", "center",
            "text-decoration", "auto",
            "box-shadow", "none",
            "overflow","hidden",
            "filter", "none"])
            this.propiedades = ["id","href","textContent"]
            this.container.href = "#none"
        }else if(this.type == "scroll"){
            this.container = document.createElement(this.type)
            this.crearestilo(this.parent.name+"_"+this.type+"_"+this.name,[
            "grid-area",this.name, 
            "background-color",this.colorandom, 
            "display","grid", 
            "position","relative", 
            "pointer-events","auto", 
            "overflow", "hidden",
            "overflow-y", "scroll",
            "border-color", "none",
            "border-width", "none",
            "border-style", "none",
            "border-left", "none",
            "border-right", "none",
            "border-top", "none",
            "border-bottom", "none",
            "border-radius", "none",
            "border-top-right-radius", "none",
            "border-top-left-radius", "none",
            "border-bottom-right-radius", "none",
            "border-bottom-left-radius", "none",
            "color", "black",
            "font-size", "2vh",
            "font-family", this.pagina.fuente,
            "text-align", "center",
            "text-decoration", "auto",
            "box-shadow", "none",
            "filter", "none"])
        }else if(this.type == "p" || this.type == "textarea"){
            this.container = document.createElement("div")
            this.crearestilo(this.parent.name+"_"+this.type+"_"+this.name,[
            "grid-area",this.name, 
            "background-color",this.colorandom, 
            "display","grid", 
            "position","relative", 
            "pointer-events","auto",
            "border-color", "none",
            "border-width", "none",
            "border-style", "none",
            "border-left", "none",
            "border-right", "none",
            "border-top", "none",
            "border-bottom", "none",
            "border-radius", "none",
            "border-top-right-radius", "none",
            "border-top-left-radius", "none",
            "border-bottom-right-radius", "none",
            "border-bottom-left-radius", "none",
            "color", "black",
            "font-size", "2vh",
            "font-family", this.pagina.fuente,
            "text-align", "center",
            "justify-content", "center",
            "align-items", "center",
            "text-decoration", "auto",
            "box-shadow", "none",
            "filter", "none"])
        }else if(this.type == "img"){
            this.container = document.createElement("div")
            this.crearestilo(this.parent.name+"_"+this.type+"_"+this.name,[
            "grid-area",this.name, 
            "display","grid", 
            "position","relative", 
            "pointer-events","auto",
            "background-image", "unset",
            "background-repeat", "no-repeat",
            "background-size", "contain",
            "background-position-y", "center",
            "background-position-x", "center",
            "border-color", "none",
            "border-width", "none",
            "border-style", "none",
            "border-left", "none",
            "border-right", "none",
            "border-top", "none",
            "border-bottom", "none",
            "border-radius", "none",
            "border-top-right-radius", "none",
            "border-top-left-radius", "none",
            "border-bottom-right-radius", "none",
            "border-bottom-left-radius", "none",
            "color", "black",
            "font-size", "2vh",
            "font-family", this.pagina.fuente,
            "text-align", "center",
            "text-decoration", "auto",
            "box-shadow", "none",
            "filter", "none"])
        }else{
            this.container = document.createElement(this.type)
            this.crearestilo(this.parent.name+"_"+this.type+"_"+this.name,["grid-area",this.name, 
            "background-color",this.colorandom, 
            "display","grid", 
            "position","relative", 
            "pointer-events", "auto",
            "border-color", "none",
            "border-width", "none",
            "border-style", "none",
            "border-left", "none",
            "border-right", "none",
            "border-top", "none",
            "border-bottom", "none",
            "border-radius", "none",
            "border-top-right-radius", "none",
            "border-top-left-radius", "none",
            "border-bottom-right-radius", "none",
            "border-bottom-left-radius", "none",
            "color", "black",
            "font-size", "2vh",
            "font-family", this.pagina.fuente,
            "text-align", "center",
            "text-decoration", "auto",
            "box-shadow", "none",
            "filter", "none"])
        }
        if(this.type == "input"){
            this.propiedades = ["type","name","for","id","value"]
            this.container.type = prompt("text number checkbox submit")
            if(this.container.type == null){
                this.container.type = "text"
            }
        }else if(this.type == "form"){
            this.propiedades = ["type", "action"]
        }
        this.container.id = name+id
        this.container.className = this.parent.name+"_"+this.type+"_"+this.name
        this.parent.subcapa.appendChild(this.container)
        this.parent.etiqueta.appendChild(this.etiqueta)
        this.container.addEventListener("click",this.pagina.mostrarpropiedades.bind(this.pagina,this))
        if(this.columns != 0 && this.type !="a" && this.type !="p"){
            this.crearsubgrilla()
        }else{
            this.columns = 0
            this.rows = 0
            this.estilos.crearcss()
            this.iniciaretiquetas()
        }
    }
    this.cancelarseleccion = function(){
        if(this.celdasSeleccionadas.length != 0){
            this.celdas.forEach((fila) => {
                fila.forEach(celda => {
                    celda.html.style.backgroundColor = ''
                })
            })
            this.parar = false
            this.color = "lightblue"
            this.celdasSeleccionadas = []
            this.coordenadas = []
        }
    }
    this.crearsubgrilla = function(){
        if(this.type == "scroll"){
            this.crearestilo(this.parent.name+"_Grid_"+this.name,["display","grid", "position","absolute", "left","0%", "top","0%", "height","100vh", "width","100%", "pointer-events","none","grid-template-columns","repeat("+this.columns+", 1fr)", "grid-template-rows","repeat("+this.rows+", 1fr)"])
            this.crearestilo(this.parent.name+"_Sub_"+this.name,["display","grid", "position","absolute", "left","0%", "top","0%", "height","100vh", "width","100%", "pointer-events","none","grid-template"," "])
        }else{
            this.crearestilo(this.parent.name+"_Grid_"+this.name,["display","grid", "position","absolute", "left","0%", "top","0%", "height","100%", "width","100%", "pointer-events","none","grid-template-columns","repeat("+this.columns+", 1fr)", "grid-template-rows","repeat("+this.rows+", 1fr)"])
            this.crearestilo(this.parent.name+"_Sub_"+this.name,["display","grid", "position","absolute", "left","0%", "top","0%", "height","100%", "width","100%", "pointer-events","none","grid-template"," "])
        }
        this.grid = document.createElement("div")
        this.subcapa = document.createElement("div")
        this.grid.id = this.parent.name+"_Grid_"+this.name
        this.subcapa.id = this.parent.name+"_Sub_"+this.name
        this.grid.className = "EXP "+this.parent.name+"_Grid_"+this.name
        this.subcapa.className = this.parent.name+"_Sub_"+this.name
        this.container.appendChild(this.subcapa)
        this.container.appendChild(this.grid)
        this.crearceldas()
        this.estilos.crearcss()
        this.iniciaretiquetas()
        this.grid.addEventListener("click",this.pagina.mostrarpropiedades.bind(this.pagina,this))

    }
    this.crearestacapa = function(){ 
        this.profundidad = 0  
        this.container = document.createElement("div")
        this.grid = document.createElement("div")
        this.subcapa = document.createElement("div")
        this.container.id = this.name
        this.grid.id = "Grid_"+this.name
        this.subcapa.id = "Sub_"+this.name  
        this.container.className = this.name
        this.grid.className = "EXP Grid_"+this.name
        this.subcapa.className = "Sub_"+this.name
        this.container.appendChild(this.subcapa)
        this.container.appendChild(this.grid)
        this.pagina.container.appendChild(this.container)
        this.pagina.barracapas.appendChild(this.etiqueta)
        if(this.position == "fixed"){
            this.pagina.scrolling.push(this.container)
        }
        /*
        if(this.position == "fixed"){
            this.codigo = document.createElement("script")
            this.codigo.textContent = `
            var scroll_`+this.name+` = document.getElementById("`+this.parent.container.id+`")
            var ele_`+this.name+` = document.getElementById("`+this.name+`")
            if (scroll_`+this.name+` == null) {
                scroll_`+this.name+` = document.getElementById("`+this.parent.container.id+`2")
            }
            scroll_`+this.name+`.addEventListener('scroll', function() {
                var desplazamientoActual = scroll_`+this.name+`.scrollTop
                ele_`+this.name+`.style.top = desplazamientoActual+'px'
            })`
            this.container.appendChild(this.codigo)
        }*/
        this.crearceldas()
        this.estilos.crearcss()
        this.iniciaretiquetas()
        this.grid.addEventListener("click",this.pagina.mostrarpropiedades.bind(this.pagina,this))            
    }
   
    
    this.iniciaretiquetas = function(){
        this.gridtemplate = []
        this.estilos.borrar()
        for(i=0;i<this.rows;i++){
            this.gridtemplate.push("'")
            for(j=0;j<this.columns;j++){
                if(this.celdas[i][j].ocupado == false || this.celdas[i][j].objetoarriba == null){
                    this.gridtemplate.push(".")
                }else{
                    this.gridtemplate.push(this.celdas[i][j].objetoarriba.name)
                }
            }
            this.gridtemplate.push("' "+this.y+"\n")
        }
        this.gridtemplate.push("/")
        for(j=0;j<this.columns;j++){
            this.gridtemplate.push(this.x)
        }
        if(this.columns + this.rows != 0){
        this.estilos.propiedadescss[this.subcapa.className]["grid-template"] = this.gridtemplate.join(' ')
        }
        this.estilos.implementar()
    }
    this.escondergrilla = function(){
        this.grid.style.display = "none"
        //this.cancelarseleccion()
    }
    this.mostrargrilla = function(){
        this.grid.style.display = "grid"
    }
    this.escondergrillainterna = function(){
        this.etiquetas.forEach(element =>{
            if(element.columns != 0 && element.rows != 0){
                element.grid.style.display = "none"
            }
        })
    }
    this.mostrargrillainterna = function(){
        this.etiquetas.forEach(element =>{
            if(element.columns != 0 && element.rows != 0){
                element.grid.style.display = "grid"
            }
        })
    }
    this.ocultarcapa = function(){
        this.cancelarseleccion()
        if(this.container.style.display != "none"){
            this.ocultar.style.backgroundColor = "yellow"
            this.container.style.display = "none"
        }else{
            this.container.style.display = "grid"
            this.ocultar.style.backgroundColor = "blue"
        }
    }
    this.color = "lightblue"
    this.parar = false
    this.calcular = function(minX,minY,maxX,maxY){
        this.celdas.forEach((fila) => {
            fila.forEach(celda => {
                if(celda.x >= minX && celda.x <= maxX &&celda.y >= minY && celda.y <= maxY ){
                    if (celda.ocupado) {
                        this.color = 'red'
                        this.parar = true
                        this.celdas[this.coordenadas[2]][this.coordenadas[3]].html.style.backgroundColor = this.color 
                    }else{
                        celda.html.style.backgroundColor = this.color 
                        this.celdasSeleccionadas.push(celda)
                    }
                }
            });
        });
    }
   
    
    this.crearetiqueta = function(){
        if(this.parar != true && this.celdasSeleccionadas.length != 0){
            this.parar = false
            this.color = "lightblue"
            this.pagina.css.push(new Estilos(this.pagin,"CSS_"+this.name+"_Etiqueta"+this.profundidad+this.capa.id+this.etiquetas.length))
            this.tipo = prompt("div a scroll p img")
            if(this.tipo == null){
                this.tipo = "div"
            }
            this.etiquetas.push(new Capas("100%","100%","1fr","1fr",null,"Etiqueta"+this.profundidad+this.capa.id,this.etiquetas.length,40,40,this,this.pagina.css[this.pagina.css.length-1],this.pagina,this.tipo,this.celdasSeleccionadas,this.profundidad+1,this.capa))
            this.pagina.etiquetasglobales.push(this.etiquetas[this.etiquetas.length-1])
            if(this.grillasocultas == true){
                this.etiquetas[this.etiquetas.length-1].escondergrilla()
            }
            this.celdasSeleccionadas.forEach((celda) => {
                celda.ocupado = true
                celda.html.className = "nada2"
                celda.objetoarriba = this.etiquetas[this.etiquetas.length-1]
            })
            this.cancelarseleccion()
            this.iniciaretiquetas()
        }
    }
    this.eliminaretiqueta = function(todo){
        if(todo != null || confirm('¿Quieres eliminar '+this.name+' y todo su contenido interno?')){ 
            if(this.ocupados != null && todo == null){
                this.ocupados.forEach(celda=>{
                    celda.ocupado = false
                    celda.html.className = "nada"
                    celda.objetoarriba = null
                })
                this.parent.iniciaretiquetas()
            }
            this.container.innerHTML = ""
            this.container.remove()
            this.estilos.estilos.remove()
            this.etiqueta.innerHTML = ""
            this.etiqueta.remove()
            delete this.estilos
            delete this
        }
    }

    if(this.type != null){
        this.crearestaetiqueta()

    }else{
        this.crearestacapa()

    }
    this.ocultar.addEventListener("click",this.pagina.mostrarpropiedades.bind(this.pagina,this))

    this.pagina.agregarcapas.addEventListener("click",this.cancelarseleccion.bind(this))

    this.pagina.agregaretiquetas.addEventListener("click",this.crearetiqueta.bind(this))
}
function Celdas(x,y,name,id,parent){
    this.x = x
    this.y = y
    this.ocupado = false
    this.queocupa = null
    this.name = name+id
    this.parent = parent 
    this.id = id
    this.html = document.createElement("a")
    this.html.textContent = ""
    this.html.className = "nada"
    this.objetoarriba = null
    this.parent.grid.appendChild(this.html)
    this.seleccionar = function(){
        this.parent.pagina.verificar(this.parent)
        this.calcular()
    }
    this.calcular = function(){
        if(!this.ocupado){
            this.html.style.backgroundColor = this.parent.color 
            if(this.parent.coordenadas.length == 0){
                this.parent.coordenadas.push(this.x,this.y)
            }
            if(this.parent.coordenadas.length == 2){
                this.parent.coordenadas.push(this.x,this.y)
            }
            if(this.parent.coordenadas.length == 4){
                this.parent.coordenadas[2] = this.x
                this.parent.coordenadas[3] = this.y
            }
            if (!this.ocupado && !this.parent.celdasSeleccionadas.includes(this)) {
                this.parent.celdasSeleccionadas.push(this)
                this.html.style.backgroundColor = this.parent.color
                if (this.parent.celdasSeleccionadas.length >= 2) {
                    minX = Math.min(...this.parent.celdasSeleccionadas.map(c => c.x))
                    minY = Math.min(...this.parent.celdasSeleccionadas.map(c => c.y))
                    maxX = Math.max(...this.parent.celdasSeleccionadas.map(c => c.x))
                    maxY = Math.max(...this.parent.celdasSeleccionadas.map(c => c.y))
                    this.parent.calcular(minX,minY,maxX,maxY)
                }
                } else {
                this.parent.cancelarseleccion()
            }
        }
    }
    this.html.addEventListener("click",this.seleccionar.bind(this))
}

const pagina = new Pagina()
