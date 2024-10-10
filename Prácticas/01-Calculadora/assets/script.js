//Definimos variables

const punto = document.querySelector("#punto");

let puntosScreen = document.querySelector("#pantalla");
let numGuardado = 0;

//  Función principal para los números

const darValor = (num) => {
    if (puntosScreen.value == "0") {
        puntosScreen.value = num;
    } else {
        puntosScreen.value += num;
    }
};

// Botón C 
const borrarTodo = () => {
    puntosScreen.value = "0";
    flagCalculado = false;
};

// FUncion que borra el ultimo caracter del string
const borrarUlt = () => {
    puntosScreen.value = puntosScreen.value.slice(0, -1);
};

const añadirOperar = (op) => {
    // COmprobar qué operador se ha pulsado
    // Para operar, que se haya introducido número antes
    if (puntosScreen.value != "0") {
        if (op == "/") {
            puntosScreen.value += "/";
        } else if (op == "*") {
            puntosScreen.value += "*";
        } else if (op == "+") {
            puntosScreen.value += "+";
        } else if (op == "-") {
            puntosScreen.value += "-";
        } else if (op == "%") {
            puntosScreen.value += "%";
        }
    }else
        alert("No se ha introducido ningún número");
};

// Funciones para añadir parentesis, teniendo en cuenta que se cierran si se abren
const abrirParentesis = () => {
    if (puntosScreen.value.includes("(")) {
        alert("Ya se ha abierto un paréntesis");
    } else {
        // Comprobar que antes de abrir paréntesis haya un operador en la posición anterior del string 
        
        let ultchar = puntosScreen.value.substring(puntosScreen.value.length - 1, puntosScreen.value.length);

        if (ultchar == '+' || ultchar == '-' || ultchar == '*' || ultchar == '/' || ultchar == '%') {
            puntosScreen.value += "(";
        } else if (ultchar == '0') { // O si está en valor inicial
            puntosScreen.value = "(";
        }else {
            alert("No se puede abrir un paréntesis antes de un operador");
        }
    }
};

const cierraParentesis = () => {
    // Comprobar que se haya abierto un paréntesis
    if (!puntosScreen.value.includes("(")) {
        alert("No se ha abierto ningún paréntesis");
    } else {
        if (puntosScreen.value.includes(")")) {
            alert("Ya se ha cerrado un paréntesis");
        } else
            puntosScreen.value += ")";
    }
};


 
const añadirDecimal = () => {
    /*
        Usamos el split para dividir a partir de operadores (los comprueba todos con ese argumento),
        Con el pop cogemos el último elemento del array, y comprobamos si ese elemento ya contiene "."
    */
    let puedeAgregarDecimal = !puntosScreen.value.split(/[+%*/-]/).pop().includes(".");

    if (puedeAgregarDecimal) {
        
        let ultimoValorEsOperador = isNaN(puntosScreen.value.substring(puntosScreen.value.length - 1, puntosScreen.value.length));

        if(!ultimoValorEsOperador) {
            puntosScreen.value += ".";
        }else{
            alert("No se puede intoducir decimal antes de un número");
        }
     }else{
        alert("Ya se ha introducido un punto decimal");
    }

};

// True si encuentra un operador en string 
const tieneOperador = () => {
    if (puntosScreen.value.includes("/") ||
        puntosScreen.value.includes("*") ||
        puntosScreen.value.includes("+") ||
        puntosScreen.value.includes("-") ||
        puntosScreen.value.includes("%")) {
        return true;
    } else {
        return false;
    }
}

const calcular = () => {
    if (tieneOperador()) {
        puntosScreen.value = eval(puntosScreen.value);
    }

};


const guardar = () => {
    if(!(puntosScreen.value.includes("+") || 
        puntosScreen.value.includes("-") || 
        puntosScreen.value.includes("*") || 
        puntosScreen.value.includes("/") ||
        puntosScreen.value.includes("%") ||
        puntosScreen.value.includes("(") ||
        puntosScreen.value.includes(")"))
        ){
        numGuardado = puntosScreen.value;
        console.log(numGuardado);
        }

};

const pegar = () => {
    // Si es el valor inicial ('0') que sobreescriba 
    if (puntosScreen.value == '0') {
        puntosScreen.value = numGuardado;
    } else {
        puntosScreen.value += numGuardado;
    }
};

