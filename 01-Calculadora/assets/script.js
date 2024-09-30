//Definimos variables 

console.log('Juan imbec cil');
const uno     = document.getElementById("uno"),
      dos     = document.getElementById("dos"),
      tres    = document.getElementById("tres"),
      cuatro  = document.getElementById("cuatro"), 
      cinco   = document.getElementById("cinco"), 
      seis    = document.getElementById("seis"), 
      siete   = document.getElementById("siete"), 
      ocho    = document.getElementById("ocho"), 
      nueve   = document.getElementById('nueve'), 
      cero    = document.getElementById("cero"); 

const suma    = document.getElementById("suma"),
      resta   = document.getElementById("resta"),
      dividir = document.getElementById("dividir"),
      igual   = document.getElementById("igual"),
      multi   = document.getElementById(),
      punto   = document.getElementById("punto");

let puntosScreen = document.getElementById('pantalla');


//  FUnciones 
const darValor = (num) => {
    // if (puntosScreen == '0')
        puntosScreen= num;
    // else 
    //     puntosScreen+='num';
    puntosScreen.value = num;
};

console.log({puntosScreen});







