//Definimos variables 


const uno     = document.querySelector('#uno'),
      dos     = document.querySelector('#dos'),
      tres    = document.querySelector('#tres'),
      cuatro  = document.querySelector('#cuatro'), 
      cinco   = document.querySelector('#cinco'), 
      seis    = document.querySelector('#seis'), 
      siete   = document.querySelector('#siete'), 
      ocho    = document.querySelector('#ocho'), 
      nueve   = document.querySelector('#nueve'), 
      cero    = document.querySelector('#cero');
    
const suma    = document.querySelector('#suma'),
      resta   = document.querySelector('#resta'),
      dividir = document.querySelector('#dividir'),
      igual   = document.querySelector('#igual'),
      multi   = document.querySelector('#multi'),
      punto   = document.querySelector('#punto');

let puntosScreen = document.querySelector('#pantalla');

//  FUnciones 
const darValor = (num) => {
    if (puntosScreen.value == '0'){
        puntosScreen.value = num;
    }else{
        puntosScreen.value += num;
    } 
    // Comprobar que no hay operadores
};

const borrarTodo = () =>{
    puntosScreen.value = '0';
}







