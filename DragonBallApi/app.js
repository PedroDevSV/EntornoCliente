const API_BASE_URL = "https://dragonball-api.com/api"

async function getPersonajes() {
    try {
        const response = await fetch('https://dragonball-api.com/api/characters?limit=60');

        if (!response.ok) {
            throw new Error('Error al obtener los personajes');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}



function crearCard(personaje){
    return `<div class='card-personaje'>
    <img src="${personaje.image}">
    <div class="ki-container"> 
        <span class="ki-label">KI</span>
        <span class="ki-value">${personaje.ki}</span>
    </div>
        <h2>${personaje.name}</h2>
    </div>`
}

async function iniciarApp(){
    const gridPersonajes= document.getElementById('grid-personajes');
    try {

        const data = await getPersonajes();
        let personajesHTML = data.items.map(personaje => crearCard(personaje)).join('');;
        console.log(data);
        gridPersonajes.innerHTML=personajesHTML;

    } catch (error) {
        console.log("puta")
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp());