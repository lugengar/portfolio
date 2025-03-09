function getGradientColors(gradientString) {
    // Definir una expresión regular para extraer los colores
    const gradientRegex = /rgba?\([\d\s,]+\)|#[a-fA-F\d]{3,6}|[a-zA-Z]+/g;
    const gradientColors = gradientString.match(gradientRegex);
    // Buscar coincidencias de colores en la cadena del gradiente

    // Retornar los primeros dos colores encontrados
    return gradientColors.slice(3, 5); // Ignora el primer valor que es el ángulo y toma los siguientes dos colores
}
function actualizargradiente(pos, lista){
    document.getElementById("fondo").style.background = "radial-gradient(circle, "+lista[pos][0]+" , "+lista[pos][1]+", black) 0% 0% / 200% 200% no-repeat"
}

