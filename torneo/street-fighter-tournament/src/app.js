// This file contains the JavaScript logic for the tournament.

class Personaje {
    constructor(name, imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

const personajes = [
    new Personaje("Ryu", "https://www.pngegg.com/en/png-zuixl"),
    new Personaje("Ken", "https://www.pngegg.com/en/png-sckte"),
    new Personaje("Chun-Li", "https://www.pngegg.com/en/png-ytiiu"),
    new Personaje("Guile", "https://www.pngegg.com/en/png-igvyf"),
    new Personaje("Blanka", "https://www.pngegg.com/en/png-zukqo"),
    new Personaje("Zangief", "https://w7.pngwing.com/pngs/201/90/png-transparent-zangief-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-zangief-miscellaneous-video-game-fictional-character.png"),
    new Personaje("E. Honda", "https://w7.pngwing.com/pngs/201/90/png-transparent-e-honda-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-e-honda-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Dhalsim", "https://w7.pngwing.com/pngs/201/90/png-transparent-dhalsim-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-dhalsim-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Cammy", "https://w7.pngwing.com/pngs/201/90/png-transparent-cammy-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-cammy-miscellaneous-video-game-fictional-character.png"),
    new Personaje("M. Bison", "https://w7.pngwing.com/pngs/201/90/png-transparent-m-bison-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-m-bison-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Sagat", "https://w7.pngwing.com/pngs/201/90/png-transparent-sagat-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-sagat-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Akuma", "https://w7.pngwing.com/pngs/201/90/png-transparent-akuma-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-akuma-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Vega", "https://w7.pngwing.com/pngs/201/90/png-transparent-vega-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-vega-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Balrog", "https://w7.pngwing.com/pngs/201/90/png-transparent-balrog-street-fighter-ii-street-fighter-iv-street-fighter-v-street-fighter-x-tekken-balrog-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Fang", "https://w7.pngwing.com/pngs/201/90/png-transparent-fang-street-fighter-v-street-fighter-ii-street-fighter-iv-street-fighter-x-tekken-fang-miscellaneous-video-game-fictional-character.png"),
    new Personaje("Laura", "https://w7.pngwing.com/pngs/201/90/png-transparent-laura-street-fighter-v-street-fighter-ii-street-fighter-iv-street-fighter-x-tekken-laura-miscellaneous-video-game-fictional-character.png"),
];

let remainingPersonajes = [...personajes];
const battleDiv = document.getElementById("battle");
const startBattleButton = document.getElementById("start-battle");

startBattleButton.addEventListener("click", () => {
    if (remainingPersonajes.length < 2) {
        const winner = personajes[Math.floor(Math.random() * personajes.length)];
        battleDiv.innerHTML = `<h2>El ganador del torneo es ${winner.name}!</h2>`;
        remainingPersonajes = [...personajes];
        return;
    }

    const randomIndex1 = Math.floor(Math.random() * remainingPersonajes.length);
    const personaje1 = remainingPersonajes.splice(randomIndex1, 1)[0];

    const randomIndex2 = Math.floor(Math.random() * remainingPersonajes.length);
    const personaje2 = remainingPersonajes.splice(randomIndex2, 1)[0];

    battleDiv.innerHTML = `
        <div>
            <h3>${personaje1.name}</h3>
            <img src="${personaje1.imageUrl}.png" alt="${personaje1.name}">
            <img src="${personaje1.imageUrl}" alt="${personaje1.name}">
        </div>
        <div>
            <h3>${personaje2.name}</h3>
            <img src="${personaje2.imageUrl}" alt="${personaje2.name}">
        </div>
    `;
});



