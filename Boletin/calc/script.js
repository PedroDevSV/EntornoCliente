let ultnum = 0;
let suma = 0;
let media = 0;
let conta =0;

const pedir = () =>{
    ultnum = prompt("Introduce un número");
    suma += parseInt(ultnum);
    conta++;
}

while(ultnum >= 0){
    pedir();
}

media = suma/conta ;
document.write('Suma: '+suma + ' Media: '+media);
