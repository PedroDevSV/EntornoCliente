class JuegoPokemon {
    constructor() {
        this.tablero = Array(16).fill(null);
        this.posicionesPokemon = new Set();
        this.celdasReveladas = new Set();
        this.puntuaciones = {
            jugador: 0,
            cpu: 0
        };
        this.movimientos = {
            jugador: 0,
            cpu: 0
        };
        this.turnoActual = 'jugador';
        this.juegoTerminado = false;
        this.tiposPokemon = ['pikachu', 'squirtle', 'charmander'];

        // elementos del DOM
        this.tablero = document.getElementById('game-board');
        this.botonReiniciar = document.getElementById('reset-btn');
        this.puntosJugador = document.getElementById('player-points');
        this.puntosCPU = document.getElementById('cpu-points');
        this.movimientosJugador = document.getElementById('player-moves');
        this.movimientosCPU = document.getElementById('cpu-moves');
        this.turnoJugador = document.getElementById('turn-player');
        this.turnoCPU = document.getElementById('turn-cpu');
        this.modal = document.getElementById('game-end-modal');
        this.panelHistorial = document.getElementById('history-panel');
        this.Historial = document.getElementById('game-history');

        // Cargar el histórico al inicio
        this.historialJuego = this.cargarHistorialJuego();
        
        this.inicializarJuego();
        this.configurarEventListeners();
        this.actualizarDisplayHistorial();
    }

    cargarHistorialJuego() {
        const historialGuardado = localStorage.getItem('pokemonGameHistory');
        if (!historialGuardado) return [];
        
        try {
            const historial = JSON.parse(historialGuardado);
            return Array.isArray(historial) ? historial : [];
        } catch {
            return [];
        }
    }

    // guardar el historial en el cache del navegador
    guardarHistorialJuego() {
        try {
            localStorage.setItem('pokemonGameHistory', JSON.stringify(this.historialJuego));
            return true;
        } catch {
            return false;
        }
    }

    actualizarDisplayHistorial() {
        if (!this.Historial) return;
        
        this.Historial.innerHTML = '';
        
        if (this.historialJuego.length === 0) {
            const mensajeVacio = document.createElement('div');
            mensajeVacio.className = 'history-entry';
            mensajeVacio.innerHTML = '<span>No hay partidas registradas</span>';
            this.Historial.appendChild(mensajeVacio);
            return;
        }

        // Ordenar por número de movimientos (menor a mayor)
        const historialOrdenado = [...this.historialJuego].sort((a, b) => a.movimientos - b.movimientos);

        historialOrdenado.forEach((entrada, indice) => {
            const entradaHistorial = document.createElement('div');
            entradaHistorial.className = 'history-entry';
            // iconos 
            const medalla = indice < 3 ? ['🥇', '🥈', '🥉'][indice] : '🎮';
            const fecha = new Date(entrada.fecha).toLocaleDateString();
            
            entradaHistorial.innerHTML = `
                <div class="history-entry-content">
                    <span class="history-medal">${medalla}</span>
                    <span class="history-name">${entrada.nombre}</span>
                </div>
                <div class="history-entry-stats">
                    <span class="history-moves">${entrada.movimientos} tiradas</span>
                    <span class="history-date">${fecha}</span>
                </div>
            `;
            
            this.Historial.appendChild(entradaHistorial);
        });
    }

    inicializarJuego() {
        // vaciamos array premiados
        this.posicionesPokemon.clear();
        while (this.posicionesPokemon.size < 5) {
            // posiciones con pokemon
            const posicion = Math.floor(Math.random() * 16);
            this.posicionesPokemon.add(posicion);
        }
        // vaciamos tablero
        this.tablero.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const celda = document.createElement('div');
            celda.className = 'cell';
            celda.dataset.index = i;
            // añadimos celdas a tablero
            this.tablero.appendChild(celda);
        }

        this.actualizarUI();
        this.actualizarIndicadorTurno();
    }

    configurarEventListeners() {
        this.tablero.addEventListener('click', (e) => {
            // al tablero se le puede clickar si es turno de jugador y no ha terminado juego
            if (this.turnoActual === 'jugador' && !this.juegoTerminado) {
                // Obtiene el elemento más cercano con la clase 'cell' que contiene al elemento que clickas (e.target).
                const celda = e.target.closest('.cell');
                //Verifica si el índice de la celda (convertido a entero) no está en el conjunto celdasReveladas. Esto asegura que la celda no ha sido revelada previamente.
                if (celda && !this.celdasReveladas.has(parseInt(celda.dataset.index))) {
                    //Si ambas condiciones son verdaderas, se llama a manejarMovimientoJugador pasando el índice de la celda como argumento.
                    this.manejarMovimientoJugador(parseInt(celda.dataset.index));
                }
            }
        });

        this.botonReiniciar.addEventListener('click', () => this.reiniciarJuego());

        // Event listeners para el historial
        const botonToggleHistorial = document.getElementById('toggle-history');
        const botonCerrarHistorial = document.getElementById('close-history');
       
        // para abrir ventana
        if (botonToggleHistorial) {
            botonToggleHistorial.addEventListener('click', (e) => {
                e.stopPropagation();
                this.panelHistorial.classList.add('active');
            });
        }

        if (botonCerrarHistorial) {
            botonCerrarHistorial.addEventListener('click', () => {
                this.panelHistorial.classList.remove('active');
            });
        }

        // Cerrar historial al hacer click fuera
        document.addEventListener('click', (e) => {
            if (this.panelHistorial.classList.contains('active') && 
                !this.panelHistorial.contains(e.target) && 
                !e.target.closest('#toggle-history')) {
                this.panelHistorial.classList.remove('active');
            }
        });

        // Event listeners para el modal de fin de juego
        const botonGuardarPuntuacion = document.getElementById('save-score');
        const botonJugarDeNuevo = document.getElementById('play-again');
        const inputNombre = document.getElementById('winner-name');

        if (botonGuardarPuntuacion && inputNombre) {
            botonGuardarPuntuacion.addEventListener('click', () => {
                const nombre = inputNombre.value.trim();
                if (!nombre) {
                    this.mostrarMensaje('Por favor, introduce tu nombre');
                    return;
                }

                const nuevaEntrada = {
                    nombre: nombre,
                    movimientos: this.movimientos.jugador,
                    fecha: new Date().toISOString()
                };

                this.historialJuego.push(nuevaEntrada);
                if (this.guardarHistorialJuego()) {
                    this.mostrarMensaje('¡Puntuación guardada!');
                    this.actualizarDisplayHistorial();
                    this.cerrarModal();
                    this.reiniciarJuego();
                } else {
                    this.mostrarMensaje('Error al guardar la puntuación');
                }
            });
        }

        if (botonJugarDeNuevo) {
            botonJugarDeNuevo.addEventListener('click', () => {
                this.cerrarModal();
                this.reiniciarJuego();
            });
        }

        // Cerrar modal al hacer click fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });
    }

    // resalta para saber turno 
    actualizarIndicadorTurno() {
        this.turnoJugador.classList.toggle('active', this.turnoActual === 'jugador');
        this.turnoCPU.classList.toggle('active', this.turnoActual === 'cpu');

        // Actualizar el resaltado de las cards
        const cardJugador = document.querySelector('.player-score');
        const cardCPU = document.querySelector('.cpu-score');
        
        cardJugador.classList.toggle('active', this.turnoActual === 'jugador');
        cardCPU.classList.toggle('active', this.turnoActual === 'cpu');
    }

    // se necesita el indice de la celda para saber cuantas hay disponibles 
    manejarMovimientoJugador(indice) {
        if (this.turnoActual !== 'jugador' || this.juegoTerminado || this.celdasReveladas.has(indice)) {
            //depurador para fallos
            return;
        }

        this.movimientos.jugador++;
        this.celdasReveladas.add(indice);
        
        const pokemonEncontrado = this.posicionesPokemon.has(indice);
        this.actualizarUI();
        
        if (pokemonEncontrado) {
            this.puntuaciones.jugador++;
            this.actualizarIndicadoresPokemon('jugador', this.puntuaciones.jugador);
            
            if (this.verificarCondicionVictoria()) {
                return;
            }
        } else {
            if (!this.juegoTerminado) {
                this.mostrarModalTurnoExtra();
            }
        }
    }

    // los 3 puntos que indican el marcador
    actualizarIndicadoresPokemon(jugador, puntuacion) {
        for (let i = 1; i <= 3; i++) {
            const indicador = document.getElementById(`${jugador}-pokemon-${i}`);
            if (indicador) {
                if (i <= puntuacion) {
                    indicador.classList.add('found');
                    // Añadir animación de aparición
                    indicador.animate([
                        { transform: 'scale(0)', opacity: 0 },
                        { transform: 'scale(1.2)', opacity: 1 },
                        { transform: 'scale(1)', opacity: 1 }
                    ], {
                        duration: 500,
                        easing: 'ease-out'
                    });
                }
            }
        }
    }
    // turno de pc 
    async manejarMovimientoCPU() {
        if (this.turnoActual !== 'cpu' || this.juegoTerminado) {
            return;
        }

        // Asegurarse de que solo hay una CPU jugando (daba error)
        if (this._cpuMoviendo) {
            return;
        }
        this._cpuMoviendo = true;

        try {
            // esperar 1 segundo , se utilizan Promises para esperar un segundo antes de que la CPU realice su movimiento.
            //  Esto se hace con await new Promise, que pausa la ejecución de la función asincrónica durante un segundo.
            await new Promise(resolve => setTimeout(resolve, 1000));

            const movimientosDisponibles = Array.from({length: 16}, (_, i) => i)
                .filter(i => !this.celdasReveladas.has(i));

            if (movimientosDisponibles.length === 0) {
                this._cpuMoviendo = false;
                return;
            }
            // para seleccionar aleatoriamente un movimiento disponible para la CPU
            const indiceMovimiento = Math.floor(Math.random() * movimientosDisponibles.length);
            const movimientoSeleccionado = movimientosDisponibles[indiceMovimiento];

            this.movimientos.cpu++;
            this.celdasReveladas.add(movimientoSeleccionado);

            const pokemonEncontrado = this.posicionesPokemon.has(movimientoSeleccionado);
            this.actualizarUI();

            if (pokemonEncontrado) {
                this.puntuaciones.cpu++;
                this.actualizarIndicadoresPokemon('cpu', this.puntuaciones.cpu);
                
                if (this.verificarCondicionVictoria()) {
                    this._cpuMoviendo = false;
                    return;
                }

                // Si encontró un Pokémon, espera y juega de nuevo
                await new Promise(resolve => setTimeout(resolve, 1000));
                this._cpuMoviendo = false;
                this.manejarMovimientoCPU();
            } else {
                this._cpuMoviendo = false;
                this.cambiarTurno();
            }
        } catch (error) {
            console.error('Error en el turno de la CPU:', error);
            this._cpuMoviendo = false;
            this.cambiarTurno();
        }
    }

    // Logica para el dado 
    intentarTurnoExtra() {
        const tiradaDado = Math.floor(Math.random() * 6) + 1;
        this.botonTurnoExtra.disabled = true;
        this.botonTurnoExtra.querySelector('.button-icon').textContent = tiradaDado;

        setTimeout(() => {
            this.botonTurnoExtra.querySelector('.button-icon').textContent = '🎲';
            
            if (tiradaDado === 6) {
                this.mostrarMensaje('¡Has sacado un 6! Tienes un turno extra. 🎉');
            } else {
                this.mostrarMensaje(`Has sacado un ${tiradaDado}. No hay turno extra. 😔`);
                this.cambiarTurno();
            }
        }, 1000);
    }
    // generar el modal
    mostrarModalTurnoExtra() {
        const modalTurnoExtra = document.getElementById('extra-turn-modal');
        const Dado = document.getElementById('dice');
        const botonLanzar = document.getElementById('roll-dice');
        const botonPasar = document.getElementById('skip-turn');

        // Resetear el dado y botones
        Dado.textContent = '🎲';
        Dado.className = 'dice';
        botonLanzar.disabled = false;
        botonPasar.disabled = false;

        // Mostrar el modal
        modalTurnoExtra.classList.add('active');

        // Manejar el click en el botón de lanzar
        const manejarClickLanzar = () => {
            if (botonLanzar.disabled) return;
            
            botonLanzar.disabled = true;
            botonPasar.disabled = true;
            Dado.classList.add('rolling');
            
            const numeroFinal = Math.floor(Math.random() * 6) + 1;
            const tiempoInicio = Date.now();
            const duracionAnimacion = 2000;
            let numeroActual = parseInt(Dado.textContent) || 1;

            // generar numero
            const actualizarDado = () => {
                const tiempoTranscurrido = Date.now() - tiempoInicio;
                
                if (tiempoTranscurrido < duracionAnimacion) {
                    let nuevoNumero;
                    do {
                        nuevoNumero = Math.floor(Math.random() * 6) + 1;
                    } while (nuevoNumero === numeroActual);
                    
                    numeroActual = nuevoNumero;
                    Dado.textContent = numeroActual;

                    const progreso = tiempoTranscurrido / duracionAnimacion;
                    const retraso = 50 + (progreso * 200);

                    requestAnimationFrame(() => setTimeout(actualizarDado, retraso));
                } else {
                    Dado.textContent = numeroFinal;
                    Dado.classList.remove('rolling');

                    if (numeroFinal === 6) {
                        Dado.classList.add('success');
                        this.mostrarMensaje('¡Has sacado un 6! 🎉 Tienes un turno extra.');
                        
                        setTimeout(() => {
                            modalTurnoExtra.classList.remove('active');
                            // El jugador mantiene su turno al sacar un 6
                        }, 1500);
                    } else {
                        Dado.classList.add('fail');
                        this.mostrarMensaje(`Has sacado un ${numeroFinal}. Se acabó tu turno.`);
                        
                        setTimeout(() => {
                            modalTurnoExtra.classList.remove('active');
                            this.turnoActual = 'cpu';
                            this.actualizarIndicadorTurno();
                            this.manejarMovimientoCPU();
                        }, 1500);
                    }

                    // Limpiar eventos
                    botonLanzar.removeEventListener('click', manejarClickLanzar);
                    botonPasar.removeEventListener('click', manejarClickPasar);
                }
            };

            actualizarDado();
        };

        // Manejar el click en el botón de pasar
        const manejarClickPasar = () => {
            if (botonPasar.disabled) return;
            
            modalTurnoExtra.classList.remove('active');
            this.mostrarMensaje('Has pasado tu turno.');
            
            // Limpiar eventos
            botonLanzar.removeEventListener('click', manejarClickLanzar);
            botonPasar.removeEventListener('click', manejarClickPasar);
            
            this.turnoActual = 'cpu';
            this.actualizarIndicadorTurno();
            this.manejarMovimientoCPU();
        };

        // Añadir event listeners
        botonLanzar.addEventListener('click', manejarClickLanzar.bind(this));
        botonPasar.addEventListener('click', manejarClickPasar.bind(this));
    }
    // mensaje cuando pierdes
    mostrarMensaje(mensaje) {
        const divMensaje = document.createElement('div');
        divMensaje.className = 'game-message';
        divMensaje.textContent = mensaje;
        divMensaje.style.position = 'fixed';
        divMensaje.style.top = '20px';
        divMensaje.style.left = '50%';
        divMensaje.style.transform = 'translateX(-50%)';
        divMensaje.style.background = 'white';
        divMensaje.style.padding = '1rem 2rem';
        divMensaje.style.borderRadius = '10px';
        divMensaje.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        divMensaje.style.zIndex = '1000';

        document.body.appendChild(divMensaje);
        setTimeout(() => divMensaje.remove(), 2000);
    }

    cambiarTurno() {
        // Si el juego ha terminado, no hacer nada
        if (this.juegoTerminado) return;

        // Cambiar el turno actual entre 'jugador' y 'cpu'
        this.turnoActual = this.turnoActual === 'jugador' ? 'cpu' : 'jugador';

        // Actualizar el indicador visual del turno
        this.actualizarIndicadorTurno();

        // Si es el turno de la CPU, esperar 1 segundo y luego manejar el movimiento de la CPU
        if (this.turnoActual === 'cpu') {
            setTimeout(() => {
                this.manejarMovimientoCPU();
            }, 1000);
        }
    }

    actualizarUI() {
        this.puntosJugador.textContent = this.puntuaciones.jugador;
        this.puntosCPU.textContent = this.puntuaciones.cpu;
        this.movimientosJugador.textContent = this.movimientos.jugador;
        this.movimientosCPU.textContent = this.movimientos.cpu;

        const celdas = this.tablero.getElementsByClassName('cell');
        for (let i = 0; i < celdas.length; i++) {
            if (this.celdasReveladas.has(i)) {
                celdas[i].classList.add('revealed');
                if (this.posicionesPokemon.has(i)) {
                    celdas[i].classList.add('pokemon');
                    const indicePokemon = Array.from(this.posicionesPokemon).indexOf(i);
                    celdas[i].classList.add(this.tiposPokemon[indicePokemon % this.tiposPokemon.length]);
                }
            }
        }
    }

    mostrarModal(ganador) {
        const tituloModal = document.getElementById('modal-title');
        const infoGanador = document.getElementById('winner-info');
        const estadisticasJuego = document.getElementById('game-stats');
        const inputNombre = document.getElementById('winner-name');
        const contenedorNombre = document.getElementById('name-input-container');
        const botonGuardarPuntuacion = document.getElementById('save-score');
        const botonJugarDeNuevo = document.getElementById('play-again');

        if (ganador === 'jugador') {
            tituloModal.textContent = '¡Felicidades! 🎉';
            infoGanador.textContent = '¡Has ganado la partida!';
            contenedorNombre.style.display = 'block';
            inputNombre.value = '';
            inputNombre.focus();
            // Mostrar solo el botón de guardar
            botonGuardarPuntuacion.style.display = 'block';
            botonJugarDeNuevo.style.display = 'none';
        } else {
            tituloModal.textContent = 'Fin del juego 😔';
            infoGanador.textContent = 'La CPU ha ganado esta vez.';
            contenedorNombre.style.display = 'none';
            // Mostrar solo el botón de jugar de nuevo
            botonGuardarPuntuacion.style.display = 'none';
            botonJugarDeNuevo.style.display = 'block';
            
            // Guardar puntuación de la CPU
            const entradaCPU = {
                nombre: 'CPU',
                movimientos: this.movimientos.cpu,
                fecha: new Date().toISOString()
            };
            this.historialJuego.push(entradaCPU);
            this.guardarHistorialJuego();
            this.actualizarDisplayHistorial();
        }

        estadisticasJuego.innerHTML = `
            <p>Tiradas del Jugador: ${this.movimientos.jugador}</p>
            <p>Tiradas de la CPU: ${this.movimientos.cpu}</p>
        `;

        this.modal.classList.add('active');
    }

    cerrarModal() {
        this.modal.classList.remove('active');
        if (this.juegoTerminado) {
            this.reiniciarJuego();
        }
    }

    verificarCondicionVictoria() {
        if (this.puntuaciones.jugador >= 3 || this.puntuaciones.cpu >= 3) {
            this.juegoTerminado = true;
            const ganador = this.puntuaciones.jugador >= 3 ? 'jugador' : 'cpu';
            
            // Revelar todas las casillas restantes
            for (let i = 0; i < 16; i++) {
                if (!this.celdasReveladas.has(i)) {
                    this.celdasReveladas.add(i);
                }
            }
            this.actualizarUI();
            this.mostrarModal(ganador);
            return true;
        }
        return false;
    }

    reiniciarJuego() {
        this.tablero = Array(16).fill(null);
        this.posicionesPokemon.clear();
        this.celdasReveladas.clear();
        this.puntuaciones = { jugador: 0, cpu: 0 };
        this.movimientos = { jugador: 0, cpu: 0 };
        this.turnoActual = 'jugador';
        this.juegoTerminado = false;
        
        // Reset Pokemon indicators
        for (let i = 1; i <= 3; i++) {
            const indicadorJugador = document.getElementById(`player-pokemon-${i}`);
            const indicadorCPU = document.getElementById(`cpu-pokemon-${i}`);
            if (indicadorJugador) indicadorJugador.classList.remove('found');
            if (indicadorCPU) indicadorCPU.classList.remove('found');
        }
        
        this.inicializarJuego();
    }
}

// Start the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new JuegoPokemon();
});