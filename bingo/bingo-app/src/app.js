function assignBingoNumbers() {
    class Puesto {
        constructor(numero, foto) {
            this.numero = numero;
            this.foto = foto;
        }
    }

    const studentNames = document.getElementById("studentNames").value;
    const namesArray = studentNames.split("-").trim();
    
    const puestos = [];
    for (let i = 1; i <= 30; i++) {
        const foto = `https://realbingoimages.com/ball${i}.png`;
        const puesto = new Puesto(i, foto);
        puestos.push(puesto);
    }
    console.log(puestos);
}

