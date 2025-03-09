function Calculadora(){
    this.cuerpo = document.getElementById("controles")
    this.botones = this.cuerpo.querySelectorAll(".boton")
    this.visor = document.getElementById("visor")
    this.teclas = [".","0","1","2","3","4","5","6","7","8","9","+","-","*","/","Shift","Backspace","Enter"]
    this.verificado = true
    this.terminado = false
    this.cuenta = ""

    this.remover = function(texto){
        this.visor.value = this.visor.value.slice(0,this.visor.value.length-1)
    }
    this.clickboton = function(boton){
        if(this.terminado == true){
            this.visor.value = ""
            this.cuenta = ""
            this.terminado = false
        }
        if(this.visor.value == "Me confundiste"){
            this.visor.value = ""
            this.cuenta = ""

        }
        if(boton.id == "ac" && this.visor.value.length > 0){
            this.visor.value = ""
            this.cuenta = ""
        }else if(boton.id == "igual" && this.visor.value.length > 1){
            this.realizarcuenta()
        }else if(boton.id == "sumar" ){
            if(this.visor.value.length == 0){
                this.visor.value = this.visor.value + boton.textContent 
            }else{
                this.visor.value = this.visor.value + "+"+boton.textContent 
            }
            this.cuenta = this.cuenta+"+1"
        }else if(boton.id == "restar" ){
            if(this.visor.value.length == 0){
                this.visor.value = this.visor.value + boton.textContent 
            }else{
                this.visor.value = this.visor.value + "-"+boton.textContent 
            }
            this.cuenta = this.cuenta+"-1"
        }else if(boton.id == "multiplicar" ){
            if(this.visor.value.length == 0){
                this.visor.value = this.visor.value + boton.textContent 
            }else{
                this.visor.value = this.visor.value + "x"+boton.textContent 
            }
            this.cuenta = this.cuenta+"*2"
        }else if(boton.id == "dividir" ){
            if(this.visor.value.length == 0){
                this.visor.value = this.visor.value + boton.textContent 
            }else{
                this.visor.value = this.visor.value + "/"+boton.textContent 
            } 
            this.cuenta = this.cuenta+"/2"
        }
        console.log(this.cuenta)
    }
    
    this.visor.addEventListener("keydown",event =>{
        tecla = event.key 
        if(this.visor.value == "Me confundiste"){
            this.visor.value = ""
        }
        this.verificado = true
        console.log(tecla)
        this.teclas.forEach(teclas => {
            if(tecla == teclas && this.verificado == true){
                this.verificado = false
            }
        })
        if(this.verificado == true){
            this.visor.disabled = true
        }
        if(tecla == "Enter"){
            this.realizarcuenta()
        }
        this.visor.disabled = false
        this.visor.click(true)
    }) 
    this.botones.forEach(boton => {
        boton.addEventListener("click",this.clickboton.bind(this,boton)) 
    });
    this.realizarcuenta = function(){
        try{
            this.visor.value = eval(this.cuenta)+"🍎"
            if(eval(this.cuenta) == 0 || eval(this.cuenta) < 0.199){
                this.visor.value = "No quedo nada"
            }
            this.terminado = true
        }catch{
            this.visor.value = "Me confundiste"
        }
    }
}
var cal = new Calculadora()