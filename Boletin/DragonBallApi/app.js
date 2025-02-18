const API_BASE_URL = "https://dragonball-api.com/api"
const gridPersonajes = document.getElementById('grid-personajes');

// Función para obtener los personajes desde la API
async function getPersonajes() {
    try {
        const response = await fetch(`${ API_BASE_URL }/characters?limit=60`);
        if (!response.ok) throw new Error('Error al obtener los personajes');
        const data = await response.json();

        // Obtener detalles adicionales de cada personaje, guardamos informacion
        const personajesConDetalles = await Promise.all(
            data.items.map(async (personaje) => {
                const detallesResponse = await fetch(`${ API_BASE_URL }/characters/${ personaje.id}`);
                if (!detallesResponse.ok) return personaje;
                return await detallesResponse.json();
            })
        );

        return { ...data, items: personajesConDetalles };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para crear una tarjeta de personaje
function crearCard(personaje) {
    const tieneTransformaciones = personaje.transformations && personaje.transformations.length > 0;
    const primeraTransformacion = tieneTransformaciones ? personaje.transformations[0].image : '';
    // Si tiene transformaciones, genera la imagen y otra clase distinta
    return `<div class='card-personaje ${tieneTransformaciones ? 'con-transform' : '' }'>
                <div class='card-image'>
                    <img src="${personaje.image}" class='img-normal'>
                    ${tieneTransformaciones ? `<img src="${primeraTransformacion}" class='img-transform'>` : ''}
                </div>
                <div class="ki-container"> 
                    <span class="ki-label">KI</span>
                    <span class="ki-value">${personaje.ki}</span>
                </div>
                    <h2>${personaje.name}</h2>
            </div>`;
}

// Función para renderizar los personajes en el DOM
function renderizarPersonajes(personajes){
    // creamos card de personajes en html
    let personajesHTML = personajes.map(personaje => crearCard(personaje)).join('');
    gridPersonajes.innerHTML = personajesHTML;
}

// Función principal para iniciar la aplicación
async function iniciarApp(){
    const buscador=document.querySelector('.buscador');
    const todos=document.getElementById('todos');
    const filtroHumans=document.getElementById('humanos');
    const filtroSaiyans = document.getElementById('saiyans');
    const filtroFriezer = document.getElementById('friezer');
    const filtroMajin = document.getElementById('majin');
    const filtroDioses = document.getElementById('dioses');
    const sorpresa=document.getElementById('sorpresa');

    let personajes=[];

    try {
        const data = await getPersonajes();
        personajes=data.items;
        renderizarPersonajes(personajes);

        // Listener para el input buscador, filtra por el nombre que introduzcamos o letras que incluya
        buscador.addEventListener('input',()=>{
            const busqueda=buscador.value.toLowerCase();
            const personajesFiltrados=personajes.filter(personaje => 
                personaje.name.toLowerCase().includes(busqueda)
            );
            console.log({ personajesFiltrados })
            renderizarPersonajes(personajesFiltrados);
        })

        // Botón para mostrar todos 
        todos.addEventListener('click',()=>{
            personajes = data.items;
            renderizarPersonajes(personajes);
        });

        // Filtros por raza

        filtroSaiyans.addEventListener('click', () => {
            const personajesFiltradosSaiyan = personajes.filter(personaje => personaje.race === 'Saiyan');
            renderizarPersonajes(personajesFiltradosSaiyan);
        });

        filtroFriezer.addEventListener('click', () => {
            const personajesFiltradosNamek = personajes.filter(personaje => personaje.race === 'Frieza Race');
            renderizarPersonajes(personajesFiltradosNamek);
        });

        filtroMajin.addEventListener('click', () => {
            const personajesFiltradosMajin = personajes.filter(personaje => personaje.race === 'Majin');
            renderizarPersonajes(personajesFiltradosMajin);
        });

        filtroDioses.addEventListener('click', () => {
            const personajesFiltradosGod = personajes.filter(personaje => personaje.race === 'God');
            renderizarPersonajes(personajesFiltradosGod);
        });

        filtroHumans.addEventListener('click', () => {
            const personajesFiltradosHuman = personajes.filter(personaje => personaje.race === 'Human');
            renderizarPersonajes(personajesFiltradosHuman);
        });

        // añadir evento sorpresa
        sorpresa.addEventListener('click',()=>{
            mostrarModalSorpresa();
        });
    } catch (error) {
        console.log("error en carga")
    }
}

// Función para reproducir audio
function reproducirAudio(ruta) {
    // comprueba si hay audio reproduciendo
    if (window.currentAudio) {
        window.currentAudio.pause();
    }
    window.currentAudio = new Audio(ruta);
    window.currentAudio.play();
}

// Función para mostrar el modal de bienvenida
function mostrarModalBienvenida() {
    const modal = document.createElement('div');
    modal.classList.add('modal-bienvenida');
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <img src="assets/giphy.gif" alt="Bienvenida">
            <br>
            <img src="assets/Bienvenidos.png" width="280px" alt="Bienvenida">
            <p>¡Bienvenido a la Dragon Ball API!</p>
            <p>Estás a punto de conocer a los mejores personajes</p>
            <button class="botones" id="cerrar-modal">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);

    const cerrarModalBtn = document.getElementById('cerrar-modal');
    cerrarModalBtn.addEventListener('click', () => {
        reproducirAudio('assets/principal.mp3');
        modal.style.display = 'none';
    });
}


// Función para mostrar el modal de sorpresa

function mostrarModalSorpresa() {
    const modal2 = document.createElement('div');
    window.currentAudio.pause();
    modal2.classList.add('modal-bienvenida');
    modal2.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
           
        <br>
        <video src="assets/bachata.mp4" autoplay loop></video>
         <br>
        <button class="botones" id="cerrar-modal2">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal2);

    const cerrarModal2Btn = document.getElementById('cerrar-modal2');
    cerrarModal2Btn.addEventListener('click', () => {
        const video = modal2.querySelector('video');
        video.pause();
        modal2.style.display = 'none';
        cerrarModal2Btn.remove();
    });
}

// Evento que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    mostrarModalBienvenida();
    iniciarApp();
    iniciarCambiarFondo();
});


// Iniciar Cambiador de fondo
function iniciarCambiarFondo(){
    const bgButton=document.querySelector('.bg-button');
    const bgMenu=document.querySelector('.bg-menu');
    const bgOptions = document.querySelectorAll('.bg-option');

    bgButton.addEventListener('click',()=>{
        // añades clase toggle (añade y quita clase) depende si esta activa o no
        bgMenu.classList.toggle('active');
        bgOptions.classList.toggle('active');        
    });

    // tres elementos, recorremos para seleccionar
    bgOptions.forEach(option  =>  {
        // recorres todos los options y añades click
        option.addEventListener('click',()=>{
            //Le quitas a todos la clase active
            bgOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            // se la pones al que has clickado
            option.classList.add('active');
            // cogemos variable del html (evariable data)
            let fondo = option.dataset.background;
            document.body.style.backgroundImage=`url('assets/bg/${fondo}')`;
            // reproduces fondo
            if (fondo === 'fondo2.jpg') {
                reproducirAudio('assets/malos.mp3');
            } else if (fondo === 'fondo1.jpg') {
                reproducirAudio('assets/prologuecut.mp3');
            }else{
                reproducirAudio('assets/principal.mp3');
            }
        });

    });


}

