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
    let personajes=[];

    try {
        const data = await getPersonajes();
        personajes=data.items;
        renderizarPersonajes(personajes);

        buscador.addEventListener('input',()=>{
            const busqueda=buscador.value.toLowerCase();
            const personajesFiltrados=personajes.filter(personaje => 
                personaje.name.toLowerCase().includes(busqueda)
            );
            renderizarPersonajes(personajesFiltrados);
        })

    } catch (error) {
        console.log("puta")
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp());
