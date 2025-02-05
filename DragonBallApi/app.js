const API_BASE_URL = "https://dragonball-api.com/api"
const gridPersonajes = document.getElementById('grid-personajes');

async function getPersonajes() {
    try {
        const response = await fetch(`${ API_BASE_URL }/characters?limit=60`);
        if (!response.ok) throw new Error('Error al obtener los personajes');
        const data = await response.json();

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



function crearCard(personaje) {

    const tieneTransformaciones = personaje.transformations && personaje.transformations.length > 0;
    const primeraTransformacion = tieneTransformaciones ? personaje.transformations[0].image : '';
    // si tiene transform, genera la imagen y otra clase distinta
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


function renderizarPersonajes(personajes){
    let personajesHTML = personajes.map(personaje => crearCard(personaje)).join('');;
    gridPersonajes.innerHTML = personajesHTML;

}

async function iniciarApp(){
  
    const buscador=document.querySelector('.buscador');
    const todos=document.getElementById('todos');
    const filtroHumans=document.getElementById('humanos');
    const filtroSaiyans = document.getElementById('saiyans');
    const filtroNamekians = document.getElementById('namekian');
    const filtroMajin = document.getElementById('majin');
    const filtroDioses = document.getElementById('dioses');

    
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

        // Boton para mostrar todos 
        todos.addEventListener('click',()=>{
            personajes = data.items;
            renderizarPersonajes(personajes);
        });


        // por filtros
        filtroSaiyans.addEventListener('click', () => {
            const personajesFiltradosSaiyan = personajes.filter(personaje => personaje.race === 'Saiyan');
            
            renderizarPersonajes(personajesFiltradosSaiyan);
        });

        filtroNamekians.addEventListener('click', () => {
            const personajesFiltradosNamek = personajes.filter(personaje => personaje.race === 'Namekian');
         
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

    } catch (error) {
        console.log("error en carga")
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp());
