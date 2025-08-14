function iniciar(){
cole = document.getElementById("coleccion");
barrainferior = document.getElementById("imgbarrainf");
listacoleccion =  document.getElementById("lista");
listapremios =  document.getElementById("listpremios");
cargando =  document.getElementById("cargando");
regalos = document.getElementById("REG");
coleccion = document.getElementById("COLE");
premios = document.getElementById("PRE");
config = document.getElementById("CONF");
difuminado = document.getElementById("DIFUSO");
salirconfig = document.getElementById("salirconf");
opconfig = document.getElementById("configp");
var click = 0;
var cerrado = 0;
prem = document.getElementById("PREM");
jug = document.getElementById("JUG");
log = document.getElementById("LOG");

cinta = document.getElementById("cinta");
cinta2 = document.getElementById("cintacoleccion");
fondo = document.getElementById("fondo");
estrella1 = document.getElementById("estrella2");
var pagina = 2;
coleccion.style.backgroundColor="rgb(120,196,231)";
botonr = document.getElementById("BOTONR");
botonl = document.getElementById("BOTONL");
extras = document.querySelectorAll(".muestra");
opcionescinta = document.getElementById("opcioncinta");
var left = extras.length-1;
var right = 1;
var center = 0;
var extra = 0;
var cont =0;
var tiempo = 1;
console.log( document.getElementById("cintacoleccion").querySelectorAll(".muestra"))
extras[left].id = "LEFT";
extras[center].id = "CENTER";
extras[right].id = "RIGHT";
function leftF(){
    if(click == 0){
        click = 1;
        if(cont-1 < 0){
            extras[extras.length-1].style.animation="leftsalir "+tiempo+"s both";
            extra = extras.length-1;
        }else{
            extras[cont-1].style.animation="leftsalir "+tiempo+"s both";
            extra = cont-1;
        }

        extras[cont].style.animation="leftanim "+tiempo+"s both";
        left = cont;

        if(cont+1 == extras.length){
            extras[0].style.animation="centeranim "+tiempo+"s both";
            center = 0;
        }else{
            extras[cont+1].style.animation="centeranim "+tiempo+"s both";
            center = cont+1;
        }

        if(cont+2 > extras.length){
            extras[1].style.animation="rightnuevo "+tiempo+"s both";
            right = 1;
        }else if(cont+2 == extras.length){
            extras[0].style.animation="rightnuevo "+tiempo+"s both";
            right = 0;
        }else{
            extras[cont+2].style.animation="rightnuevo "+tiempo+"s both";
            right = cont+2;
        }
        setTimeout(function cargandof(){
            resetcoleccion(1);
            click = 0;
        },tiempo * 1000)
    }
    
}
function rightF(){
    if(click == 0){
        click = 1;
        if(cont+1 == extras.length){
            extras[0].style.animation="rightsalir "+tiempo+"s both";
            extra = 0;
        }else{
            extras[cont+1].style.animation="rightsalir "+tiempo+"s both";
            extra = cont+1;
        }

        extras[cont].style.animation="rightanim "+tiempo+"s both";
        right = cont;

        if(cont-1 < 0){
            extras[extras.length-1].style.animation="centeranim "+tiempo+"s both";
            center = extras.length-1;
        }else{
            extras[cont-1].style.animation="centeranim "+tiempo+"s both";
            center = cont-1;
        }

        if(cont-2 == -1){
            extras[extras.length-1].style.animation="leftnuevo "+tiempo+"s both";
            left = extras.length-1;
        }else if(cont-2 < -1){
            extras[extras.length-2].style.animation="leftnuevo "+tiempo+"s both";
            left = extras.length-2;
        }else{
            extras[cont-2].style.animation="leftnuevo "+tiempo+"s both";
            left = cont-2;
        }
        setTimeout(function cargandof(){
            resetcoleccion(-1);
            click = 0;
        },tiempo * 1000)
    }
    
}


function resetcoleccion(num){
    cont += num;
    if(cont < 0){
        cont = extras.length-1;
    }else if(cont > extras.length-1){
        cont = 0;
    }
    console.log(cont, extras.length);
    extras[extra].id = "EXTRA";
    extras[right].id = "RIGHT";
    extras[center].id = "CENTER";
    extras[left].id = "LEFT";
    extras[extra].style.animation = "none";
    extras[right].style.animation = "none";
    extras[center].style.animation = "none";
    extras[left].style.animation = "none";
}
function barrainf(){
    if(click == 0){
        click = 1;
        if(cerrado == 0){
            barrainferior.style.animation = "cambio 4s both";
            if(pagina == 1){
                listacoleccion.style.display = "grid";
                listapremios.style.display = "none";
            }else if(pagina == 3){
                listacoleccion.style.display = "none";
                listapremios.style.display = "grid";
            }
            cargando.style.display = "none"
            cerrado = 1;
            setTimeout(function cargandof(){
                click = 0;
            },4000)
        }else{
            barrainferior.style.animation = "cambio2 2s both";
            cerrado = 0;
            setTimeout(function cargandof(){
                click = 0;
            },2000)
        }

    }
}
function regalosf(){
    cambio(1)
    regalos.style.backgroundColor="rgb(120,196,231)";
    coleccion.style.backgroundColor="";
    premios.style.backgroundColor="";
}

function coleccionf(){
    cambio(2)
    regalos.style.backgroundColor="";
    coleccion.style.backgroundColor="rgb(120,196,231)";
    premios.style.backgroundColor="";
}

function premiosf(){
    cambio(3)
    regalos.style.backgroundColor="";
    coleccion.style.backgroundColor="";
    premios.style.backgroundColor="rgb(120,196,231)";
}
function cambio(num){
    if(click == 0 && pagina != num){
        pagina = num;
        click = 1;
        barrainferior.style.animation = "cambio 4s both";
        cargando.style.display = "block"
        listacoleccion.style.display = "none";
        listapremios.style.display = "none";
        setTimeout(function cargandof(){
            cambiarpag(num);
            barrainferior.style.animation = "cambio2 2s both";
            setTimeout(function cargandof(){
                click = 0;
            },2000)
        },5000)
    }
}
function cambiarpag(num){
    desaparecer();
    if(num ==1){
        fondo.style.backgroundImage = "url(IMG/fondo1.png)";
        estrella1.style.display = "block";
        cinta.style.display = "block";
    }else if(num == 2){
        fondo.style.backgroundImage = "url(IMG/fondo2.png)";
        cole.style.display = "none";
        cinta2.style.display = "block";
        opcionescinta.style.display = "grid";
    }
    else if(num == 3){
        fondo.style.backgroundImage = "url(IMG/fondo2.png)";
        cole.style.display = "none";
        cinta2.style.display = "none";
        opcionescinta.style.display = "grid";
    }else{
        fondo.style.backgroundImage = "url(IMG/fondo3.png)";
    }
}
function desaparecer(){
    opcionescinta.style.display = "none";
    cole.style.display = "block";
    estrella1.style.display = "none";
    cinta.style.display = "none";
    cinta2.style.display = "none";
}
difuminado.style.display = "none";
function salirconfigf(){
    if(click == 0){
        click = 1;
        opconfig.style.animation ="configsalir 1s both ";
        difuminado.style.animation = "desdifuminar 1s both";
        setTimeout(function cargandof(){
            click = 0;
            difuminado.style.display = "none";
        },1500)
    }
}
function configuracionf(){
    if(click == 0){
        click = 1;
        difuminado.style.display = "grid";
        opconfig.style.animation ="config 1s both";
        difuminado.style.animation = "difuminar 1s both";
        setTimeout(function cargandof(){
            click = 0;
        },1500)
    }
}
function premF(){
    if(click == 0){
        cambiocolec(1);
        prem.style.borderBottom = "rgb(214, 86, 106) 1vh solid";
    }
}
function jugF(){
    if(click == 0){
        cambiocolec(2);
        jug.style.borderBottom = "rgb(214, 86, 106) 1vh solid";
    }
}
function logF(){
    if(click == 0){
        cambiocolec(3);
        log.style.borderBottom = "rgb(214, 86, 106) 1vh solid";
    }
}

function cambiocolec(num){
    if(click == 0){
        click = 1;
        prem.style.borderBottom = "none";
        jug.style.borderBottom = "none";
        log.style.borderBottom = "none";
        extras[right].style.animation = "todosalir 1s both";
        extras[center].style.animation = "todosalir 1s both";
        extras[left].style.animation = "todosalir 1s both";
        setTimeout(function cargandof(){
            extras[extra].style.animation = "none";
            extras[right].style.animation = "none";
            extras[center].style.animation = "none";
            extras[left].style.animation = "none";
            extras[right].id = "EXTRA";
            extras[center].id = "EXTRA";
            extras[left].id = "EXTRA";
            if(num == 1){
                extras = document.getElementsByClassName("muestra2");
            }else if(num == 2){
                extras = document.getElementsByClassName("muestra");
            }else{
                extras = document.getElementsByClassName("muestra3");
            }
            left = extras.length-1;
            right = 1;
            center = 0;
            extra = 0;
            cont =0;
            extras[left].id = "LEFT";
            extras[center].id = "CENTER";
            extras[right].id = "RIGHT";
            extras[left].style.animation = "todosaparecer 1s both";
            extras[center].style.animation = "todosaparecer 1s both";
            extras[right].style.animation = "todosaparecer 1s both";
            setTimeout(function cargandof(){
                click = 0;
            },1000)
        },1000)
    }
}

cole.addEventListener('click',barrainf,true);
regalos.addEventListener('click',regalosf,true);
coleccion.addEventListener('click',coleccionf,true);
premios.addEventListener('click',premiosf,true);
//config.addEventListener('click',configuracionf,true);
salirconfig.addEventListener('click',salirconfigf,true);
botonr.addEventListener('click',leftF,true);
botonl.addEventListener('click',rightF,true);
//prem.addEventListener('click',premF,true);
jug.addEventListener('click',jugF,true);
//log.addEventListener('click',logF,true);
 }

 function cargarjuegos(){
    fetch('JSON/minijuegos.json') 
    .then(response => response.json())
    .then(info => {
        const ubicacioncarpeta = "JSON/";
        const cintacoleccion = document.getElementById('cintacoleccion');
        cont = 0;
        info.forEach(minijuego => {
            
            const divminijuego = document.createElement('a');
            divminijuego.classList.add('muestra');
            divminijuego.id = "EXTRA";
            divminijuego.href = "./jug.html?id="+minijuego.url;
            divminijuego.style.backgroundImage = `url(${ubicacioncarpeta + minijuego.img})`;
            cintacoleccion.appendChild(divminijuego);
            cont++;
        });
    iniciar()


    })
    .catch(error => console.error('Error cargando el JSON:', error));
}
cargarjuegos();
