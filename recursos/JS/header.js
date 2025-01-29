let bar =false

window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    var nosotros = document.getElementById('nosotros');
    var scrollPosition = window.scrollY || window.pageYOffset;


    if (scrollPosition >= 100) {
        header.classList.add('hidden');
        header.classList.remove('visible');
    } else {
     
        header.classList.add('visible');
        header.classList.remove('hidden');
    }
    if (scrollPosition >= 500) {
        nosotros.style.opacity = "100%";
        nosotros.style.pointerEvents= "all";
        nosotros.style.cursor= "pointer";
    } else {
        nosotros.style.opacity = "0%";
        nosotros.stylepointerEvents= "none";
        nosotros.style.cursor= "default";
    }
});

function sidebar(){
    bar = !bar
    var sidebar = document.getElementById('sidebar');

    if(bar){
        sidebar.style.transform = "translateX(0%)"
    }else{
        sidebar.style.transform = "translateX(110%)"
    }
}

function redirigir(href){
    var sidebar = document.getElementById('sidebar');
    document.querySelector("#"+href).scrollIntoView({ behavior: 'smooth' });
    if(bar == true){
        bar = !bar
        sidebar.style.transform = "translateX(110%)"
    }
}


