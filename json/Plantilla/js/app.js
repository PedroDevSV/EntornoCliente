

//inicializamos la funcion inicio 
document.addEventListener('DOMContentLoaded',init);


function init(){
    fetchData(getRandomInt(1,10));
}

function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}


async function fetchData(id) {
    try {
        const res = await fetch('https://akabab.github.io/starwars-api/api/'+id);
        const data = await res.json();
        pintarCard(data);
    } catch (error) {
        console.log(error);
    }
}

console.log(getRandomInt(1,151));

//FUnction de pintar la template
function pintarCard(pokemon){
    console.log(pokemon);
    // la mostramos en el main .flex
    const main = document.querySelector('.flex');
    const template = document.querySelector('#template-card').content;
    
    // para buenas practicas clonamos. No jodemos estructura del html, clonamos la estrucura base y trab ajamos sobre ese clon. Es una buena practica 
    // evitamos usar innerHtml que genera estrucura quitando la anterior.
    const clone = template.cloneNode(true);
    //crear el fragmento donde se inserta
    const fragment = document.createDocumentFragment();

    clone.querySelector('.card-body-img').setAttribute('src',$id);
    // insetamos con innerhtml al clon
    // clone.querySelector(".card-body-title").innerHTML = `${pokemon.name} <span>${pokemon.stats[0].base_stat} Hp</span>`;
    // clone.querySelector(".card-body-text").textContent = pokemon.base_experience + " exp" ;
    // clone.querySelector(".card-footer-stat1").textContent = pokemon.stats[1].base_stat;
    // clone.querySelector(".card-footer-stat2").textContent = pokemon.stats[3].base_stat;
    // clone.querySelector(".card-footer-stat3").textContent = pokemon.stats[2].base_stat;

    // insertamos
    fragment.appendChild(clone);
    main.appendChild(fragment);
}