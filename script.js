// Inicialización
let columnas = [[], [], [], []];
let puntaje = 0;

// Ajuste en la generación: elige una llave aleatoria del mapa
function generarCarta() {
    const keys = Object.keys(mapaCartas);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return parseInt(keys[randomIndex]); // Retorna el valor numérico (2, 4, 8...)
}
let cartaActual = generarCarta();