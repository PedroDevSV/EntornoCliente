// This file contains the JavaScript logic for the tournament.

class Personaje {
    constructor(name, imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

const personajes = [
    new Personaje("Ryu", "images/"),
    new Personaje("Ken", "images/"),
    new Personaje("Chun-Li", "images/"),
    new Personaje("Guile", "images/"),
    new Personaje("Blanka", "images/"),
    new Personaje("Zangief", "images/"),
    new Personaje("E. Honda", "images/"),
    new Personaje("Dhalsim", "images/"),
    new Personaje("Cammy", "images/"),
    new Personaje("M. Bison", "images/"),
    new Personaje("Sagat", "images/"),
    new Personaje("Akuma", "images/"),
    new Personaje("Vega", "images/"),
    new Personaje("Balrog", "images/"),
    new Personaje("Fang", "images/"),
    new Personaje("Laura", "images/")
];
// donde mostramos personajes pequeños
const charactersDiv = document.getElementById("characters");
// Personajes de arriba
const mostrarMiniCharac = () => {
    charactersDiv.innerHTML = "";
    personajes.forEach(personaje => {
        const characterDiv = document.createElement("div");
        characterDiv.style.width = "80px";
        characterDiv.style.height = "80px";
        characterDiv.style.display = "inline-block";
        characterDiv.style.margin = "5px";
        characterDiv.innerHTML = `
            <img src="${personaje.imageUrl}${personaje.name}.png" alt="${personaje.name}" style="width: 100%; height: 100%;">
        `;
        charactersDiv.appendChild(characterDiv);
    });
};
mostrarMiniCharac();

// array de personajes por pelear
let personajesFaltantes = [...personajes];
const battleDiv = document.getElementById("battle");
const startBattleButton = document.getElementById("start-battle");

let timerInterval;
let elapsedTime = 0;


const actualizarTiempo = () => {
    elapsedTime++;
    document.getElementById("timer").textContent = `Tiempo: ${elapsedTime} segundos`;
};

// PAra borrar los que ya han aparecido, comprobamos que concida
const borrarPersonajeArriba = (personaje) => {
    const characterDivs = charactersDiv.querySelectorAll("div");
    characterDivs.forEach(div => {
        if (div.querySelector("img").alt === personaje.name) {
            charactersDiv.removeChild(div);
        }
    });
};


startBattleButton.addEventListener("click", () => {
    if (!timerInterval) {
        timerInterval = setInterval(actualizarTiempo, 1000);
    }

    // si quedan menos de 2, ha acabado la ronda
    if (personajesFaltantes.length < 2) {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = 0;
        // ocultamos boton de combatir, para obligar a reiniciar
        startBattleButton.style.display = "none";
        battleDiv.innerHTML = `<div class="col-12 bg-dark text-center pb-3 rounded"><h1 class="text-white">FIN DE LA PRIMERA RONDA</h1><button class="btn btn-warning col-3 d-grid" id="restart-battle">Reiniciar</button><img src="images/zangief-street.gif" width="400px"></div>`;
        // reiniciamos todos los elementos
        document.getElementById("restart-battle").addEventListener("click", () => {
            personajesFaltantes = [...personajes];
            battleDiv.innerHTML = "";
            startBattleButton.style.display = "block";
            document.getElementById("timer").textContent = "Tiempo: 0 segundos";
            mostrarMiniCharac();
        });
        return;
    }
    // elegir aleatorio los personajes de izq y derecha
    const randomIndex1 = Math.floor(Math.random() * personajesFaltantes.length);
    const personaje1 = personajesFaltantes.splice(randomIndex1, 1)[0];
    borrarPersonajeArriba(personaje1);

    const randomIndex2 = Math.floor(Math.random() * personajesFaltantes.length);
    const personaje2 = personajesFaltantes.splice(randomIndex2, 1)[0];
    borrarPersonajeArriba(personaje2);

    battleDiv.innerHTML = `
        <div class="col-4 offset-1 text-start">
            <h1>${personaje1.name}</h1>
            <img class="comb" src="${personaje1.imageUrl}${personaje1.name}.png" alt="${personaje1.name}">
        </div>
         <div class="col-4 ">
            <h1 class="text-start">${personaje2.name}</h1>
            <img class="comb" src="${personaje2.imageUrl}${personaje2.name}.png" alt="${personaje2.name}">
        </div>
    `;
});



