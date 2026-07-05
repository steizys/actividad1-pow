// ==========================================
// 1. CONSTANTES Y CONFIGURACIÓN
// ==========================================
const imagenesCartas = {
    2: 'cartas/carta1.png',
    4: 'cartas/carta2.png',
    8: 'cartas/carta3.png',
    16: 'cartas/carta4.png',
    32: 'cartas/carta5.png',
    64: 'cartas/carta6.png',
    128: 'cartas/carta7.png',
    256: 'cartas/carta8.png',
    512: 'cartas/carta9.png',
    1024: 'cartas/carta10.png',
    2048: 'cartas/carta11.png'
};

const valoresInicialesMazo = [2, 4, 8, 16, 32];
const MAX_CARTAS_POR_COLUMNA = 8;
const MAX_DESCARTES = 2;

// ==========================================
// 2. VARIABLES DE ESTADO DEL JUEGO
// ==========================================
let columnas = [[], [], [], []];
let puntuacionActual = 0;
let cartaActual = 0;
let siguienteCarta = 0; 
let juegoTerminado = false;
let descartesUsados = 0;

// ==========================================
// 3. ELEMENTOS DEL DOM
// ==========================================
const elementoPuntuacion = document.getElementById('puntuacion');
const elementoMazo = document.getElementById('mazo');
const elementosColumna = document.querySelectorAll('.columna');
const btnReiniciar = document.getElementById('btn-reiniciar');
const botonesDescarte = document.querySelectorAll('.btn-descarte');

// ==========================================
// 4. FUNCIONES PRINCIPALES
// ==========================================
function iniciarJuego() {
    columnas = [[], [], [], []];
    puntuacionActual = 0;
    juegoTerminado = false;
    cartaActual = 0; 
    siguienteCarta = 0;
    descartesUsados = 0;
    
    botonesDescarte.forEach(boton => {
        boton.src = 'cartas/cartaDescarte0.png';
        boton.style.pointerEvents = 'auto';
    });

    generarSiguienteCarta(); 
    actualizarInterfaz();
}

function generarSiguienteCarta() {
    if (cartaActual === 0) {
        const indiceAleatorio1 = Math.floor(Math.random() * valoresInicialesMazo.length);
        cartaActual = valoresInicialesMazo[indiceAleatorio1];
    } else {
        cartaActual = siguienteCarta;
    }
    
    const indiceAleatorio2 = Math.floor(Math.random() * valoresInicialesMazo.length);
    siguienteCarta = valoresInicialesMazo[indiceAleatorio2];
}

function crearImagenCarta(valor) {
    const imagen = document.createElement('img');
    imagen.src = imagenesCartas[valor];
    imagen.className = 'carta';
    imagen.alt = `Carta ${valor}`;
    return imagen;
}

function actualizarInterfaz() {
    elementoPuntuacion.textContent = puntuacionActual;
    //manejo del mazo
    elementoMazo.innerHTML = '';
    if (!juegoTerminado) {
        const imgSiguiente = crearImagenCarta(siguienteCarta); 
        imgSiguiente.classList.add('carta-futura'); 
        elementoMazo.appendChild(imgSiguiente);

        const imgActual = crearImagenCarta(cartaActual);
        imgActual.classList.add('carta-actual');
        elementoMazo.appendChild(imgActual);
    }
    //manejo de las cartas de las columnas
    elementosColumna.forEach((elementoColumna, indice) => {
        elementoColumna.innerHTML = '';
        const datosColumna = columnas[indice];
        //recorre los posibles valores de las cartas para hacer la imagen
        datosColumna.forEach((valor, i) => {
            const imagenCarta = crearImagenCarta(valor); //imagen corresp a la carta
            //maneja los estilos de la pos de las cartas
            imagenCarta.style.top = `${i * 50 + 5}px`; 
            imagenCarta.style.zIndex = i; 
            elementoColumna.appendChild(imagenCarta);
        });
    });
}

// ==========================================
// 5. LÓGICA DE FUSIÓN Y VERIFICACIÓN
// ==========================================
function verificarCondicionDerrota() {
    let todasLlenas = true;
    //verifica si todas las columnas están llenas
    for(let i = 0; i < 4; i++){
        if(columnas[i].length < MAX_CARTAS_POR_COLUMNA) {
            todasLlenas = false;
            break;
        }
    }
    
    if (todasLlenas) {
        juegoTerminado = true;
        alert(`¡Juego Terminado! Puntuación final: ${puntuacionActual}`);
    }
}

function fusionarRecursivo(indiceColumna) {
    const columnaActual = columnas[indiceColumna];
    if (columnaActual.length < 2) return; //valida que la columna este vacia o tenga solo una carta

    const cartaSuperior = columnaActual[columnaActual.length - 1]; //valor de la ult carta
    const segundaCartaSuperior = columnaActual[columnaActual.length - 2];//valor de la penul carta
    //si los valores son iguales, se combinan
    if (cartaSuperior === segundaCartaSuperior) {
        const nuevoValor = cartaSuperior * 2; //nuevo valor de la carta combinada
        puntuacionActual += nuevoValor; 
        //quita las dos cartas
        columnaActual.pop(); 
        columnaActual.pop(); 
        
        if (nuevoValor === 2048) { //revisa si es la carta max 
            columnas[indiceColumna] = []; //vacia la columna
            puntuacionActual += 2048; //bono de puntos
        } else {
            columnaActual.push(nuevoValor);//agrega la carta combinada
            fusionarRecursivo(indiceColumna);// se llama de nuevo para validar la anterior a la combinacion
        }
    }
}

// ==========================================
// 6. MANEJO DE EVENTOS
// ==========================================
function manejarClicColumna(evento) {
    if (juegoTerminado) return;
    
    const indiceColumna = parseInt(evento.currentTarget.getAttribute('data-columna')); //ve cual columna presiono
    
    if (columnas[indiceColumna].length >= MAX_CARTAS_POR_COLUMNA) { //valida que la columna no este llena
        return; 
    }

    columnas[indiceColumna].push(cartaActual);//agrega la carta actual a la columna seleccionada
    fusionarRecursivo(indiceColumna);//verifica si se puede fusionar

    generarSiguienteCarta(); //actualiza la carta actual y la siguiente
    actualizarInterfaz();
    
    setTimeout(verificarCondicionDerrota, 300); 
}

function manejarDescarte(evento) {
    //detiene el juego si termino o ya hay 2 cartas descartadas
    if (juegoTerminado || descartesUsados >= MAX_DESCARTES) return;

    const boton = evento.target;
    
    descartesUsados++;
    boton.src = 'cartas/cartaDescarte1.png';
    boton.style.pointerEvents = 'none';

    generarSiguienteCarta();
    actualizarInterfaz();
}

// Asignación de Event Listeners
elementosColumna.forEach(columna => columna.addEventListener('click', manejarClicColumna));
botonesDescarte.forEach(boton => boton.addEventListener('click', manejarDescarte));
btnReiniciar.addEventListener('click', iniciarJuego);

// Iniciar el juego al cargar
iniciarJuego();