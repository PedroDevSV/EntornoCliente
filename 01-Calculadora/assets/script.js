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
    
const operador = [suma    = document.querySelector('#suma'),
                  resta   = document.querySelector('#resta'),
                  dividir = document.querySelector('#dividir'),
                  igual   = document.querySelector('#igual'),
                  multi   = document.querySelector('#multi')];
                 
     
const punto = document.querySelector('#punto');

let puntosScreen = document.querySelector('#pantalla');

let flagCalculado = false;
//  FUnciones 

const darValor = (num) => {
    if (puntosScreen.value == '0'){
        puntosScreen.value = num;
    }else{
        if (flagCalculado){
            puntosScreen.value = num;
        }else
            puntosScreen.value += num;
    }

    // Para operar, que se haya introducido número antes 
    if (puntosScreen.value != '0'){
        añadirOperar(operador);

    }else 
        alert('No se ha introducido ningún número');

   
};

const borrarTodo = () =>{
    puntosScreen.value = '0';
    flagCalculado = false;
}

const añadirOperar = (op) => {
    // COmprobar qué operador se ha pulsado
    if (op == '/'){
        puntosScreen.value += '/';
    }else if (op == '*'){
        puntosScreen.value += '*';
    }else if (op == '+'){
        puntosScreen.value += '+';
    }else if (op == '-'){
        puntosScreen.value += '-';
    }else if( op == '%'){
        puntosScreen.value += '%';
    }
};

const calcular = () =>{
    if (puntosScreen.value.includes('/') || puntosScreen.value.includes('*') || puntosScreen.value.includes('+') || puntosScreen.value.includes('-') || puntosScreen.value.includes('%')){
        puntosScreen.value = eval(puntosScreen.value);
    }
    flagCalculado = true;
}

