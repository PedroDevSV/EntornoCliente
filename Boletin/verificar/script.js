let ultnum = 0;

let conta = 0;



while (conta < 3){
    ultnum = prompt("Introduce algún número");
     if(parseInt(ultnum)%2==0){
            conta++;
    }else
        conta =0;
   
}

document.write('Has llegado a 3 pares');