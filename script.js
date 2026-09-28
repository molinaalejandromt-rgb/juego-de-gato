// ==========================================================
//  JUEGO DEL GATO - hecho con arreglos
// ==========================================================

// ----- ARREGLOS -----

// Tablero: 9 posiciones con "", "X" u "O"
//   0 | 1 | 2
//   3 | 4 | 5
//   6 | 7 | 8
let tablero = ["", "", "", "", "", "", "", "", ""];

// Las 8 formas de ganar (arreglo de arreglos)
const combinacionesGanadoras = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columnas
  [0, 4, 8], [2, 4, 6]               // diagonales
];

// Jugadores: el índice del turno indica a quién le toca
const jugadores = ["X", "O"];
let turno = 0;

// Nombres de las casillas para el historial
const nombresCasillas = [
  "arriba a la izquierda", "arriba al centro", "arriba a la derecha",
  "centro izquierda", "centro", "centro derecha",
  "abajo a la izquierda", "abajo al centro", "abajo a la derecha"
];

// Movimientos de la partida actual
let historial = [];

// Marcador: [victorias X, victorias O, empates]
let puntos = [0, 0, 0];

let juegoTerminado = false;

// ----- ELEMENTOS DEL HTML -----
const contenedorTablero = document.getElementById("tablero");
const textoEstado = document.getElementById("estado");
const listaJugadas = document.getElementById("lista-jugadas");
const tarjetas = [
  document.getElementById("tarjeta-x"),
  document.getElementById("tarjeta-o")
];
const casillas = []; // los 9 botones del tablero

// ----- CREAR TABLERO -----
for (let i = 0; i < 9; i++) {
  const casilla = document.createElement("button");
  casilla.className = "casilla";
  casilla.setAttribute("aria-label", "Casilla " + nombresCasillas[i]);
  casilla.addEventListener("click", () => marcar(i));
  contenedorTablero.appendChild(casilla);
  casillas.push(casilla);
}

// ----- JUGADA -----
function marcar(posicion) {
  if (juegoTerminado || tablero[posicion] !== "") return;

  const jugador = jugadores[turno];

  // 1. Guardar en los arreglos
  tablero[posicion] = jugador;
  historial.push(jugador + " juega " + nombresCasillas[posicion]);

  // 2. Mostrar en pantalla
  casillas[posicion].textContent = jugador;
  casillas[posicion].classList.add(jugador.toLowerCase());
  casillas[posicion].disabled = true;
  mostrarHistorial();

  // 3. Revisar el resultado
  const ganadora = revisarGanador();

  if (ganadora !== null) {
    terminar("Gana " + jugador, turno);
    ganadora.forEach(i => casillas[i].classList.add("ganadora"));
  } else if (tablero.every(valor => valor !== "")) {
    terminar("Tablas: nadie gana", 2);
  } else {
    turno = turno === 0 ? 1 : 0;
    textoEstado.textContent = "Mueve " + jugadores[turno];
    marcarTurno();
  }
}

// Recorre las combinaciones y devuelve la ganadora (o null)
function revisarGanador() {
  for (let i = 0; i < combinacionesGanadoras.length; i++) {
    const [a, b, c] = combinacionesGanadoras[i];
    if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
      return combinacionesGanadoras[i];
    }
  }
  return null;
}

// indicePunto: 0 = X, 1 = O, 2 = empate
function terminar(mensaje, indicePunto) {
  juegoTerminado = true;
  textoEstado.textContent = mensaje;
  puntos[indicePunto]++;
  casillas.forEach(c => c.disabled = true);
  tarjetas.forEach(t => t.classList.remove("activo"));
  mostrarPuntos();
}

// ----- PANTALLA -----
function mostrarPuntos() {
  document.getElementById("puntos-x").textContent = puntos[0];
  document.getElementById("puntos-o").textContent = puntos[1];
  document.getElementById("puntos-empate").textContent = puntos[2];
}

function mostrarHistorial() {
  listaJugadas.innerHTML = "";
  historial.forEach(movimiento => {
    const item = document.createElement("li");
    item.textContent = movimiento;
    listaJugadas.appendChild(item);
  });
}

function marcarTurno() {
  tarjetas.forEach((tarjeta, i) => {
    tarjeta.classList.toggle("activo", i === turno);
  });
}

// ----- BOTONES -----
function nuevaPartida() {
  tablero = ["", "", "", "", "", "", "", "", ""];
  historial = [];
  turno = 0;
  juegoTerminado = false;

  casillas.forEach(c => {
    c.textContent = "";
    c.className = "casilla";
    c.disabled = false;
  });

  textoEstado.textContent = "Abre la partida X";
  mostrarHistorial();
  marcarTurno();
}

function reiniciarPuntos() {
  puntos = [0, 0, 0];
  mostrarPuntos();
  nuevaPartida();
}

document.getElementById("btn-nueva").addEventListener("click", nuevaPartida);
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarPuntos);

// Al cargar la página
marcarTurno();
